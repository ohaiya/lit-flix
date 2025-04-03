# FROM docker.m.daocloud.io/node:22-alpine as builder
FROM node:22-alpine as builder

WORKDIR /app

RUN npm config set registry https://registry.npmmirror.com

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

# FROM docker.m.daocloud.io/nginx:1.27
FROM nginx:1.27

ARG NGINX_PORT=5123
ARG SERVER_IP=server
ARG SERVER_PORT=3001

ENV NGINX_PORT=${NGINX_PORT}
ENV SERVER_IP=${SERVER_IP}
ENV SERVER_PORT=${SERVER_PORT}

RUN apt-get update && apt-get install -y gettext-base

COPY --from=builder /app/dist /usr/share/nginx/html

COPY default.template /etc/nginx/conf.d/

WORKDIR /etc/nginx/conf.d

RUN sed -i 's/user\s*nginx;/user nginx www-data;/' /etc/nginx/nginx.conf

RUN echo "NGINX_PORT=$NGINX_PORT, SERVER_IP=$SERVER_IP, SERVER_PORT=$SERVER_PORT"

ENTRYPOINT echo "NGINX_PORT=$NGINX_PORT, SERVER_IP=$SERVER_IP, SERVER_PORT=$SERVER_PORT" && \
           envsubst '$NGINX_PORT $SERVER_IP $SERVER_PORT' < default.template > default.conf && \
           cat default.conf && \
           nginx -g 'daemon off;'

EXPOSE $SERVER_PORT