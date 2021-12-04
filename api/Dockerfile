FROM node:16.10.0

WORKDIR /usr/src/app

COPY package.json ./
COPY yarn.lock ./

RUN yarn

COPY . .

ENV NODE_ENV=${NODE_ENV:-local}
RUN ls src/modules
RUN npm run build

CMD ["npm", "start:prod"]