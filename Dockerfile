FROM node:12
WORKDIR /usr/src/app
COPY package*.json ./

RUN npm install
COPY . .
EXPOSE 1488
CMD [ "node", "index" ]