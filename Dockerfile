FROM node:24-slim
WORKDIR /calculator
COPY package.json ./
COPY public ./public
COPY server.js ./
EXPOSE 3200
CMD ["node", "server.js"]
