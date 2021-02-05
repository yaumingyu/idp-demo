/* eslint-disable no-unused-expressions */
/* eslint-disable max-len */
/* eslint-disable no-undef */
import createError from 'http-errors';
import express, { json, urlencoded } from 'express';
import { join } from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';

import helmet from 'helmet';
import indexRouter from './routes/index';
import usersRouter from './routes/users';

const { Provider } = require('oidc-provider');
const configuration = require('./support/configuration');

const app = express();
app.use(helmet());

// view engine setup
app.set('views', join(__dirname, 'views'));
app.set('view engine', 'jade');

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
const { PORT = 3000, ISSUER = `http://127.0.0.1:${PORT}` } = process.env;
let server;
(async () => {
  console.log('>>ISSUER', ISSUER);
  console.log('>>configuration', configuration);
  const configuration2 = {
    // ... see available options /docs
    clients: [{
      client_id: 'foo',
      client_secret: 'bar',
      redirect_uris: ['http://lvh.me:8080/cb'],
      // + other client properties
    }],
  };

  const oidc = new Provider(ISSUER, configuration2);

  // express/nodejs style application callback (req, res, next) for use with express apps, see /examples/express.js
  oidc.callback;

  // koa application for use with koa apps, see /examples/koa.js
  oidc.app;

  // or just expose a server standalone, see /examples/standalone.js
  server = oidc.listen(3000, () => {
    console.log('oidc-provider listening on port 3000, check http://localhost:3000/.well-known/openid-configuration');
  });
})().catch((err) => {
  if (server && server.listening) server.close();
  console.error(err);
  process.exitCode = 1;
});

export default app;
