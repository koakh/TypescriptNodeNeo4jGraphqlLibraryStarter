# Neo4J GraphQL Library

  packages/neo4j-gqllib-starter/server/src/gql/User.ts
  seems that we can't have enums and arrays

  enum UserRole {
    ROLE_ADMIN,
    ROLE_USER
  }

  ko
  roles: [UserRole!]!
  ok
  roles: [String!]!

  fail on seeder

  create issue with current version of neo4j library
