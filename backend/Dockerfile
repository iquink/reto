FROM node:22-alpine

WORKDIR /app

# Copy only dependency files first for better layer caching
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Good practice: run as non-root user
USER node

EXPOSE 3000
CMD ["node", "./src/app.js"]