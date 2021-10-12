# README

this read me and project is **working project**, there is many thigs to do, to finishe it, like inish docker-compose, docker images, index's etc

## TLDR

### Clone Project

```shell
$ git clone https://github.com/koakh/TypescriptNodeNeo4jGraphqlLibraryStarter.git
```

## Launch database and seed data

> bellow steps are only required first time, `MATCH (a) DETACH DELETE a` query can be used more than one time to tearDown/drop database nodes/relationship's

1. launch [neo4j desktop](https://neo4j.com/download-neo4j-now) or launch a **neo4j docker image**
2. create clean database
3. install APOC in database
4. open **neo4j browser**, open `init.cypher` and copy index's section in neo4j browser, for ex

```cypher
// index's
CALL db.index.fulltext.createNodeIndex("postIndex", ["Post"],["title", "content"])
CREATE CONSTRAINT constraint_blog_id ON (blog:Blog) ASSERT blog.id IS UNIQUE;
CREATE CONSTRAINT constraint_blog_name ON (blog:Blog) ASSERT blog.name IS UNIQUE;
CREATE CONSTRAINT constraint_user_id ON (user:User) ASSERT user.id IS UNIQUE;
CREATE CONSTRAINT constraint_user_email ON (user:User) ASSERT user.email IS UNIQUE;
```

## Config Neo4j driver

edit `.env`

```shell
NEO4J_URI="bolt://localhost:7687"
NEO4J_USER="neo4j"
NEO4J_PASSWORD="password"
```
