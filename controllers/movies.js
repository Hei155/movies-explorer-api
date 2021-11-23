const Movie = require('../models/movie');

const getMovie = (req, res, next) => {
  Movie.find({})
    .then((movies) => {
      res.send(movies);
    })
    .catch(() => {
      const e = new Error('Error!');
      e.statusCode = 500;
      next(e);
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
        const e = new Error('Проверьте введенные данные');
        e.statusCode = 400;
        next(e);
      } else {
        const e = new Error('Error!');
        next(e);
      }
    });
};

const deleteMovie = (req, res, next) => {
  const { id } = req.params;
  Movie.findById(id)
    .then((movie) => {
      if (movie) {
        const userId = String(req.user._id);
        const movieOwner = String(movie.owner);
        if (userId === movieOwner) {
          Movie.findByIdAndDelete(id)
            .then(() => res.send(movie))
            .catch((err) => {
              if (err.name === 'CastError') {
                const e = new Error(err);
                e.statusCode = 400;
                next(e);
              } else {
                const e = new Error('Error!');
                next(e);
              }
            });
        } else {
          const e = new Error('Вы не можете удалить фильм другого пользователя');
          e.statusCode = 403;
          next(e);
        }
      } else {
        const e = new Error('Такой карточки нет');
        e.statusCode = 404;
        next(e);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        const e = new Error(err);
        e.statusCode = 400;
        next(e);
      } else {
        const e = new Error('Error!');
        next(e);
      }
    });
};

module.exports = {
  getMovie,
  setMovie,
  deleteMovie,
};
