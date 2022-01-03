FROM node:15.13-alpine

WORKDIR /app

COPY ./package.json ./

RUN npm install

COPY . .

EXPOSE 3001

CMD ["node","index"]

# to run server alone
# docker build . -t chat-backend-dev -f dev.Dockerfile
# docker run -p 3001:3001 -v $(pwd):/app chat-backend-dev