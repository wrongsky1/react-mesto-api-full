const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getUsers,
  getUserById,
  changeUser,
  changeUserAvatar,
} = require('../controllers/users.js');

router.get('/users', getUsers);

router.get('/users/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex().length(24),
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
    avatar: Joi.string().required().pattern(/(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png)/),
  }),
}), changeUserAvatar);

module.exports = router;
