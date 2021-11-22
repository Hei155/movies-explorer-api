const Movie = require('../models/movie');

const getMovie = (req, res, next) => {
  Movie.find({})
    .then((movies) => {
      res.status(200).send(movies);
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
    discription,
    image,
    trailer,
    thumbnail,
    nameRU,
    nameEN,
  } = req.body;
  Movie.create(
    {
      country,
      director,
      duration,
      year,
      discription,
      image,
      trailer,
      thumbnail,
      owner: req.user._id,
      nameRU,
      nameEN,
    },
  )
    .then((movie) => {
      res.status(200).send(movie);
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
        const userId = JSON.stringify(req.user._id);
        const movieOwner = JSON.stringify(movie.owner);
        if (userId === movieOwner) {
          Movie.findByIdAndDelete(id)
            .then(() => res.status(200).send(movie));
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
