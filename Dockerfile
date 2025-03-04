FROM jrottenberg/ffmpeg:4.4-ubuntu

RUN apt-get update && apt-get install -y nodejs npm

WORKDIR /app

COPY package.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["node", "server.js"]
