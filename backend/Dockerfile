FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
COPY .env_docker .env
EXPOSE 3000
CMD ["node", "./src/app.js"]