import { gql } from 'apollo-server-express';

export const typeDefs = gql`
  type Tag {
    id: ID! @id
    name: String!
    blog: Blog @relationship(type: "HAS_TAG", direction: IN)
    posts: [Post] @relationship(type: "HAS_TAG", direction: IN)
    creator: User @relationship(type: "CREATE", direction: IN)
    canEdit: Boolean
      @cypher(
        statement: """
        OPTIONAL MATCH (this)<-[:CREATE]-(creator:User {id: $auth.jwt.sub})
        OPTIONAL MATCH (this)<-[:HAS_TAG]-(blog:Blog)
        OPTIONAL MATCH (blog)<-[:HAS_BLOG]-(blogCreator:User {id: $auth.jwt.sub})
        OPTIONAL MATCH (blog)<-[:CAN_POST]-(blogAuthors:User {id: $auth.jwt.sub})
        WITH (
          (creator IS NOT NULL) OR
          (blogCreator IS NOT NULL) OR
          (blogAuthors IS NOT NULL)
        ) AS canEdit
        RETURN canEdit
        """
      )
    canDelete: Boolean
      @cypher(
        statement: """
        OPTIONAL MATCH (this)<-[:CREATE]-(creator:User {id: $auth.jwt.sub})
        OPTIONAL MATCH (this)<-[:HAS_TAG]-(blog:Blog)
        OPTIONAL MATCH (blog)<-[:HAS_BLOG]-(blogCreator:User {id: $auth.jwt.sub})
        WITH (
            (creator IS NOT NULL) OR
            (blogCreator IS NOT NULL)
        ) AS canDelete
        RETURN canDelete
        """
      )
    createdAt: DateTime @timestamp(operations: [CREATE])
    updatedAt: DateTime @timestamp(operations: [UPDATE])
  }

  # authentication
  extend type Tag
    @auth(
      rules: [
        # used in seeder
        { operations: [CREATE,UPDATE,DELETE,CONNECT,DISCONNECT], roles: ["ROLE_ADMIN"] }
        { operations: [CREATE], bind: { creator: { id: "$jwt.sub" } } }
        {
          operations: [UPDATE]
          allow: { creator: { id: "$jwt.sub" } }
          bind: { creator: { id: "$jwt.sub" } }
        }
        {
          operations: [CONNECT]
          allow: { creator: { id: "$jwt.sub" } }

        }
        {
          operations: [DISCONNECT]
          allow: {
            OR: [
              { creator: { id: "$jwt.sub" } }
              { authors: { id: "$jwt.sub" } }
              { posts: { author: { id: "$jwt.sub" } } }
            ]
          }
        }
        { operations: [DELETE], allow: { creator: { id: "$jwt.sub" } } }
      ]
    )
`;
