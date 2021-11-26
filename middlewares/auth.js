const { NODE_ENV } = process.env;
const { JWT_SECRET } = NODE_ENV === 'production' ? process.env : require('../utils/config');
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  const err = new Error('Необходима авторизация');
  err.statusCode = 401;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(err);
  } else {
    const token = authorization.replace('Bearer ', '');
    let payload;
    try {
      payload = jwt.verify(token, JWT_SECRET);
    } catch (e) {
      next(err);
    }
    req.user = payload;
    next();
  }
};
