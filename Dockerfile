FROM node:24.22.2
WORKDIR calculator 
COPY package.json ./
COPY public ./public
COPY server.js ./
EXPOSE 5000
CMD ["node", "server.js"]