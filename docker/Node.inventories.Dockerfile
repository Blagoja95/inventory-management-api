FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./

ARG PRODUCTION

RUN if [ PRODUCTION === 1 ]; then \
      npm ci; \
    else \
        npm install; \
    fi

COPY ./src ./
COPY ./data ./data

CMD if [ PRODUCTIOn === 1 ]; then \
        npm run dev; \
    else \
        npm run build; \
        fi