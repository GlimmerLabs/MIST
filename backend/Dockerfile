FROM node:16-alpine3.11

ENV SECRET=secret

ENV PORT=8000

EXPOSE 8000

WORKDIR /app

COPY ./src /app/src

COPY ./package.json /app

RUN yarn install

CMD ["yarn", "server"]

