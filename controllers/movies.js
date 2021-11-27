const Movie = require('../models/movie');
const ErrorApi = require('../exception/ErrorApi');
const errorConfig = require('../utils/errorConfig');

const getMovie = (req, res, next) => {
  Movie.find({})
    .then((movies) => {
      res.send(movies);
    })
    .catch((err) => {
      next(err);
    });
};

const setMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;
  Movie.create(
    {
      country,
      director,
      duration,
      year,
      description,
      image,
      trailer,
      thumbnail,
      movieId,
      owner: req.user._id,
      nameRU,
      nameEN,
    },
  )
    .then((movie) => {
      res.send(movie);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(ErrorApi.BadRequestError(errorConfig.incorrectMovieData));
      } else {
        next(err);
      }
    });
};

const deleteMovie = (req, res, next) => {
  const { id } = req.params;
  Movie.findById(id)
    .orFail(() => next(ErrorApi.NotFoundError(errorConfig.movieDeleteDoesNotExist)))
    .then((movie) => {
      if (req.user._id.toString() === movie.owner.toString()) {
        return movie.remove()
          .then(() => res.send({ message: 'Фильм удалён' }));
      }
      return next(ErrorApi.ForbiddenError(errorConfig.movieDeleteError));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(ErrorApi.BadRequestError(errorConfig.movieDeleteDoesNotExist));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getMovie,
  setMovie,
  deleteMovie,
};
