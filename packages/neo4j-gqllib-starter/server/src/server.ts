import express from 'express';
import * as http from 'http';
import * as fs from 'fs';
import * as https from 'https';
import * as path from 'path';
import * as config from './app/config';
import { createDebugger } from './app/debugger';
import * as graphql from './gql';

export const app = express();

// compose https options
const httpsOptions = {
  cert: fs.readFileSync(`./config/${config.HTTPS_SERVER_CERT}`),
  // a PEM containing the SERVER and ALL INTERMEDIATES to prevent
  // curl and insomnia 'SSL certificate problem: unable to get local issuer certificate' problems
  key: fs.readFileSync(`./config/${config.HTTPS_SERVER_KEY}`),
};

const debug = createDebugger('HTTP');

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
  await graphql.server.start();
  graphql.server.applyMiddleware({
    app,
    cors: {
      // add '*'
      origin: [...config.CORS_ORIGIN.split(',')],
      methods: 'POST',
      credentials: true
      // preflightContinue: true,
    }
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
