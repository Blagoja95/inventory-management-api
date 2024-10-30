# How to use

## Start

[Docker](https://www.docker.com/products/docker-desktop/) is required.


```shell
cp .env.example .env
```

Then run

In dev mode
```shell
docker compose up -d --build
```

## Different environments

By default `production` environment is build.
TO RUN `development` environment go to .env and change property `ENV_MODE` to `development`

THEN RUN
```shell
docker compose up -d --build
```

## Postman

Try this API using Postman
https://elements.getpostman.com/redirect?entityId=32049441-22ecbf4d-27d8-47b8-a037-d59b0aa9db98&entityType=collection


## FOUND ISSUES ?
Raise and [issue](https://github.com/Blagoja95/inventory-management-api/issues/new) in this repository.

## Development 3th party documentation


### [ExpressJS](https://expressjs.com/en/4x/api.html)

Fast, unopinionated, minimalist web framework for Node.js

Currently used major version is 4.x

### [TypeScript](https://www.typescriptlang.org/docs/)

TypeScript is a strongly typed programming language that builds on JavaScript, giving you better tooling at any scale.

### [ZOD](https://zod.dev/?id=table-of-contents)

Zod is a TypeScript-first schema declaration and validation library.

### [node-postgres](https://node-postgres.com/)

node-postgres is a collection of node.js modules for interfacing with your PostgreSQL database.