const router = require('express').Router();
const { Joi, celebrate } = require('celebrate');
const { getMovie, deleteMovie, setMovie } = require('../controllers/movies');

router.get('/', getMovie);
router.post('/', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.number().required(),
    discription: Joi.string().required(),
    image: Joi.string().required(),
    trailer: Joi.string().required(),
    thumbnail: Joi.string().required(),
    movield: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
}), setMovie);
router.delete('/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().hex().required(),
  }),
}), deleteMovie);

module.exports = router;
