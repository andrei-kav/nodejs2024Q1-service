FROM node:20-alpine as build
WORKDIR /opt/app
COPY ../../*.json .
RUN npm ci
COPY ../.. .
RUN npm run build

FROM node:20-alpine
WORKDIR /opt/app
COPY --from=build /opt/app/dist ./dist
COPY --from=build /opt/app/doc ./doc
COPY ../../*.json .
RUN npm ci --omit=dev
CMD ["node", "./dist/main.js"]