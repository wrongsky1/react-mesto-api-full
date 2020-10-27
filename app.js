const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { celebrate, Joi } = require('celebrate');
const { errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const getCards = require('./routes/cards');
const getUsers = require('./routes/users');
const { login } = require('./controllers/users');
const { createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

const { PORT = 3006 } = process.env;

const app = express();
app.use(require('cors')());

// eslint-disable-next-line import/no-unresolved
require('dotenv').config();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6).max(30),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(/^((http|https):\/\/)(www\.)?([\w\W\d]{1,})(\.)([a-zA-Z]{1,10})([\w\W\d]{1,})?$/),
    email: Joi.string().required().email(),
    password: Joi.string().min(10).required().pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s).*$/),
  }).unknown(true),
}), createUser);

app.use(auth);
app.use('/', getCards);
app.use('/', getUsers);

app.use(errorLogger);
app.use(errors());

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      // eslint-disable-next-line comma-dangle
      message: statusCode === 500 ? 'На сервере произошла ошибка' : message
    });
});
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
