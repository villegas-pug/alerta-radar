FROM nginx:alpine
COPY ./.next/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]