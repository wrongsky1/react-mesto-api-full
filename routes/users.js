const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getUsers } = require('../controllers/users');
const { getUserById } = require('../controllers/users');
const { changeUser } = require('../controllers/users');
const { changeUserAvatar } = require('../controllers/users');

router.get('/users', getUsers);

router.get('/users/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().hex().length(24),
  }),
}), getUserById);

router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), changeUser);

router.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(/^((http|https):\/\/)(www\.)?([\w\W\d]{1,})(\.)([a-zA-Z]{1,10})([\w\W\d]{1,})?$/),
  }),
}), changeUserAvatar);

module.exports = router;
