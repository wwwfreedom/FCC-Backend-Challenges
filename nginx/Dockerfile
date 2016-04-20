FROM nginx:latest

MAINTAINER Kevin

VOLUME /var/cache/nginx

# Copy custom nginx config
COPY ./nginx.conf /etc/nginx/nginx.conf
#COPY ./dist /var/www/html

EXPOSE 80 443

ENTRYPOINT ["nginx"]
CMD ["-g", "daemon off;"]