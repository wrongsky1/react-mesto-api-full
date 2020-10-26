const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  name: {
    type: String, // тип данныйх - строка
    required: true, // поле обязательно для заполнения
    minlength: 2, // минимальная длина — 2 символа
    maxlength: 30, // максимальная длина - 30 символов
  },
  link: {
    type: String, // тип данныйх - строка
    required: true, // поле обязательно для заполнения
    validate: { // валидация URL
      validator(v) {
        return /^((http|https):\/\/)(www\.)?([\w\W\d]{1,})(\.)([a-zA-Z]{1,10})([\w\W\d]{1,})?$/.test(v);
      },
      message: (props) => `${props.value} is not a valid URL!`,
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId, // тип - ObjectId
    ref: 'user', // ссылка на модель автора карточки,
    required: true, // обязательное поле
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId, // тип - массив ObjectId
    default: [], // по умолчанию массив
  }],
  createdAt: {
    type: Date, // тип - Дата
    default: Date.now, // по умолчанию  - дата сейчас
  },
});

module.exports = mongoose.model('card', cardSchema);
