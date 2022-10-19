FROM node:16-slim
RUN mkdir /app
WORKDIR /app
COPY . .

ENV NODE_ENV production
ENV PNPM_VERSION 7.13.5
ENV TZ Asia/Shanghai

RUN corepack enable && pnpm i -P
ENTRYPOINT node ./app.js
