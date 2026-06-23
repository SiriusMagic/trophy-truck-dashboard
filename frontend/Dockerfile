# ---- Frontend React (build) + Nginx (producción) ----
FROM node:20-alpine AS build

WORKDIR /app

# Instala dependencias (usa yarn.lock para builds reproducibles)
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .

# REACT_APP_BACKEND_URL se "hornea" en tiempo de build (CRA)
ARG REACT_APP_BACKEND_URL=""
ENV REACT_APP_BACKEND_URL=$REACT_APP_BACKEND_URL
RUN yarn build

# ---- Servir estáticos con Nginx ----
FROM nginx:1.27-alpine

COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
