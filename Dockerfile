FROM bitnami/express:4.18.2

WORKDIR /app
COPY package*.json ./

RUN npm install

COPY . .
EXPOSE 8073

CMD ["npm","start"]