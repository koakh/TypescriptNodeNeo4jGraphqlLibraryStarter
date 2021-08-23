import { Neo4jGraphQL } from '@neo4j/graphql';
import { OGM } from '@neo4j/graphql-ogm';
import { ApolloServer } from 'apollo-server-express';
import * as config from '../app/config';
import { driver } from '../app/neo4j';
import { Context } from '../types/types';
import * as Blog from './Blog';
import * as Comment from './Comment';
import * as Post from './Post';
import * as Tag from './Tag';
import * as User from './User';

export const typeDefs = [User.typeDefs, Blog.typeDefs, Post.typeDefs, Comment.typeDefs, Tag.typeDefs];

export const resolvers = {
  // custom resolvers
  ...User.resolvers,
};

export const ogm = new OGM({
  typeDefs,
  driver,
});

export const neoSchema = new Neo4jGraphQL({
  typeDefs,
  resolvers,
  config: {
    jwt: {
      secret: config.NEO4J_GRAPHQL_JWT_SECRET,
    },
  },
});

export const server: ApolloServer = new ApolloServer({
  context: ({ req }) => ({ ogm, driver, req } as Context),
  schema: neoSchema.schema,
  introspection: true,
  debug: true,
});
