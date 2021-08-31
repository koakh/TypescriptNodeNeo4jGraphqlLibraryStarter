import * as neo4j from 'neo4j-driver';
import { EncryptionLevel } from 'neo4j-driver';
import * as config from './config';
import { createDebugger } from './debugger';

// https://neo4j.com/docs/api/javascript-driver/current/function/index.html

const debug = createDebugger('Neo4j');
debug(config);
export const driver = neo4j.driver(
  config.NEO4J_URL,
  neo4j.auth.basic(config.NEO4J_USER, config.NEO4J_PASSWORD),
  { encrypted: config.NEO4J_ENCRYPTION as EncryptionLevel }
);

export async function connect() {
  debug('Connecting');
  await driver.verifyConnectivity();
  debug('Connected');
}

export function disconnect() {
  return driver.close();
}
