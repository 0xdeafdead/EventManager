FROM node:lts-alpine AS base

ARG APP_ENV=production
ENV APP_ENV=${APP_ENV}

ARG PORT=3000
ENV PORT=${PORT}

ARG BASE_API_AUDIENCE=event_manager_engine
ENV BASE_API_AUDIENCE=${BASE_API_AUDIENCE}

ARG BASE_API_ISSUER=event_manager_engine
ENV BASE_API_ISSUER=${BASE_API_ISSUER}

ARG JWT_SECRET=pleaseHireMe
ENV JWT_SECRET=${JWT_SECRET}

ARG MONGO_ATLAS_URI
ENV MONGO_ATLAS_URI=${MONGO_ATLAS_URI}

RUN npm install -g pnpm

FROM base AS dependencies

WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install

FROM dependencies AS build

WORKDIR /app
COPY . .
COPY --from=dependencies /app/node_modules ./node_modules
RUN pnpm build
RUN pnpm prune --prod

FROM base AS deployment

WORKDIR /app
COPY --from=build /app/dist ./dist/
COPY --from=build /app/node_modules ./node_modules

CMD [ "node", "dist/main.js" ]