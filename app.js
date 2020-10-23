require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { celebrate, Joi, errors } = require('celebrate');
const requestLimit = require('express-rate-limit');
const usersRouters = require('./routes/users.js');
const cardsRouters = require('./routes/cards.js');
const error = require('./routes/error.js');
const { requestLogger, errorLogger } = require('./middlewares/logger.js');
const { login, createUser } = require('./controllers/users.js');
const auth = require('./middlewares/auth.js');

const { PORT = 3000 } = process.env;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

const limit = requestLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use(cors());
app.use(limit);
app.use(requestLogger);
app.use(errorLogger);
app.use(auth);
app.use('/', usersRouters);
app.use('/', cardsRouters);
app.use('*', error);
app.use(errors());

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().pattern(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/),
    password: Joi.string().required().min(10).pattern(/^\S+$/),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().pattern(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/),
    password: Joi.string().required().min(10).pattern(/^\S+$/),
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
    avatar: Joi.string().required().pattern(/(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/),
  }).unknown(true),
}), createUser);

app.use((err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ message: err.message });
    return;
  }
  console.log(err.name);
  res.status(500).send({ message: `На сервере произошла ошибка: ${err.message}` });
  next();
});

app.listen(PORT, () => {
  console.log(`Ссылка на сервер ${PORT}`);
});
