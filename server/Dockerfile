FROM docker.m.daocloud.io/node:22-alpine

WORKDIR /app

RUN npm config set registry https://registry.npmmirror.com

ARG MONGODB_URI
ARG JWT_SECRET
ARG ADMIN_USERNAME
ARG ADMIN_PASSWORD
ARG PORT

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

ENV NODE_ENV=production \
    PORT=${PORT:-3000} \
    MONGODB_URI=${MONGODB_URI:-"mongodb://mongodb:27017/lit-flix"} \
    JWT_SECRET=${JWT_SECRET:-"1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ"} \
    ADMIN_USERNAME=${ADMIN_USERNAME:-"admin"} \
    ADMIN_PASSWORD=${ADMIN_PASSWORD:-"admin"}

EXPOSE ${PORT:-3000}

CMD ["npm", "start"] 