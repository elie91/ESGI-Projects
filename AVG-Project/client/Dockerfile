ARG NODE_VERSION=13
ARG NGINX_VERSION=1.17

# "development" stage
FROM node:${NODE_VERSION}-alpine AS api_platform_client_development

WORKDIR /usr/src/client

RUN yarn global add @api-platform/client-generator @vue/cli @vue/cli-service-global

COPY package*.json yarn.lock ./
RUN set -eux; \
	yarn

COPY . ./

VOLUME /usr/src/client/node_modules

CMD ["yarn", "serve"]

FROM api_platform_client_development AS api_platform_client_build

RUN set -eux; \
	yarn build

FROM nginx:${NGINX_VERSION}-alpine AS api_platform_client_nginx

COPY docker/nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf

WORKDIR /usr/src/client/dist

COPY --from=api_platform_client_build /usr/src/client/dist ./
