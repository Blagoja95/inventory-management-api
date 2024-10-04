FROM node:18-alpine AS development

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY ./src ./src
COPY ./data ./data

CMD npm run dev-docker

FROM node:18-alpine AS production

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production

COPY ./src ./src
COPY ./data ./data

CMD npm run build