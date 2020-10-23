const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const BadRequestError = require('../errors/BadRequestError');
const ConflictError = require('../errors/ConflictError');
const NotFoundError = require('../errors/NotFoundError');
const AuthError = require('../errors/AuthError');

const { NODE_ENV, JWT_SECRET } = process.env;

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(200).send({ data: users }))
    .catch(next);
};

const getUserById = (req, res, next) => {
  User.findById(req.params._id === 'me' ? req.user : req.params._id)
    .orFail(new NotFoundError({ message: 'Пользователя не существует' }))
    .then((user) => res.status(200).send({ data: user }))
    .catch(next);
};

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .catch((err) => {
      if (err.name === 'MongoError' || err.code === 11000) {
        throw new ConflictError({ message: 'Пользователь с таким email уже существует, введите другой email' });
      } else next(err);
    })
    .then((user) => res.status(201).send({
      data: {
        name: user.name, about: user.about, avatar, email: user.email,
      },
    }))
    .catch(next);
};

const changeUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, {
    new: true,
    runValidators: true,
  })
    .orFail(new NotFoundError())
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError({ message: 'Переданы некорректные данные' });
      } else next(err);
    })
    .then((user) => res.status(200).send({ data: user }))
    .catch(next);
};

const changeUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, {
    new: true,
    runValidators: true,
  })
    .orFail(new NotFoundError())
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError({ message: 'Переданы некорректные данные' });
      } else next(err);
    })
    .then((user) => res.status(200).send({ data: user }))
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );
      res.send({ token });
    })
    .catch(() => next(new AuthError('Неверный email или пароль')));
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  changeUser,
  changeUserAvatar,
  login,
};
