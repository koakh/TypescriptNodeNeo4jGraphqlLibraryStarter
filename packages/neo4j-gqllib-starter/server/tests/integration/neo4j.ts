import * as neo4j from 'neo4j-driver';

export async function connect(): Promise<neo4j.Driver> {
  const { NEO4J_USER = 'neo4j', NEO4J_PASSWORD = 'password', NEO4J_URL = 'neo4j://localhost:7687/neo4j' } = process.env;

  const auth = neo4j.auth.basic(NEO4J_USER, NEO4J_PASSWORD);

  const driver = neo4j.driver(NEO4J_URL, auth);

  try {
    await driver.verifyConnectivity();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);

    process.exit(1);
  }

  return driver;
}
