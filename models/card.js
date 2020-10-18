const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    require: [true, 'имя карточки, строка от 2 до 30 символов'],
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    require: [true, 'ссылка на картинку'],
    validate: {
      validator(v) {
        return /^((http|https):\/\/)(www\.)?([\w\W\d]{1,})(\.)([a-zA-Z]{1,10})([\w\W\d]{1,})?$/.test(v);
      },
      message: 'Указана некорректная ссылка',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    require: [true, 'ссылка на модель автора карточки'],
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    default: [],
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('card', cardSchema);
