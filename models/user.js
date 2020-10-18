const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: [true, 'имя пользователя, строка от 2 до 30 символов'],
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: [true, 'информация о пользователе, строка от 2 до 30 символов'],
  },
  avatar: {
    type: String,
    validate: {
      validator(v) {
        return /^((http|https):\/\/)(www\.)?([\w\W\d]{1,})(\.)([a-zA-Z]{1,10})([\w\W\d]{1,})?$/.test(v);
      },
      message: 'Данная ссылка некорректна, введите верную ссылку...',
    },
    required: [true, 'Введите ссылку для аватара'],
  },
});

module.exports = mongoose.model('user', userSchema);
