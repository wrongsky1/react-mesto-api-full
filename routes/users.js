const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getUsers,
  getUserById,
  createUser,
  changeUser,
  changeUserAvatar,
} = require('../controllers/users.js');

router.get('/users', getUsers);

router.get('/users/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().length(24).hex(),
  }),
}), getUserById);

// router.post('/users', createUser);

router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }).unknown(true),
}), changeUser);

router.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().uri(),
  }).unknown(true),
}), changeUserAvatar);

module.exports = router;