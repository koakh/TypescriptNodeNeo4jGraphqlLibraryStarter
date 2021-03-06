# NOTES

## Clone project

```shell
$ git clone https://github.com/neo4j/graphql.git
```

## Convert NeoPush to a starter project

first remove packages `graphql`, `ogm` and `package-tests`

and move `examples/migration` and `examples/neo4j-gqllib-starter` projects to `packages` 

```shell
$ rm README.md packages/graphql/ packages/ogm/ packages/package-tests/ -R
$ mv examples/README.md .
$ mv examples/migration/ packages/
$ mv examples/neo4j-gqllib-starter/ packages/
$ rm examples docs -R
```

![image](./attachments/2021-08-15-22-23-52.png)

`packages/neo4j-gqllib-starter/server/.env.example`

```shell
# NEO4J_USER=admin
NEO4J_USER=neo4j
NEO4J_PASSWORD=password
```

> don't forget to change username to `neo4j`

create neo4j database withn `password` password and add APOC

### package.json

edit `package.json` and change `workspaces` to

```json
  "workspaces": [
    "packages/neo4j-gqllib-starter/server",
    "packages/neo4j-gqllib-starter/client"
  ],
```

### tsconfig.json

edit `tsconfig.json` and remove bellow lines and replace `examples` with `packages` on the others

```json
        { "path": "./packages/graphql/src/tsconfig.json" },
        { "path": "./packages/ogm/src/tsconfig.json" },
```

```json
{
  "files": [],
  "references": [
    { "path": "./packages/neo4j-gqllib-starter/client/src/tsconfig.json" },
    { "path": "./packages/neo4j-gqllib-starter/server/src/tsconfig.json" }
  ]
}
```

### tsconfig.json server

`packages/neo4j-gqllib-starter/server/src/tsconfig.json`

change

```json
{
  "extends": "../../../../tsconfig.base.json",
  "compilerOptions": {
    "baseUrl": "./",
    "outDir": "../dist",
    "paths": {
      "@neo4j/graphql": ["../../../../packages/graphql/src"],
      "@neo4j/graphql-ogm": ["../../../../packages/ogm/src"]
    },
    "target": "ES2019"
  },
  "references": [
    { "path": "../../../../packages/graphql/src/tsconfig.json" },
    { "path": "../../../../packages/ogm/src/tsconfig.json" }
  ]
}
```

with

```json
{
  "extends": "../../../../tsconfig.base.json",
  "compilerOptions": {
    "baseUrl": "./",
    "outDir": "../dist",
    "target": "ES2019"
  }
}
```

`packages/neo4j-gqllib-starter/server/tests/tsconfig.json`

change

```json
{
  "extends": "../../../../tsconfig.base.json",
  "compilerOptions": {
    "types": ["node", "jest"],
    "paths": {
      "@neo4j/graphql": ["../../../../packages/graphql/src"],
      "@neo4j/graphql-ogm": ["../../../../packages/ogm/src"]
    }
  },
  "references": [
    { "path": "../src/tsconfig.json" },
    { "path": "../../../../packages/ogm/src/tsconfig.json" },
    { "path": "../../../../packages/graphql/src/tsconfig.json" }
  ]
}
```

with

```json
{
  "extends": "../../../../tsconfig.base.json",
  "compilerOptions": {
    "types": ["node", "jest"]
  }
}
```

### Eslit

edit `.eslintrc.js` and change `examples/neo4j-gqllib-starter` to `packages/neo4j-gqllib-starter`

## Bootstrap NeoPush TLDR

read [README.md](packages/neo4j-gqllib-starter/README.md)

```shell
$ cp packages/neo4j-gqllib-starter/server/.env.example packages/neo4j-gqllib-starter/server/.env
$ cp packages/neo4j-gqllib-starter/client/.env.example packages/neo4j-gqllib-starter/client/.env
$ code packages/neo4j-gqllib-starter/server/.env
$ code packages/neo4j-gqllib-starter/client/.env
```

1. update all packages to latest releases, with `npm npm-check -u`

