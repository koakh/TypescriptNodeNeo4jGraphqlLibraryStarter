const baseConfig = require("./jest.config.base");

module.exports = {
    ...baseConfig,
    projects: ["<rootDir>/examples/neo4j-gql-starter/server/jest.config.js", "<rootDir>/packages/*/jest.config.js"],
    coverageDirectory: "<rootDir>/coverage/",
    collectCoverageFrom: ["<rootDir>/packages/*/src/**/*.{ts,tsx}"],
};
