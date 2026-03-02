# 🆘 Troubleshooting - FeedFlow

Soluções para problemas comuns durante desenvolvimento.

## 🔴 Erros de Compilação TypeScript

### Erro: "Cannot find module '@supabase/supabase-js'"

**Causa**: Biblioteca não instalada

**Solução**:
```bash
npm install @supabase/supabase-js
```

Se usar Docker:
```bash
docker-compose exec feedflow npm install @supabase/supabase-js
docker-compose restart
```

---

## 🔴 Autenticação Não Funciona

### "Missing NEXT_PUBLIC_SUPABASE_URL"

**Causa**: Variáveis de ambiente não definidas

**Solução**:
1. Crie `.env` na raiz do projeto
2. Adicione:
```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima
```
3. Reinicie o servidor:
```bash
npm run dev
# ou
docker-compose restart
```

### "Redirect URI mismatch"

**Causa**: URI de callback não configurado no Supabase

**Solução**:
1. Vá para [Supabase Console](https://app.supabase.com)
2. Projeto → Authentication → URL Configuration
3. Adicione em "Redirect URIs":
```
http://localhost:3000/auth/callback
https://seu-dominio.com/auth/callback
```

### Login redireciona infinitamente

**Causa**: Supabase mal configurado ou token inválido

**Solução**:
```bash
# Limpe cookies
docker-compose exec feedflow sh
# Dentro do container:
rm -rf .next
exit

# Reinicie
docker-compose restart
```

Ou no navegador:
- DevTools → Application → Cookies
- Remova cookies de `sb-access-token` e `sb-refresh-token`
- Recarregue

---

## 🔴 Erros de Docker

### "Address already in use :3000"

**Causa**: Porta 3000 já está em uso

**Solução**:
```bash
# Ver qual processo usa a porta
lsof -i :3000

# Matar o processo
kill -9 <PID>

# Ou usar porta diferente
docker-compose -f docker-compose.yml -p feedflow2 up
# Acesse em http://localhost:3000 (Docker mapeia automaticamente)
```

### "Cannot connect to Docker daemon"

**Causa**: Docker não está rodando

**Solução**:
```bash
# No macOS
open /Applications/Docker.app

# No Linux
sudo systemctl start docker

# No Windows
Docker Desktop → abrir aplicação
```

### "Build fails: npm install timeout"

**Causa**: Conexão lenta ou npm registry com problema

**Solução**:
```bash
# Aumentar timeout
docker-compose up --build --timeout 300

# Ou limpar cache
docker system prune -a
docker-compose up --build
```

---

## 🔴 Problemas de Performance

### Aplicação está lenta

**Soluções**:
1. Limpe .next cache:
```bash
rm -rf .next
npm run dev
```

2. Reconstrua Docker:
```bash
docker-compose down
docker system prune -a
docker-compose up --build
```

3. Verifique memória disponível:
```bash
docker stats
```

---

## 🔴 Erros de Componentes

### "useRouter() can only be used in client components"

**Causa**: Usar hooks de router em server components

**Solução**: Adicione `"use client"` no topo do arquivo

```typescript
"use client"

import { useRouter } from "next/navigation"
// ... resto do código
```

### "Cannot use 'await' outside async function"

**Causa**: Usar await em função não async

**Solução**: Faça a função async

```typescript
// ❌ Errado
function fetchUser() {
  const data = await supabase.auth.getUser()
}

// ✅ Certo
async function fetchUser() {
  const data = await supabase.auth.getUser()
}
```

---

## 🔴 Problemas de Middleware

### Middleware não está funcionando

**Causa**: Arquivo incorreto ou configuração errada

**Solução**:
1. Verifique se `middleware.ts` está na **raiz do projeto** (não em `app/`)
2. Verifique `export const config` tem os paths corretos:

```typescript
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/login",
    "/",
  ],
}
```

3. Reinicie servidor:
```bash
npm run dev
```

---

## 🔴 Problemas com Sidebar

### Sidebar não aparece

**Causa**: Condicional de autenticação falhou

**Solução**:
```bash
# Veja logs
docker-compose logs -f feedflow

# Ou localmente
npm run dev
# Verifique console do navegador
```

### Mobile menu não funciona

**Causa**: Z-index ou event propagation

**Solução**: Teste em incógnito e limpe cache:
```bash
# macOS/Linux
rm -rf node_modules/.vite
npm run dev
```

---

## 🟡 Avisos (não são erros)

### "The 'middleware' file convention is deprecated"

**Aviso**: Informativo, ainda funciona

**Quando ficar crítico**: Migrar para route handlers

---

## 📊 Debugging

### Ver logs do servidor

```bash
npm run dev
# Veja output no terminal

# Com Docker
docker-compose logs -f feedflow
```

### Ver logs do navegador

```
F12 → Console → Veja mensagens de erro
```

### Inspecionar variáveis de ambiente

```bash
# Local
console.log(process.env.NEXT_PUBLIC_SUPABASE_URL)

# Docker
docker-compose exec feedflow sh
# echo $NEXT_PUBLIC_SUPABASE_URL
```

### Inspecionar cookies

```javascript
// Console do navegador
document.cookie
```

---

## 🔧 Commands Úteis

```bash
# Limpar tudo e recomeçar
npm run docker:stop
docker system prune -a --volumes
npm run docker:install

# Reconstruir completo
docker-compose down -v
docker-compose up --build

# Ver dados salvos
docker-compose exec feedflow npm run dev

# Parar sem remover volumes
docker-compose down

# Backup de dados
docker-compose exec feedflow sh -c "cp -r .next backup/"
```

---

## 📞 Quando Pedir Ajuda

Inclua:
1. Versão do Node.js: `node -v`
2. Versão do npm: `npm -v`
3. Versão do Docker: `docker --version`
4. Mensagem de erro completa (screenshot ou copy-paste)
5. Passos para reproduzir
6. Seu SO (macOS, Linux, Windows)

---

## 📚 Recursos

- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Docker Docs](https://docs.docker.com)
- [TypeScript Docs](https://www.typescriptlang.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

---

**Última atualização**: 16 de fevereiro de 2026
