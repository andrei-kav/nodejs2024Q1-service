FROM node:20-alpine as start
WORKDIR /opt/app
COPY ../../*.json .
COPY ../../prisma ./prisma

FROM start as build
RUN npm install
COPY ../.. .
RUN npm run build

FROM node:20-alpine as prod
COPY --from=build /opt/app/dist ./dist
COPY --from=build /opt/app/doc ./doc
COPY --from=build /opt/app/prisma ./prisma
COPY --from=build /opt/app/node_modules ./node_modules
COPY ../../*.json .
CMD ["npm", "run", "start:migrate:prod"]

FROM start as dev
RUN npm install
COPY ../../doc ./doc
CMD ["npm", "run", "start:migrate:dev"]