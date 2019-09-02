FROM tarampampam/node:10-alpine as build

ARG NPM_USERNAME
ARG NPM_PASSWORD

WORKDIR /data/app/

COPY src/*.json ./
COPY src/*.sh ./

RUN ./npm-install.sh -g @zeit/ncc
RUN ./npm-install.sh --production

COPY src/*.js ./
COPY src/adapter ./adapter
COPY src/application ./application
COPY src/domain ./domain

RUN npm run build

FROM node:10-alpine

ENV NODE_ENV=production

COPY --from=build /data/dist /data/app/

EXPOSE 3000
CMD ["node", "/data/app/index.js"]
