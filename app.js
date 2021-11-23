const express = require('express');
const mongoose = require('mongoose');
const { Joi, celebrate, errors } = require('celebrate');
const helmet = require('helmet');
const limiter = require('./helper/requestLimiter');
const helper = require('./helper/helper');
const login = require('./controllers/login');
const registration = require('./controllers/registration');
const logout = require('./controllers/logout');
const auth = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000, MONGO_LINK } = process.env;
const app = express();

app.use(helmet());
app.use(limiter);
app.use(express.json());

mongoose.connect(MONGO_LINK, {
  useNewUrlParser: true,
});

app.use(requestLogger);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    password: Joi.string().required(),
    email: Joi.string().required().email(),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    password: Joi.string().required(),
    email: Joi.string().required().email(),
  }),
}), registration);

app.post('/signout', logout);

app.use(auth);

app.use(require('./routes/users'));
app.use(require('./routes/movies'));

app.use((req, res, next) => {
  const e = new Error('Маршрут не найден');
  e.statusCode = 404;
  next(e);
});

app.use(errorLogger);
app.use(errors());
app.use(helper);

app.listen(PORT, () => {
  console.log('Запущен!');
});
