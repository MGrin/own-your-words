FROM node:16.10.0-buster-slim

RUN apt update && apt install make gcc g++ python pkg-config -y
WORKDIR /usr/src/app

COPY package.json ./
COPY yarn.lock ./

RUN yarn

COPY . .

ENV NODE_ENV=${NODE_ENV:-local}
RUN ls src/modules
RUN yarn build

EXPOSE 80
ENV PORT=80

CMD ["npm", "run", "start:prod"]