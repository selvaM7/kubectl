# Create node version
FROM node:10.15.0

# Create app directory to hold the source code inside the image
WORKDIR /usr/src/app

ARG NPM_TOKEN
COPY .npmrc .npmrc

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# If you are building your code for production
# RUN npm install --only=production
RUN npm install

RUN rm -f .npmrc

# Bundle code source
COPY . .

# Exposes Server Port
EXPOSE 8642

# TO run the server
CMD [ "npm", "start" ]