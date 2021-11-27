const { NODE_ENV } = process.env;
const { JWT_SECRET } = NODE_ENV === 'production' ? process.env : require('../utils/config');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const ErrorApi = require('../exception/ErrorApi');
const errorConfig = require('../utils/errorConfig');
const User = require('../models/user');

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        next(ErrorApi.UnauthorizedError(errorConfig.unauthorizatedError));
      } else {
        bcrypt.compare(password, user.password)
          .then((matched) => {
            if (!matched) {
              next(ErrorApi.UnauthorizedError(errorConfig.unauthorizatedError));
            } else {
              const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
              res.cookie('jwt', token, {
                maxAge: 3600000,
                httpOnly: true,
              });
              res.send({ token });
            }
          })
          .catch((err) => {
            next(err);
          });
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(ErrorApi.BadRequestError(errorConfig.incorrectUserData));
      } else {
        next(err);
      }
    });
};

module.exports = login;
