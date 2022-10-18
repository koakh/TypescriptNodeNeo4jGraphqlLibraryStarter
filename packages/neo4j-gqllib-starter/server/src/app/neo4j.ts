import * as neo4j from 'neo4j-driver';
// import { EncryptionLevel } from 'neo4j-driver';
import * as config from './config';
import createDebug from './debugger';

export const driver = neo4j.driver(
  config.NEO_URL,
  neo4j.auth.basic(config.NEO_USER, config.NEO_PASSWORD),
  { encrypted: config.NEO_ENCRYPTION === 'ENCRYPTION_ON' }
);
const debug = createDebug('Neo4j');

export async function connect() {
  debug('Connecting');

  const serverInfo = await driver.getServerInfo();
  debug(`serverInfo:`, JSON.stringify(serverInfo, undefined, 0));

  debug('Connected');
}

export function disconnect() {
  return driver.close();
}
