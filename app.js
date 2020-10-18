const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const usersRouters = require('./routes/users.js');
const cardsRouters = require('./routes/cards.js');

const { PORT = 3000 } = process.env;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = {
    id: '5f68979b35f6152688a52010',
  };

  next();
});

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use('/', usersRouters);
app.use('/', cardsRouters);

app.all('*', (req, res) => {
  res.status(404).send({ message: 'Запрашиваемый ресурс не найден' });
});

app.listen(PORT, () => {
  console.log(`Ссылка на сервер ${PORT}`);
});
