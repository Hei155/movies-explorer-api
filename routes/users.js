const router = require('express').Router();
const validator = require('validator');
const { Joi, celebrate } = require('celebrate');
const { getUserInfo, setUserInfo } = require('../controllers/users');

const checkLink = (value) => {
  const result = validator.isURL(value);
  if (result) {
    return value;
  }
  throw new Error('Неправильный URL');
};

router.get('/me', getUserInfo);
router.patch('/me', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().custom(checkLink),
    name: Joi.string().required().min(2).max(30),
  }),
}), setUserInfo);

module.exports = router;
