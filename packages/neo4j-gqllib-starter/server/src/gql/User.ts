import { gql } from 'apollo-server-express';
import { appConstants as c } from '../app/constants';
import { validateSignUp } from '../schema/sign-up.schema';
import { OgmModel } from '../types/enums';
import { Context } from '../types/types';
import { comparePassword, createJWT, hashPassword } from '../utils/authentication';

async function signUp(_root, args: { email: string; password: string }, context: Context) {
  const User = context.ogm.model(OgmModel.User);
  await validateSignUp({ email: args.email, password: args.password })
    .catch((err) => {
      throw new Error(`${err.name}: ${err.errors.join(',')}`);
    });

  const [existing] = await User.find({
    where: { email: args.email },
    context: { ...context, adminOverride: true },
  });
  if (existing) {
    throw new Error('user with that email already exists');
  }

  const hash = await hashPassword(args.password);

  const [user] = (
    await User.create({
      input: [
        {
          email: args.email,
          password: hash,
          roles: c.authentication.defaultUserRole,
        },
      ],
    })
  ).users;

  return createJWT({ sub: user.id, roles: user.roles });
}

async function signIn(_root, args: { email: string; password: string }, context: Context) {
  const User = context.ogm.model(OgmModel.User);

  const [existing] = await User.find({
    where: { email: args.email },
    context: { ...context, adminOverride: true },
  });

  if (!existing) {
    throw new Error('user not found');
  }

  const equal = await comparePassword(args.password, existing.password);
  if (!equal) {
    throw new Error('Unauthorized');
  }

  const jwt = await createJWT({ sub: existing.id, roles: existing.roles });

  return jwt;
}

export const typeDefs = gql`
  enum UserRole {
    ROLE_USER,
    ROLE_ADMIN
  }

  type User {
    id: ID! @id
    email: String!
    roles: [UserRole!]!
    createdBlogs: [Blog] @relationship(type: "HAS_BLOG", direction: OUT)
    createdTags: [Tag] @relationship(type: "HAS_TAG", direction: OUT)
    authorsBlogs: [Blog] @relationship(type: "CAN_POST", direction: OUT)
    password: String! @private
    createdAt: DateTime @timestamp(operations: [CREATE])
    updatedAt: DateTime @timestamp(operations: [UPDATE])
  }

  # custom resolvers
  type Mutation {
    signUp(email: String!, password: String!): String # JWT
    signIn(email: String!, password: String!): String # JWT
  }

  # authentication
  extend type User
    @auth(
      rules: [
        # used in seeder
        { operations: [CREATE,UPDATE,DELETE,CONNECT,DISCONNECT], roles: ["ROLE_ADMIN"] }
        { operations: [CONNECT], isAuthenticated: true }
        { operations: [UPDATE], allow: { id: "$jwt.sub" }, bind: { id: "$jwt.sub" } }
        { operations: [DELETE], allow: { id: "$jwt.sub" } }
        {
          operations: [DISCONNECT]
          allow: {
            OR: [
              { id: "$jwt.sub" }
              { createdBlogs: { OR: [{ creator: { id: "$jwt.sub" } }, { authors: { id: "$jwt.sub" } }] } }
              { createdTags: { OR: [{ creator: { id: "$jwt.sub" } }, { authors: { id: "$jwt.sub" } }] } }
              { authorsBlogs: { OR: [{ creator: { id: "$jwt.sub" } }, { authors: { id: "$jwt.sub" } }] } }
            ]
          }
        }
      ]
    )
  `;

export const resolvers = {
  Mutation: {
    signUp,
    signIn,
  },
};
