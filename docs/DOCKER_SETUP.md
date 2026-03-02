# 🐳 FeedFlow - Desenvolvimento com Docker

Este guia explica como usar Docker para desenvolver o FeedFlow.

## ✨ Pré-requisitos

- [Docker](https://www.docker.com/products/docker-desktop) instalado
- [Docker Compose](https://docs.docker.com/compose/install/) instalado

## 🚀 Início Rápido

### 1. Configurar Variáveis de Ambiente

```bash
cp .env.example .env.local
```

Edite `.env.local` com suas credenciais do Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima
```

### 2. Iniciar com Docker

#### Opção A: Usando npm scripts

```bash
# Instalar dependências e iniciar
npm run docker:install

# Ou apenas iniciar (se já instalado)
npm run docker:dev

# Parar containers
npm run docker:stop

# Ver logs
npm run docker:logs

# Acessar shell do container
npm run docker:shell
```

#### Opção B: Usando Docker Compose diretamente

```bash
# Instalar e iniciar
docker-compose up --build

# Apenas iniciar
docker-compose up

# Parar
docker-compose down

# Ver logs
docker-compose logs -f

# Shell
docker-compose exec feedflow sh
```

#### Opção C: Usando script helper

```bash
chmod +x docker-dev.sh

# Instalar
./docker-dev.sh install

# Iniciar
./docker-dev.sh dev

# Parar
./docker-dev.sh stop

# Logs
./docker-dev.sh logs

# Shell
./docker-dev.sh shell
```

## 🌐 Acessar Aplicação

Após iniciar, acesse:

```
http://localhost:3000
```

## 📁 Estrutura Docker

### Dockerfile
- Usa Node.js 20 Alpine (leve e rápido)
- Instala dependências
- Faz build do Next.js
- Expõe porta 3000

### docker-compose.yml
- Monta volume local (hot reload)
- Define variáveis de ambiente
- Executa em modo desenvolvimento
- Mapeia porta 3000

## 🔄 Hot Reload

Qualquer mudança nos arquivos locais será automaticamente detectada e recarregada no container graças ao volume montado.

## 🐛 Troubleshooting

### "Address already in use"
Porta 3000 já está em uso. Opções:

```bash
# Usar porta diferente
docker-compose -p feedflow2 up

# Ou liberar a porta
lsof -ti:3000 | xargs kill -9
```

### "Cannot find module"
Node modules pode estar corrompido. Reconstrua:

```bash
docker-compose down
docker system prune
docker-compose up --build
```

### Variáveis de ambiente não carregam
Certifique-se de:
1. `.env` existe
2. `docker-compose up` foi executado (não `up -d`)
3. Reinicie o container

## 📦 Instalar novas dependências

Dentro do container (via shell):

```bash
docker-compose exec feedflow npm install nova-dependencia
```

Ou parar tudo, instalar localmente e reconstruir:

```bash
npm install nova-dependencia
docker-compose up --build
```

## 🛑 Limpar e Resetar

```bash
# Remove containers, networks
docker-compose down

# Remove também volumes
docker-compose down -v

# Limpar imagens não usadas
docker system prune -a

# Limpar tudo (cuidado!)
docker system prune -a --volumes
```

## 📊 Status dos Containers

```bash
# Ver containers rodando
docker-compose ps

# Ver logs em tempo real
docker-compose logs -f feedflow

# Ver logs de um serviço específico
docker-compose logs feedflow

# Ver apenas últimas N linhas
docker-compose logs --tail=50 feedflow
```

## 🔒 Segurança em Produção

O `docker-compose.yml` é para **desenvolvimento**. Para produção:

1. Use um `Dockerfile` multi-stage
2. Não monte volumes locais
3. Use variáveis de ambiente externas
4. Configure reverse proxy (nginx)
5. Use container orchestration (Kubernetes, etc)

## 📚 Recursos

- [Docker Docs](https://docs.docker.com/)
- [Docker Compose Docs](https://docs.docker.com/compose/)
- [Node.js Docker Best Practices](https://nodejs.org/en/docs/guides/nodejs-docker-webapp/)
