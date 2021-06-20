# https://docs.docker.com/develop/develop-images/multistage-build/#stop-at-a-specific-build-stage
# https://docs.docker.com/compose/compose-file/#target


# https://docs.docker.com/engine/reference/builder/#understand-how-arg-and-from-interact
ARG NODE_VERSION=14.17
ARG NGINX_VERSION=1.17


# "development" stage
FROM node:${NODE_VERSION}-alpine AS client_development
WORKDIR /usr/src/client
COPY package.json yarn.lock ./
RUN set -eux; \
	yarn install
COPY . ./
VOLUME /usr/src/client/node_modules
CMD ["yarn", "start"]


FROM client_development AS client_build
ARG REACT_APP_API_URL=/api
RUN set -eux; \
	yarn build


FROM nginx:${NGINX_VERSION}-alpine AS client_nginx
#EXPOSE 3000
COPY docker/nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf
WORKDIR /usr/src/client/build
COPY --from=client_build /usr/src/client/build ./
