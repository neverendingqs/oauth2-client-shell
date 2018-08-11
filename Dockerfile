FROM node:8.11.3-alpine

ENV NODE_ENV production
WORKDIR /usr/src/app
EXPOSE 3000

COPY package.json .
COPY package-lock.json .
RUN npm install

COPY . .

CMD [ "npm", "start" ]
