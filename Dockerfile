FROM nginx:alpine
COPY ./_site /usr/share/nginx/html
COPY ./developers.com.conf /etc/nginx/conf.d/default.conf
