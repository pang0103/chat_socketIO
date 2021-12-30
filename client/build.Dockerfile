FROM node:15.13-alpine as builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ARG REACT_APP_API_ENDPOINT
ENV REACT_APP_API_ENDPOINT=$REACT_APP_API_ENDPOINT

RUN npm run build

# web server

FROM nginx:1.21.5-alpine

COPY --from=builder /app/build /usr/share/nginx/html

EXPOSE 80

CMD nginx -g 'daemon off;'