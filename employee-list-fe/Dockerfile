FROM node:22.23.1-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ENV HOST=0.0.0.0

EXPOSE 3000

ENTRYPOINT [ "npm" ]

CMD [ "run", "dev" ]