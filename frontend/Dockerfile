# Stage 1: Build react app
FROM node:alpine as build

WORKDIR /app

COPY kanban-frontend/package.json ./

RUN npm install

COPY kanban-frontend/. .

RUN npm run build

# Stage 2: Serve static files
FROM nginx:alpine

COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80

