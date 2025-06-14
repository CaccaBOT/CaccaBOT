FROM node:20-alpine AS builder

RUN apk add --no-cache bash curl git

WORKDIR /app

COPY . .

RUN npm install

RUN cd client && npm install

RUN cd client && npm run build-bypass-errors
RUN npm run build

FROM node:20-alpine

RUN apk add --no-cache bash chromium

WORKDIR /app

COPY --from=builder /app/build ./
COPY --from=builder /app/public/collectibles ./public/collectibles
COPY --from=builder /app/client/dist ./public/client
COPY --from=builder /app/database ./database
RUN echo ENVIRONMENT=production > .env
RUN mkdir -p ./storage
RUN mkdir -p ./config

# remove comment only when debugging
#COPY --from=builder /app/config/config_prod.json ./config/config_prod.json

RUN npm install --omit=dev

EXPOSE 3000

CMD ["node", "index.js"]
