const jwt = require('jsonwebtoken');

const { JWT_SECRET } = process.env;

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
