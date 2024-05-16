FROM node:18.8-alpine as base

#####################
### BUILDER IMAGE ###
#####################

FROM base as builder

RUN echo "NODE_ENV: $NODE_ENV"

WORKDIR /home/node/app
COPY package*.json yarn.lock ./
RUN --mount=type=cache,target=/usr/local/share/.cache/yarn/v6 \
     yarn install --frozen-lockfile

COPY . .

RUN yarn build
# This command will prune the dev dependencies after the building the image
RUN yarn install --production --ignore-scripts --prefer-offline --frozen-lockfile

#####################
### RUNTIME IMAGE ###
#####################

FROM base as runtime

LABEL place.milan.description="Payload Admin volume"
LABEL place.milan.department="IT/Ops"
LABEL place.milan.owner="place.milan.nianiba"
ENV PAYLOAD_CONFIG_PATH=dist/payload.config.js
RUN echo "running: ${NODE_ENV}"

RUN apk add --no-cache tini

WORKDIR /home/node/app
COPY package*.json yarn.lock  ./

#RUN yarn add express

COPY --from=builder /home/node/app/node_modules ./node_modules
COPY --from=builder /home/node/app/dist ./dist
COPY --from=builder /home/node/app/build ./build

EXPOSE 3000

ENTRYPOINT [ "/sbin/tini", "--" ]
CMD ["node", "dist/server.js"]


#####################
## MIGRATION IMAGE ##
#####################

FROM base as migration

RUN echo "running: ${NODE_ENV}"
COPY package*.json yarn.lock  ./
COPY --from=builder /home/node/app/node_modules ./node_modules

# Conditionally add @payloadcms/payload, run migrations, and remove @payloadcms/payload
RUN if [ "${NODE_ENV}" = "production" ]; then \
    yarn add @payloadcms/payload && \
    yarn payload:distMigrate && \
    yarn remove @payloadcms/payload; \
    else echo 'Skipping payload migration'; \
    fi
