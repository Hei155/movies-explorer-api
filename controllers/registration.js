const bcrypt = require('bcryptjs');
const User = require('../models/user');
const ErrorApi = require('../exception/ErrorApi');
const errorConfig = require('../utils/errorConfig');

const createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => {
      User.create({
        name: req.body.name,
        password: hash,
        email: req.body.email,
      })
        .then((user) => {
          const { name, email } = user;
          res.status(201).send({ name, email });
        })
        .catch((err) => {
          if (err.name === 'ValidationError') {
            const e = new Error(err);
            e.statusCode = 400;
            next(ErrorApi.BadRequestError(errorConfig.incorrectUserData));
          } else if (err.name === 'MongoServerError' && err.code === 11000) {
            next(ErrorApi.ConflictError(errorConfig.registrationEmailError));
          } else {
            next(err);
          }
        });
    });
};

module.exports = createUser;
