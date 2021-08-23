#!/bin/bash

DT=$(date +%Y-%m-%d-%H-%M)
DIR=.bak
FILE="$DIR/$DT.tgz"
FILE_EXCLUDE=exclude.tag
mkdir $DIR -p
touch .yarn/$FILE_EXCLUDE
touch node_modules/$FILE_EXCLUDE
touch packages/neo4j-gqllib-starter/client/node_modules/$FILE_EXCLUDE
touch packages/neo4j-gqllib-starter/server/node_modules/$FILE_EXCLUDE
# touch packages/migration/node_modules/$FILE_EXCLUDE

touch .bak/$FILE_EXCLUDE

tar -zcvf $FILE \
	--exclude-tag-all=$FILE_EXCLUDE \
	.
