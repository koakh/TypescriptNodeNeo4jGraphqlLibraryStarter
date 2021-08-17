const globalConf = require('../../../jest.config.base');

module.exports = {
  ...globalConf,
  displayName: 'neo4j-gql-starter',
  roots: ['<rootDir>/examples/neo4j-gql-starter/server/src/', '<rootDir>/examples/neo4j-gql-starter/server/tests/'],
  coverageDirectory: '<rootDir>/examples/neo4j-gql-starter/server/coverage/',
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/examples/neo4j-gql-starter/server/src/tsconfig.json',
    },
  },
};
