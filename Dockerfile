FROM node:18.8-alpine as base

FROM base as builder

WORKDIR /home/node/app
COPY package*.json ./

COPY . .
RUN yarn install --production=false
RUN yarn build

FROM base as runtime

#ENV NODE_ENV=production
ENV PAYLOAD_CONFIG_PATH=dist/payload.config.js

WORKDIR /home/node/app
COPY package*.json  ./
COPY yarn.lock ./

RUN yarn add express

RUN yarn install --production=true
COPY --from=builder /home/node/app/dist ./dist
COPY --from=builder /home/node/app/build ./build

EXPOSE 3000

# Conditionally add @payloadcms/payload, run migrations, and remove @payloadcms/payload
RUN if [ "$NODE_ENV" = "production" ]; then \
    yarn add @payloadcms/payload && \
    yarn payload:distMigrate && \
    yarn remove @payloadcms/payload; \
    else echo 'Skipping payload migration'; \
    fi

CMD ["node", "dist/server.js"]
