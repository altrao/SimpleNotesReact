FROM node:23-alpine

WORKDIR /app

COPY package.json package-lock.json ./

COPY . .

RUN npm ci
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]

