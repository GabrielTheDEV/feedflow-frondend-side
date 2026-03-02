FROM node:20-alpine

WORKDIR /app

# Copiar package.json e package-lock.json
COPY package*.json ./

# Instalar dependências incluindo @supabase/supabase-js
RUN npm install

# Copiar o resto do projeto
COPY . .
RUN npm ci

# Build do Next.js
RUN npm run build

# Expor porta
EXPOSE 3000

# Comando para iniciar
CMD ["npm", "run", "start"]
