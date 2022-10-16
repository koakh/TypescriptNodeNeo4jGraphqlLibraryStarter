# README

this read me and project is **working project**, there is many thigs to do, to finish it, like finish `docker-compose.yml`, docker images, index's etc

## TLDR

### Clone Project

```shell
$ git clone https://github.com/koakh/TypescriptNodeNeo4jGraphqlLibraryStarter.git
```

## Launch database and seed data

> bellow steps are only required first time, `MATCH (a) DETACH DELETE a` query can be used more than one time to tearDown/drop database nodes/relationship's

### Using Neo4j Desktop

1. launch [neo4j desktop](https://neo4j.com/download-neo4j-now) or launch a **neo4j docker image** or a neo4j instance
2. create clean database
3. install APOC in database
4. open **neo4j browser**, open `init.cypher` and copy index's section in neo4j browser, for ex

### Using Docker Compose

default user/pass is `neo4j/neo4jsecret`

download [apoc](https://neo4j.com/labs/apoc/4.4/installation/)

```shell
$ mkdir volumes/neo4j/plugins/ -p
$ sudo mv ~/Downloads/apoc-4.4.0.1-all.jar volumes/neo4j/plugins/
$ docker-compose up -d
```

### Launch initial indexs and constraints

```cypher
// index's
CALL db.index.fulltext.createNodeIndex("postIndex", ["Post"],["title", "content"]);
CREATE CONSTRAINT constraint_blog_id ON (blog:Blog) ASSERT blog.id IS UNIQUE;
CREATE CONSTRAINT constraint_blog_name ON (blog:Blog) ASSERT blog.name IS UNIQUE;
CREATE CONSTRAINT constraint_user_id ON (user:User) ASSERT user.id IS UNIQUE;
CREATE CONSTRAINT constraint_user_email ON (user:User) ASSERT user.email IS UNIQUE;
// show indexs
// deprecated: CALL db.indexes();
SHOW INDEXES;
SHOW CONSTRAINT;
```

### Seed Database

> required APOC plugin

```shell
$ yarn neo4j-gqllib-starter:seed
```

### Check seed data

```cypher
MATCH (n) RETURN n
```

## Configure Server and Client Apps

### Config GraphQL Server Neo4j driver

edit `packages/neo4j-gqllib-starter/server/.env`

```shell
NEO4J_URI="bolt://localhost:7687"
NEO4J_USER="neo4j"
NEO4J_PASSWORD="neo4jsecret"
```

## Run Server and Client

```shell
$ neo4j-gqllib-starter
```

- open graphql expolorer at <https://localhost:5001/graphql>

http://localhost:5000
