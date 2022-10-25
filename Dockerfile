FROM node:19.0.0 as build-stage
WORKDIR /var/www
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine as production-stage

COPY docker/nginx/nginx.conf /etc/nginx/nginx.conf
COPY docker/nginx/default.conf /etc/nginx/conf.d/default.conf

COPY docker/ssl/ca.crt /var/www/docker/ssl/ca.crt
COPY docker/ssl/certificate.pem /var/www/docker/ssl/certificate.pem
COPY docker/ssl/privkey.pem /var/www/docker/ssl/privkey.pem

COPY --from=build-stage /var/www/dist /var/www/html
RUN chown nginx:nginx /var/www/html
EXPOSE 16000
CMD ["nginx", "-g", "daemon off;"]
