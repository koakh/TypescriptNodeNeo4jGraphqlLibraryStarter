FROM node:14-alpine

# update packages
RUN apk update

# create root application folder
WORKDIR /app

# copy configs to /app folder
COPY package*.json ./
# copy source code to /app/src folder
COPY src /app/src

# install dependencies
RUN npm i npm@latest --global
RUN npm ci
# build
RUN npm run build
RUN rm src -r

USER node

EXPOSE 8080

CMD [ "node", "./dist/index.js" ]




# # Dockerizing a Node.js web app
# # https://nodejs.org/de/docs/guides/nodejs-docker-webapp/
# FROM node:14

# # Create app directory
# WORKDIR /usr/src/app

# # Install app dependencies
# # A wildcard is used to ensure both package.json AND package-lock.json are copied where available (npm@5+)
# COPY package*.json ./

# # prevent error, using 7x version same as host dev machine
# # npm WARN read-shrinkwrap This version of npm is compatible with lockfileVersion@1, but package-lock.json was generated for lockfileVersion@2. I'll try to do my best with it!
# RUN npm i npm@latest --global

# # If you are building your code for development
# # RUN npm install

# # If you are building your code for production
# RUN npm ci --only=production

# RUN npm run build \
#   rm src -R

# # Bundle app source
# COPY . .

# EXPOSE 8080

# CMD [ "node", "index.js" ]