```shell
# yarn workspaces install dependencies
$ yarn
```

## Fix Apollo Server 3.0

```shell
Error: You must `await server.start()` before calling `server.applyMiddleware()`
```

`packages/neo4j-gqllib-starter/server/src/server.ts`

```typescript
export const app = express();
// remove bellow line
// graphql.server.applyMiddleware({ app });

...
// export function start(): Promise<void> {
// add async
export async function start(): Promise<void> {
  debug(`Starting on PORT ${config.HTTP_PORT}`);
  // add bellow lines to start server and apply middleware
  await graphql.server.start();
  graphql.server.applyMiddleware({ app });
```

> now when we run project, after seed etc, we have apollo studio at <http://localhost:5000/graphql>

## Seed

fix `seeder.ts` adding `node:`

```json
posts: {
  create: new Array(3).fill(null).map(() => ({
    // ADD NODE node: {
    node: {
      title: faker.lorem.word(),
      content: faker.lorem.paragraphs(4),
      author: {
        connect: { where: { node: { id: user.id } } },
      },
      comments: {
        create: new Array(3).fill(null).map(() => {
          const u = users[Math.floor(Math.random() * users.length)];

          return {
            // ADD NODE node: {
            node: {
              content: faker.lorem.paragraph(),
              author: {
                connect: { where: { node: { id: u.id } } },
              },
            // ADD NODE }
            }
          };
        }),
      },
    // ADD NODE }  
    }
  })),
},
```

```shell
$ yarn run neo4j-gqllib-starter:seed
  Server:Seeder Seeding Started +0ms
  Server:Neo4j Connecting +0ms
  Server:Neo4j Connected +52ms
  Server:Seeder Seeding Finished +3s
```

check sed data with

```cypher
MATCH (n) RETURN n
```

## Run Backend and Frontend

**Once seeded used the default credentials to log in**

1. Email: admin@admin.com
2. Password: password

Run the `webpack` and `graphql` servers with;

```shell
$ yarn run neo4j-gqllib-starter
```

