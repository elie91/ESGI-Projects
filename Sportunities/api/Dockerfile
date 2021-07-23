# https://docs.docker.com/develop/develop-images/multistage-build/#stop-at-a-specific-build-stage
# https://docs.docker.com/compose/compose-file/#target


# https://docs.docker.com/engine/reference/builder/#understand-how-arg-and-from-interact
ARG NODE_VERSION=14.16
ARG NGINX_VERSION=1.17


FROM node:${NODE_VERSION}-alpine AS api_development
WORKDIR /usr/src/api
RUN yarn global add nodemon
# prevent the reinstallation of node modules at every changes in the source code
COPY package.json yarn.lock ./
RUN set -eux; \
	yarn install
COPY . ./
VOLUME /usr/src/api/node_modules
CMD ["yarn", "run", "dev"]


# "build" stage
# depends on the "development" stage above

FROM api_development AS api_build
#ARG REACT_APP_API_ENTRYPOINT
EXPOSE 3001
RUN set -eux; \
	yarn start
