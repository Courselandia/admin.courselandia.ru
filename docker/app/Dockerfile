FROM node:18.15.0 as build-stage
WORKDIR /var/www
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build --prod && rm -rf node_modules

FROM nginx:stable-alpine as production-stage

COPY docker/app/nginx.conf /etc/nginx/nginx.conf
COPY docker/app/default.conf /etc/nginx/conf.d/default.conf

COPY docker/ssl/ca.crt /var/www/docker/ssl/ca.crt
COPY docker/ssl/certificate.pem /var/www/docker/ssl/certificate.pem
COPY docker/ssl/privkey.pem /var/www/docker/ssl/privkey.pem

COPY --from=build-stage /var/www/dist /var/www
RUN chown nginx:nginx /var/www
EXPOSE 19000
CMD ["nginx", "-g", "daemon off;"]
