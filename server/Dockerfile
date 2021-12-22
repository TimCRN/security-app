FROM node:14-slim
WORKDIR /usr/src/app
COPY package.json package*.json ./
RUN npm ci
COPY . .
RUN npm run compile
CMD ["node", "./build/index.js"]
