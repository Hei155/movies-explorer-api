const router = require('express').Router();
const { Joi, celebrate } = require('celebrate');
const login = require('../controllers/login');
const registration = require('../controllers/registration');
const logout = require('../controllers/logout');

router.post('/signin', celebrate({
  body: Joi.object().keys({
    password: Joi.string().required(),
    email: Joi.string().required().email(),
  }),
}), login);
router.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    password: Joi.string().required(),
    email: Joi.string().required().email(),
  }),
}), registration);
router.post('/signout', logout);

module.exports = router;
