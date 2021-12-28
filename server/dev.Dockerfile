FROM node:15.13-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

EXPOSE 3001

CMD ["npm","run","dev"]

# to run server alone
# docker build . -t chat-backend-dev -f dev.Dockerfile
# docker run -p 3001:3001 -v $(pwd):/app chat-backend-dev