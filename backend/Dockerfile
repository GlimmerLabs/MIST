FROM node:16-alpine3.11

ENV SECRET=secret

ENV PORT=8000

EXPOSE 8000

WORKDIR /usr/src/app

COPY . /usr/src/app

RUN yarn install

CMD ["yarn", "server"]

