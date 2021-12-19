const { NODE_ENV } = process.env;
const { PORT = 3000, MONGO_LINK } = NODE_ENV === 'production' ? process.env : require('./utils/config');
const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const helmet = require('helmet');
require('dotenv').config();
const limiter = require('./helper/requestLimiter');
const helper = require('./helper/helper');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const routes = require('./routes/index');
const { discriminator } = require('./models/user');

const app = express();

app.use(helmet());
app.use(requestLogger);
app.use(limiter);
app.use(express.json());

mongoose.connect(MONGO_LINK, {
  useNewUrlParser: true,
});

app.use(routes);

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