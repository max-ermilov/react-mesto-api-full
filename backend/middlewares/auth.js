const jwt = require('jsonwebtoken');
const { Unauthorized } = require('../errors');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  // == cookie auth statrt
  // const token = req.cookies.jwt;
  // if (!token) {
  //   throw new Unauthorized('Требуется авторизация');
  // }
  // == cookie auth end

  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new Unauthorized('Требуется авторизация');
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'super-strong-secret');
  } catch (err) {
    return next(new Unauthorized('Требуется авторизация'));
  }

  req.user = payload;
  return next();
};
