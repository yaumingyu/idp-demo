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
import indexRouter from './routes/index';
import usersRouter from './routes/users';
// const configuration = require('./support/configuration');
import Account from './support/account';
import mongoAdapter from './adapters/mongodb';

dotenv.config();

const { Provider } = require('oidc-provider');

// const routes = require('./routes/express');

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
const { PORT, ISSUER = `http://127.0.0.1:${PORT}` } = process.env;
let server;
(async () => {
  const configuration = {
    // ... see available options /docs
    clients: [
      {
        client_id: 'foo',
        client_secret: 'bar',
        redirect_uris: [
          'http://localhost:8081/app1.html',
          'http://localhost:8081/app2.html',
        ],
      // + other client properties
      },
      {
        client_id: 'foo2',
        client_secret: 'bar',
        grant_types: ['refresh_token', 'authorization_code'],
        redirect_uris: ['http://localhost:8081/app1.html', 'http://localhost:8081/app2.html', 'http://localhost:3001/callback'],
      },
    ],
    claims: {
      address: ['address'],
      email: ['email', 'email_verified'],
      phone: ['phone_number', 'phone_number_verified'],
      profile: ['birthdate', 'family_name', 'gender', 'given_name', 'locale', 'middle_name', 'name',
        'nickname', 'picture', 'preferred_username', 'profile', 'updated_at', 'website', 'zoneinfo'],
    },
    features: {
      // sessionManagement: {
      //   enabled: true,
      //   keepHeaders: false,
      // },
      /**
       * 与库捆绑在一起的开箱即用的交互视图使您可以在尝试oidc-provider时跳过无聊的前端部分。
       * 输入任何用户名（将用作子声明值）和任何密码以继续。
       * 确保尽快禁用此功能并将其替换为实际的前端流程和最终用户身份验证流程。
       * 这些视图并不意味着实际用户都不会看到
       */
      // devInteractions: { enabled: false }, // defaults to true

      deviceFlow: { enabled: true }, // defaults to false
      introspection: { enabled: true }, // defaults to false
      revocation: { enabled: true }, // defaults to false
    },
    jwks: {
      keys: [
        {
          d: 'VEZOsY07JTFzGTqv6cC2Y32vsfChind2I_TTuvV225_-0zrSej3XLRg8iE_u0-3GSgiGi4WImmTwmEgLo4Qp3uEcxCYbt4NMJC7fwT2i3dfRZjtZ4yJwFl0SIj8TgfQ8ptwZbFZUlcHGXZIr4nL8GXyQT0CK8wy4COfmymHrrUoyfZA154ql_OsoiupSUCRcKVvZj2JHL2KILsq_sh_l7g2dqAN8D7jYfJ58MkqlknBMa2-zi5I0-1JUOwztVNml_zGrp27UbEU60RqV3GHjoqwI6m01U7K0a8Q_SQAKYGqgepbAYOA-P4_TLl5KC4-WWBZu_rVfwgSENwWNEhw8oQ',
          dp: 'E1Y-SN4bQqX7kP-bNgZ_gEv-pixJ5F_EGocHKfS56jtzRqQdTurrk4jIVpI-ZITA88lWAHxjD-OaoJUh9Jupd_lwD5Si80PyVxOMI2xaGQiF0lbKJfD38Sh8frRpgelZVaK_gm834B6SLfxKdNsP04DsJqGKktODF_fZeaGFPH0',
          dq: 'F90JPxevQYOlAgEH0TUt1-3_hyxY6cfPRU2HQBaahyWrtCWpaOzenKZnvGFZdg-BuLVKjCchq3G_70OLE-XDP_ol0UTJmDTT-WyuJQdEMpt_WFF9yJGoeIu8yohfeLatU-67ukjghJ0s9CBzNE_LrGEV6Cup3FXywpSYZAV3iqc',
          e: 'AQAB',
          kty: 'RSA',
          n: 'xwQ72P9z9OYshiQ-ntDYaPnnfwG6u9JAdLMZ5o0dmjlcyrvwQRdoFIKPnO65Q8mh6F_LDSxjxa2Yzo_wdjhbPZLjfUJXgCzm54cClXzT5twzo7lzoAfaJlkTsoZc2HFWqmcri0BuzmTFLZx2Q7wYBm0pXHmQKF0V-C1O6NWfd4mfBhbM-I1tHYSpAMgarSm22WDMDx-WWI7TEzy2QhaBVaENW9BKaKkJklocAZCxk18WhR0fckIGiWiSM5FcU1PY2jfGsTmX505Ub7P5Dz75Ygqrutd5tFrcqyPAtPTFDk8X1InxkkUwpP3nFU5o50DGhwQolGYKPGtQ-ZtmbOfcWQ',
          p: '5wC6nY6Ev5FqcLPCqn9fC6R9KUuBej6NaAVOKW7GXiOJAq2WrileGKfMc9kIny20zW3uWkRLm-O-3Yzze1zFpxmqvsvCxZ5ERVZ6leiNXSu3tez71ZZwp0O9gys4knjrI-9w46l_vFuRtjL6XEeFfHEZFaNJpz-lcnb3w0okrbM',
          q: '3I1qeEDslZFB8iNfpKAdWtz_Wzm6-jayT_V6aIvhvMj5mnU-Xpj75zLPQSGa9wunMlOoZW9w1wDO1FVuDhwzeOJaTm-Ds0MezeC4U6nVGyyDHb4CUA3ml2tzt4yLrqGYMT7XbADSvuWYADHw79OFjEi4T3s3tJymhaBvy1ulv8M',
          qi: 'wSbXte9PcPtr788e713KHQ4waE26CzoXx-JNOgN0iqJMN6C4_XJEX-cSvCZDf4rh7xpXN6SGLVd5ibIyDJi7bbi5EQ5AXjazPbLBjRthcGXsIuZ3AtQyR0CEWNSdM7EyM5TRdyZQ9kftfz9nI03guW3iKKASETqX2vh0Z8XRjyU',
          use: 'sig',
        }, {
          crv: 'P-256',
          d: 'K9xfPv773dZR22TVUB80xouzdF7qCg5cWjPjkHyv7Ws',
          kty: 'EC',
          use: 'sig',
          x: 'FWZ9rSkLt6Dx9E3pxLybhdM6xgR5obGsj5_pqmnz5J4',
          y: '_n8G69C-A2Xl4xUW2lF0i8ZGZnk_KPYrhv4GbTGu5G4',
        },
      ],
    },
    ttl: {
      AccessToken: 1 * 60 * 60, // 1 hour in seconds
      AuthorizationCode: 10 * 60, // 10 minutes in seconds
      IdToken: 1 * 60 * 60, // 1 hour in seconds
      DeviceCode: 10 * 60, // 10 minutes in seconds
      RefreshToken: 1 * 24 * 60 * 60, // 1 day in seconds
    },

  };
  configuration.findAccount = Account.findAccount;

  console.log('>>>configuration', configuration);
  let adapter;
  if (process.env.MONGODB_URI) {
    adapter = require('./adapters/mongodb').default; // eslint-disable-line global-require
    await adapter.connect();
  }
  const oidc = new Provider(ISSUER, {
    adapter,
    ...configuration,
  });

  // express/nodejs style application callback (req, res, next) for use with express apps, see /examples/express.js
  app.use(oidc.callback);
  // or just expose a server standalone, see /examples/standalone.js
  server = oidc.listen(PORT, () => {
    console.log(`oidc-provider listening on port ${PORT}, check /.well-known/openid-configuration`);
  });
})().catch((err) => {
  if (server && server.listening) server.close();
  console.error(err);
  process.exitCode = 1;
});

export default app;
