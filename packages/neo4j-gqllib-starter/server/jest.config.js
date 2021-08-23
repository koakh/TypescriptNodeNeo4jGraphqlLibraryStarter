const globalConf = require('../../../jest.config.base');

module.exports = {
  ...globalConf,
  displayName: 'neo4j-gqllib-starter',
  roots: ['<rootDir>/examples/neo4j-gqllib-starter/server/src/', '<rootDir>/examples/neo4j-gqllib-starter/server/tests/'],
  coverageDirectory: '<rootDir>/examples/neo4j-gqllib-starter/server/coverage/',
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/examples/neo4j-gqllib-starter/server/src/tsconfig.json',
    },
  },
};
