FROM postgres:15-alpine
LABEL author="boris.blagojevicc@hotmail.com"

COPY ./data/db/scripts/init/ /docker-entrypoint-initdb.d/