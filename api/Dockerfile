FROM node:16.10.0-buster-slim

RUN apt install --no-cache make gcc g++ python
WORKDIR /usr/src/app

COPY package.json ./
COPY yarn.lock ./

RUN yarn

COPY . .

ENV NODE_ENV=${NODE_ENV:-local}
RUN ls src/modules
RUN yarn build

CMD ["npm", "run", "start:prod"]