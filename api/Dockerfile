FROM node:16.10.0-buster-slim

RUN apt update && apt install curl bzip2 build-essential g++ python git make gcc gcc-multilib node-gyp pkg-config xserver-xorg-dev libxext-dev pkg-config libxi-dev libglu1-mesa-dev libglew-dev -y
WORKDIR /usr/src/app

COPY package.json ./
COPY yarn.lock ./

RUN yarn

COPY . .

ENV NODE_ENV=${NODE_ENV:-local}
RUN ls src/modules
RUN yarn build

CMD ["npm", "run", "start:prod"]