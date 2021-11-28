const router = require('express').Router();
const { Joi, celebrate } = require('celebrate');
const validator = require('validator');
const { getMovie, deleteMovie, setMovie } = require('../controllers/movies');

const checkLink = (value) => {
  const result = validator.isURL(value);
  if (result) {
    return value;
  }
  throw new Error('Неправильный URL');
};

router.get('/movies', getMovie);
router.post('/movies', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.number().required(),
    description: Joi.string().required(),
    image: Joi.string().required().custom(checkLink),
    trailer: Joi.string().required().custom(checkLink),
    thumbnail: Joi.string().required().custom(checkLink),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
}), setMovie);
router.delete('/movies/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().required(),
  }),
}), deleteMovie);

module.exports = router;
