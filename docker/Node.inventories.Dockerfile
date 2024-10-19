FROM node:18-alpine AS development
LABEL author="boris.blagojevicc@hotmail.com"

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY ./src ./src

CMD npm run dev

FROM node:18-alpine AS production

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production

COPY ./src ./src
COPY tsconfig.json ./

RUN npm install -g typescript

RUN tsc

CMD npm run build