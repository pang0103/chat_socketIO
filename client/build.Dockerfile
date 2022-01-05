FROM node:15.13-alpine as builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ARG REACT_APP_API_ENDPOINT
ARG REACT_APP_SERVER_ENDPOINT

ENV REACT_APP_API_ENDPOINT=$REACT_APP_API_ENDPOINT
ENV REACT_APP_SERVER_ENDPOINT=$REACT_APP_SERVER_ENDPOINT

RUN npm run build

# web server

FROM nginx

COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/build /usr/share/nginx/html

EXPOSE 80

CMD nginx -g 'daemon off;'

#docker build  . -t chat-web:0.0.3 -f build.Dockerfile --build-arg REACT_APP_API_ENDPOIN=http://ec2-13-112-168-86.ap-northeast-1.compute.amazonaws.com/api