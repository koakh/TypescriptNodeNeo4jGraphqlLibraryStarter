import express from 'express';
import * as path from 'path';
import * as config from './app/config';
import { createDebugger } from './app/debugger';
import * as graphql from './gql';

export const app = express();

const debug = createDebugger('HTTP');

if (config.NODE_ENV === 'production') {
  debug('Production serving statics');

  app.use('/', express.static(path.join(__dirname, '../../dist')));

  app.use('/index.html', (_req, res) => {
    res.sendFile(path.join(__dirname, '../../dist/index.html'));
  });
}

export async function start(): Promise<void> {
  debug(`Starting on PORT ${config.HTTP_PORT}`);
  // start apollo server
  await graphql.server.start();
  graphql.server.applyMiddleware({ app });

  return new Promise((resolve, reject): void => {
    try {
      app.listen(config.HTTP_PORT, () => {
        debug('Started');

        resolve();
      });
    } catch (error) {
      reject(error);
    }
  });
}
