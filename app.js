const express = require('express');
const mongoose = require('mongoose');
const { Joi, celebrate, errors } = require('celebrate');
const helper = require('./helper/helper');
const login = require('./controllers/login');
const registration = require('./controllers/registration');
const auth = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000 } = process.env;
const app = express();

app.use(express.json());

mongoose.connect('mongodb://localhost:27017/bitfilmsdb', {
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

app.use('/users', auth, require('./routes/users'));
app.use('/movies', auth, require('./routes/movies'));

app.use(errorLogger);
app.use(errors());
app.use(helper);

app.listen(PORT, () => {
  console.log('Запущен!');
});
