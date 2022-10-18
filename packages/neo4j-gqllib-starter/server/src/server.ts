import express from 'express';
import rateLimit from 'express-rate-limit';
import * as fs from 'fs';
import * as http from 'http';
import * as https from 'https';
import * as path from 'path';
import * as config from './app/config';
import createDebugger from './app/debugger';
import * as graphql from './gql';

export const app = express();

const debug = createDebugger('Server');

// compose https options
const httpsOptions = {
  cert: fs.readFileSync(`./config/${config.HTTPS_SERVER_CERT}`),
  // a PEM containing the SERVER and ALL INTERMEDIATES to prevent
  // curl and insomnia 'SSL certificate problem: unable to get local issuer certificate' problems
  key: fs.readFileSync(`./config/${config.HTTPS_SERVER_KEY}`),
};

// limiter middleware
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 20, // Limit each IP to 20 requests per `window` (here, per 1 minute)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
});

if (config.NODE_ENV === 'production') {
  debug('Production serving statics');

  app.use('/', express.static(path.join(__dirname, '../../dist')));

  app.use('/index.html', (_req, res) => {
    res.sendFile(path.join(__dirname, '../../dist/index.html'));
  });
}

export async function start(): Promise<void> {
  debug(`Starting on PORT ${config.HTTP_SERVER_PORT}`);
  // start apollo server
  const server = await graphql.getServer();
  await server.start();
  server.applyMiddleware({
    app,
    cors: {
      // add '*'
      origin: [...config.CORS_ORIGIN.split(',')],
      methods: 'POST',
      credentials: true
      // preflightContinue: true,
    },
  });

  return new Promise((resolve, reject): void => {
    try {
      if (config.HTTPS_SERVER) {
        // start https express server
        https
          .createServer(httpsOptions, app)
          .listen(config.HTTPS_SERVER_PORT, () => {
            debug(`HTTPS Server running on port [${config.HTTPS_SERVER_PORT}]`);
            debug(`using certificates: ${config.HTTPS_SERVER_CERT}:${config.HTTPS_SERVER_KEY}`);
            resolve();
          });
      } else {
        // start http express server
        http
          .createServer(app)
          .listen(config.HTTP_SERVER_PORT, () => {
            debug(`HTTP Server running on port [${config.HTTP_SERVER_PORT}]`);
            resolve();
          });
      }
    } catch (error) {
      reject(error);
    }
  });
}
