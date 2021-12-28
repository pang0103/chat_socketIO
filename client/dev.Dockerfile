FROM node:15.13-alpine

WORKDIR /app

ENV PATH="./node_modules/.bin:$PATH"

COPY package*.json ./

RUN npm install

EXPOSE 3000

CMD ["npm","start"]

# to run web alone
#docker build . -t chat-web-dev -f dev.Dockerfile
#docker run -p 3000:3000 -v $(pwd):/app chat-web-dev