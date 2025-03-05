
FROM node:18-alpine AS builder

WORKDIR /app


RUN apk add --no-cache openssl curl


COPY package*.json ./
RUN npm install


COPY . .


RUN npx prisma generate
RUN npm run build


FROM node:18-alpine

WORKDIR /app


RUN apk add --no-cache openssl curl


COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma


RUN mkdir -p /app/data && \
    touch /app/data/dev.db && \
    chmod 666 /app/data/dev.db


ENV NODE_ENV=production
ENV DATABASE_URL=file:/app/data/dev.db


EXPOSE 3000


CMD npx prisma migrate deploy && node dist/index.js
