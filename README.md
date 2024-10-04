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
