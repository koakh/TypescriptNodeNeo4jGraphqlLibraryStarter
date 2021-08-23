import { createDebugger } from './app/debugger';
import * as neo4j from './app/neo4j';
import * as server from './server';

const debug = createDebugger('Application');

async function main() {
  debug('Starting');
  await neo4j.connect();
  await server.start();
  debug('Started');
}

main();
