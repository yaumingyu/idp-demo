/* eslint-disable no-unused-expressions */
/* eslint-disable max-len */
/* eslint-disable no-undef */
import createError from 'http-errors';
import express, { json, urlencoded } from 'express';
import { join } from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';

import helmet from 'helmet';
import dotenv from 'dotenv';
import Provider from 'oidc-provider';
import indexRouter from './routes/index';
import usersRouter from './routes/users';
import * as configuration from './support/configuration';
import Account from './support/account';
import mongodbAdapter from './adapters/mongodb';

// eslint-disable-next-line import/no-unresolved
import routes from './routes/interaction';

dotenv.config();

const app = express();
app.use(helmet());

// view engine setup
app.set('views', join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(join(__dirname, '../public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
const { PORT = 3002, ISSUER = `http://localhost:${PORT}` } = process.env;
configuration.findAccount = Account.findAccount;

let server;
(async () => {
  if (process.env.MONGODB_URI) {
    await mongodbAdapter.connect();
  }
  const provider = new Provider(ISSUER, { mongodbAdapter, ...configuration });

  routes(app, provider);
  // express/nodejs style application callback (req, res, next) for use with express apps, see /examples/express.js
  app.use(provider.callback);
  // or just expose a server standalone, see /examples/standalone.js
  server = app.listen(PORT, () => {
    console.log(`oidc-provider listening on port ${PORT}, check /.well-known/openid-configuration`);
  });
})().catch((err) => {
  if (server && server.listening) server.close();
  console.error(err);
  process.exitCode = 1;
});

export default app;
