FROM node:alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ARG REACT_APP_API_ENTRYPOINT

EXPOSE 3002

CMD ["npm", "start"]
