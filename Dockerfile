FROM node:20-alpine

WORKDIR /app

COPY app/package*.json ./

RUN npm ci --omit=dev

COPY app/ .

RUN mkdir -p uploads

EXPOSE 4040

CMD ["npm", "start"]
