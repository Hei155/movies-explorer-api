const User = require('../models/user');
const ErrorApi = require('../exception/ErrorApi');
const errorConfig = require('../utils/errorConfig');

const getUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => next(ErrorApi.NotFoundError(errorConfig.userError)))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(ErrorApi.NotFoundError(errorConfig.userError));
      } else {
        next(err);
      }
    });
};

const setUserInfo = (req, res, next) => {
  User.findByIdAndUpdate(
    req.user._id,
    {
      name: req.body.name,
      email: req.body.email,
    },
    { new: true },
  )
    .orFail(() => next(ErrorApi.NotFoundError(errorConfig.userError)))
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = {
  getUserInfo,
  setUserInfo,
};