- [Frontend](http://localhost:4000)
- [GraphQL Playground](http://localhost:5000/graphql)

## Fix Eslint

```shell
(node:690) [DEP0128] DeprecationWarning: Invalid 'main' field in '/home/mario/Development/Neo4j/_/graphql/node_modules/eslint-config-airbnb-typescript/package.json' of 'dist/eslint-config-airbnb-typescript.js'. Please either fix that or report it to the module author
```

> above error occurs after try to commit, husky triggers eslint

## Change NeoPush project to Other name

`package.json`

```json
{
  "name": "@koakh/typescript-node-neo4j-graphql-library-starter",
  "author": "koakh",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/koakh/TypescriptNodeNeo4jGraphqlLibraryStarter.git"
  },
```

1. change all `neo4j-gqllib-starter` string with `neo4j-gqllib-starter`
2. `mv packages/neo4j-gqllib-starter/ packages/neo4j-gqllib-starter` mv .yarnrc.yml .yarnrc.yml_
3. run `yarn install` to reconfigure workspaces
4. `npm run neo4j-gqllib-starter`https://stackoverflow.com/questions/64722201/yarn-command-yarn-import-error-this-package-doesnt-seem-to-be-present-in-you
mv .yarnrc.yml_ .yarnrc.yml....Internal Error: @koakh/typescript-node-neo4j-graphql-library-starter@workspace:.: This package doesn't seem to be present in your lockfile; try to make an install to update your resolutions...fix with yarn set version from sources......fixed in 2.4.2 fix with yarn set version 2.4.2



$ yarn -v
2.4.1
# fix
$ yarn set version berry && yarn set version 2.4.2
??? YN0000: Downloading https://github.com/yarnpkg/berry/raw/%40yarnpkg/cli/2.4.2/packages/yarnpkg-cli/bin/yarn.js
??? YN0000: Saving the new release in .yarn/releases/yarn-2.4.2.cjs
??? YN0000: Done in 21s 491ms
$ yarn -v
2.4.2

# wait....now it will finish the install and update yarn.lock with workspaces, and `npm run neo4j-gqllib-starter` start working again
$ yarn install
??? YN0000: ??? Completed in 14s 483ms
??? YN0000: Done with warnings in 2m 9s



# fix some deprecated packages
??? YN0061: ??? apollo-tracing@npm:0.15.0 is deprecated: The `apollo-tracing` package is no longer part of Apollo Server 3. See https://www.apollographql.com/docs/apollo-server/migration/#tracing for details
??? YN0061: ??? graphql-extensions@npm:0.15.0 is deprecated: The `graphql-extensions` API has been removed from Apollo Server 3. Use the plugin API instead: https://www.apollographql.com/docs/apollo-server/integrations/plugins/
??? YN0061: ??? apollo-cache-control@npm:0.14.0 is deprecated: The functionality provided by the `apollo-cache-control` package is built in to `apollo-server-core` starting with Apollo Server 3. See https://www.apollographql.com/docs/apollo-server/migration/#cachecontrol for details.
??? YN0061: ??? graphql-tools@npm:4.0.8 is deprecated: This package has been deprecated and now it only exports makeExecutableSchema.\nAnd it will no longer receive updates.\nWe recommend you to migrate to scoped packages such as @graphql-tools/schema, @graphql-tools/utils and etc.\nCheck out https://www.graphql-tools.com to learn what package you should use instead




[remote "origin"]
	url = https://github.com/neo4j/graphql.git
	fetch = +refs/heads/*:refs/remotes/origin/*

with

[remote "origin"]
	url = https://github.com/koakh/TypescriptNodeNeo4jGraphqlLibraryStarter.git
	fetch = +refs/heads/*:refs/remotes/origin/*


## Cyper

### Indexs

- [Examples - Neo4j Cypher Manual](https://neo4j.com/docs/cypher-manual/current/constraints/examples/)

```cypher
MATCH (n) DETACH DELETE n;

# https://neo4j.com/graphacademy/training-graphql-apis/03-graphql-apis-custom-logic/#_custom_query_field
# create the full-text index
CALL db.index.fulltext.createNodeIndex("postIndex", ["Post"],["title", "content"])
# SHOW INDEXES
# use with
# CALL db.index.fulltext.queryNodes("postIndex", "garph~")
# DROP INDEX postIndex

// blog
CREATE CONSTRAINT constraint_blog_id ON (blog:Blog) ASSERT blog.id IS UNIQUE;
CREATE CONSTRAINT constraint_blog_name ON (blog:Blog) ASSERT blog.name IS UNIQUE;

// user
CREATE CONSTRAINT constraint_user_id ON (user:User) ASSERT user.id IS UNIQUE;
CREATE CONSTRAINT constraint_user_email ON (user:User) ASSERT user.email IS UNIQUE;

SHOW CONSTRAINTS;
DROP CONSTRAINT constraint_name
```

```cypher
# get blog,posts,comments
MATCH (b)-[:HAS_POST]->(p:Post)-[:HAS_COMMENT]->(c) RETURN b,p,c

# get blog,posts,comments,users
MATCH (b {id:"a4ee6bc7-e24f-4ee1-ba9a-42d6dc064c5e"})-[:HAS_POST]->(p:Post)-[:HAS_COMMENT]->(c)<-[:COMMENTED]-(u) RETURN b,p,c,u

# get blog,tags,creators
MATCH (b)-[:HAS_TAG]->(t:Tag)<-[:CREATE]-(u) RETURN b,t,u

# get blog,post,tags
MATCH (p:Post)<-[:HAS_POST]-(b:Blog)-[:HAS_TAG]->(t:Tag) RETURN p,b,t
```

:params {blogId:"6a547d44-3e86-4a61-a32e-23dea4ebf532", adminUserId:"aede1701-d33c-48b6-ad99-5a2e2e881276"}

OPTIONAL MATCH ({id: blogId})<-[:HAS_BLOG]-(creator:User {id: adminUserId})
WITH creator IS NOT NULL AS isCreator
RETURN isCreator
