/* eslint-disable func-names */
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const AuthError = require('../errors/AuthError');

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
      message: 'Данная ссылка некорректна, введите верную ссылку.',
    },
    required: [true, 'Введите ссылку для аватара'],
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(email) {
        return validator.isEmail(email);
      },
      message: 'Вы ввели некорректный email',
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 10,
    select: false,
  },
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new AuthError({ message: 'Неверный email или пароль' });
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new AuthError({ message: 'Неверный email или пароль' });
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
