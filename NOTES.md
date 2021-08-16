# NOTES

## Clone project

```shell
$ git clone https://github.com/neo4j/graphql.git
```

## Convert NeoPush to a starter project

first remove packages `graphql`, `ogm` and `package-tests`

and move `examples/migration` and `examples/neo-push` projects to `packages` 

```shell
$ rm README.md packages/graphql/ packages/ogm/ packages/package-tests/ -R
$ mv examples/README.md .
$ mv examples/migration/ packages/
$ mv examples/neo-push/ packages/
$ rm examples docs -R
```

![image](./attachments/2021-08-15-22-23-52.png)

`packages/neo-push/server/.env.example`

```shell
# NEO_USER=admin
NEO_USER=neo4j
NEO_PASSWORD=password
```

> don't forget to change username to `neo4j`

create neo4j database withn `password` password and add APOC

### package.json

edit `package.json` and change `workspaces` to

```json
  "workspaces": [
    "packages/neo-push/server",
    "packages/neo-push/client"
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
    { "path": "./packages/neo-push/client/src/tsconfig.json" },
    { "path": "./packages/neo-push/server/src/tsconfig.json" }
  ]
}
```

### Eslit

edit `.eslintrc.js` and change `examples/neo-push` to `packages/neo-push`

## Bootstrap NeoPush TLDR

read [README.md](packages/neo-push/README.md)

```shell
$ cp packages/neo-push/server/.env.example packages/neo-push/server/.env
$ cp packages/neo-push/client/.env.example packages/neo-push/client/.env
$ code packages/neo-push/server/.env
$ code packages/neo-push/client/.env
```

1. update all packages to latest releases, but leave `jest` without changes
2. replace `"apollo-server-express": "2.19.0"` with `"apollo-server": "3.1.2"`

```shell
# yarn workspaces install dependencies
$ yarn install
```

## Seed

fix adding `node:`

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
$ yarn run neo-push:seed
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
$ yarn run neo-push
```

- [Frontend](http://localhost:4000)
- [GraphQL Playground](http://localhost:5000/graphql)

## Fix Eslint

```shell
(node:690) [DEP0128] DeprecationWarning: Invalid 'main' field in '/home/mario/Development/Neo4j/_/graphql/node_modules/eslint-config-airbnb-typescript/package.json' of 'dist/eslint-config-airbnb-typescript.js'. Please either fix that or report it to the module author
```

> above error occurs after try to commit, husky triggers eslint

## Change NeoPush project to Other name

