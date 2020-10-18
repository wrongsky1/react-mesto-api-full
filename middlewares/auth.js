const jwt = require('jsonwebtoken');
const AuthError = require('../errors/AuthError');

const { NODE_ENV, JWT_SECRET } = process.env;

// при успешной авторизации записываем токен
module.exports = (req, res, next) => {
  const token = req.cookies.jwt;
  let payload;

  try {
    payload = jwt.verify(
      token,
      `${NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret'}`,
    );
  } catch (err) {
    throw new AuthError({ message: 'Что-то не так с авторизацией' });
  }

  req.user = payload;
  next();
};