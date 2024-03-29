import { Neo4jGraphQL } from '@neo4j/graphql';
import { OGM } from '@neo4j/graphql-ogm';
import { Neo4jGraphQLAuthJWTPlugin } from '@neo4j/graphql-plugin-auth';
import { ApolloServer } from 'apollo-server-express';
import * as config from '../app/config';
import { driver } from '../app/neo4j';
import type { Context } from '../types';
import * as Blog from './Blog';
import * as Comment from './Comment';
import * as Post from './Post';
import * as Tag from './Tag';
import * as User from './User';

export const typeDefs = [User.typeDefs, Blog.typeDefs, Post.typeDefs, Comment.typeDefs, Tag.typeDefs];

export const resolvers = {
  ...User.resolvers,
};

export const ogm = new OGM({
  typeDefs,
  driver,
});

export async function getServer(): Promise<ApolloServer> {
  await ogm.init();

  const neoSchema = new Neo4jGraphQL({
    typeDefs,
    resolvers,
    plugins: {
      auth: new Neo4jGraphQLAuthJWTPlugin({
        secret: config.NEO_GRAPHQL_JWT_SECRET,
      }),
    },
  });

  const server: ApolloServer = new ApolloServer({
    schema: await neoSchema.getSchema(),
    context: ({ req }) => ({ ogm, driver, req } as Context),
    formatError: (err) => {
      if (err.extensions.code === 'INTERNAL_SERVER_ERROR') {
        return new Error(err.message);
      }
      return err;
    },
  });

  return server;
}
