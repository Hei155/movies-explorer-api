const User = require('../models/user');

const getUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (user) {
        res.send(user);
      } else {
        const e = new Error('Not found');
        e.statusCode = 404;
        next(e);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        const e = new Error(err);
        e.statusCode(400);
        next(e);
      } else {
        const e = new Error('Error!');
        next(e);
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
    .then((user) => {
      if (user) {
        res.send(user);
      } else {
        const e = new Error('Not found');
        e.statusCode = 404;
        next(e);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        const e = new Error(err);
        e.statusCode(400);
        next(e);
      } else if (err.name === 'MongoServerError' && err.code === 11000) {
        const e = new Error('Данный email уже зарегистрирован');
        e.statusCode = 409;
        next(e);
      } else {
        const e = new Error('Error!');
        next(e);
      }
    });
};

module.exports = {
  getUserInfo,
  setUserInfo,
};
