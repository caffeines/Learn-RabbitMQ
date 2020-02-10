FROM node:alpine

COPY ./package.json .
RUN npm install
RUN npm i -g nodemon

COPY . .

CMD [ "nodemon", "send.js" ]