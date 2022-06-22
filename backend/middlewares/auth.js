const jwt = require('jsonwebtoken');
const { Unauthorized } = require('../errors');

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    throw new Unauthorized('Требуется авторизация');
  }

  let payload;

  try {
    payload = jwt.verify(token, 'super-strong-secret');
  } catch (err) {
    return next(new Unauthorized('Требуется авторизация'));
  }

  req.user = payload;
  return next();
};
