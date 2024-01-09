FROM node:18.16.1-alpine

WORKDIR /usr/src/app

COPY package*.json ./

COPY /prisma ./

RUN npm install

RUN npx prisma generate

COPY . .

RUN npm run build

