FROM node:20-alpine as start
WORKDIR /opt/app
COPY ../../*.json .
COPY ../../prisma ./prisma
RUN npm install
COPY ../.. .

FROM start as build
RUN npm run build

FROM node:20-alpine as prod
WORKDIR /opt/app
COPY --from=build /opt/app/dist ./dist
COPY --from=build /opt/app/doc ./doc
COPY --from=build /opt/app/prisma ./prisma
COPY --from=build /opt/app/node_modules ./node_modules
COPY ../../*.json .
CMD ["npm", "run", "start:migrate:prod"]

FROM node:20-alpine as dev
WORKDIR /opt/app
COPY --from=start /opt/app/doc ./doc
COPY --from=start /opt/app/prisma ./prisma
COPY --from=start /opt/app/node_modules ./node_modules
COPY --from=start /opt/app/src ./src
COPY ../../*.json .
CMD ["npm", "run", "start:migrate:dev"]