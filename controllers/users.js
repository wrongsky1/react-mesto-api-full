const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const ValidationError = require('../errors/ValidationError');
const NotFoundError = require('../errors/NotFoundError');
const ConflictError = require('../errors/ConflictError');

const { NODE_ENV, JWT_SECRET } = process.env;

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      res.status(200).send({ data: users });
    })
    .catch(next);
};

const getUserById = (req, res, next) => {
  User.findById(req.params.id === 'me' ? req.user : req.params.id)
    .then((user) => {
      if (user === null || undefined) {
        throw new NotFoundError('Нет пользователя с таким id');
      }
      return res.status(200).send({ data: user });
    })
    .catch(next);
};

// создать пользователя
const createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;
  bcrypt.hash(password, 10)

    .then((hash) => User.create({
      name: name || 'User',
      about: about || 'About user',
      avatar: avatar || 'https://icon-library.com/images/141782.svg.svg',
      email,
      password: hash,
    }))

    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new ValidationError('Заполните все поля: name, about, avatar, email, password');
      } else if (err.name === 'MongoError' || err.code === 11000) {
        throw new ConflictError('Пользователь с таким email уже зарегистрирован');
      }
    })

    .then((user) => {
      const newUser = user;
      newUser.password = '';
      res.status(200).send((newUser));
    })

    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      // создадим токен
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );
      // вернём токен
      res.status(200).send({ token });
    })
    .catch(next);
};

const changeUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      res.status(200).send((user));
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new ValidationError('Ошибка валидации');
      }
      next(err);
    });
};

const changeUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      res.status(200).send((user));
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new ValidationError('Ошибка валидации');
      }
      next(err);
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  changeUser,
  changeUserAvatar,
  login,
};
