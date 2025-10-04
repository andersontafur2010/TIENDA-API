# Dockerfile
FROM node:18

WORKDIR /usr/src/app

# Copiamos package.json e install
COPY package*.json ./
RUN npm install

# Copiamos el resto
COPY . .

# Exponer puerto
EXPOSE 3000

# Comando por defecto
CMD ["node", "server.js"]
