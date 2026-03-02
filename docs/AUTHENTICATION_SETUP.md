# FeedFlow - Authentication & Dashboard Setup

Este documento descreve a configuração de autenticação com Supabase + Google OAuth e as rotas do dashboard.

## 🔧 Setup

### 1. Configurar Supabase

1. Crie um projeto no [Supabase](https://supabase.com)
2. Vá para **Authentication > Providers** e ative **Google**
3. Adicione suas credenciais do Google OAuth
4. Configure as **Authorized redirect URIs** no Supabase:
   ```
   http://localhost:3000/auth/callback
   https://seu-dominio.com/auth/callback
   ```

### 2. Variáveis de Ambiente

Copie o arquivo `.env.example` para `.env`:

```bash
cp .env.example .env
```

Preencha com seus valores do Supabase:

```
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima
```

### 3. Instalar Dependências

Se ainda não tiver instalado `@supabase/supabase-js`:

```bash
npm install @supabase/supabase-js
```

## 📁 Estrutura de Rotas

### Landing Page & Marketing
```
app/
├── (marketing)/
│   ├── page.tsx          → Landing page (/)
│   ├── docs/
│   │   └── page.tsx      → Documentação (/docs)
│   └── terms/
│       └── page.tsx      → Termos (/terms)
```

### Autenticação
```
app/
├── (auth)/
│   └── login/
│       └── page.tsx      → Página de login (/login)
└── auth/
    └── callback/
        └── route.ts      → Callback do OAuth (/auth/callback)
```

### Dashboard (Protegido)
```
app/
└── (dashboard)/
    ├── layout.tsx        → Layout com sidebar
    ├── dashboard/
    │   ├── page.tsx      → Home do dashboard (/dashboard)
    │   ├── widget/
    │   │   └── page.tsx  → Instalação do widget (/dashboard/widget)
    │   ├── integrations/
    │   │   └── page.tsx  → Integrações (/dashboard/integrations)
    │   └── settings/
    │       └── page.tsx  → Configurações (/dashboard/settings)
```

## 🔐 Fluxo de Autenticação

### 1. Usuário não autenticado
- Acessa `/` → Vê a landing page
- Acessa `/login` → Vê a página de login
- Tenta acessar `/dashboard` → É redirecionado para `/login`

### 2. Usuário clica em "Sign in with Google"
- Envia para `supabase.auth.signInWithOAuth({ provider: 'google' })`
- Supabase redireciona para `/auth/callback?code=...`
- A rota `/auth/callback` troca o código por uma sessão
- Token é salvo em cookies
- Usuário é redirecionado para `/dashboard`

### 3. Usuário autenticado
- Acessa `/` → É redirecionado para `/dashboard`
- Acessa `/login` → É redirecionado para `/dashboard`
- Pode navegar pelo dashboard usando a sidebar
- Clica em "Logout" → Limpa cookies e volta para `/login`

## 🎨 Componentes principais

### Middleware (`middleware.ts`)
- Verifica autenticação para `/dashboard/*`
- Redireciona para `/login` se não autenticado
- Redireciona para `/dashboard` se autenticado em `/login` ou `/`

### Sidebar (`components/dashboard/sidebar.tsx`)
- Exibe logo e seletor de workspace
- Links de navegação (Feedbacks, Widget, Integrations, Settings)
- Informações do usuário (nome, email, foto)
- Botão de logout
- Menu hamburger em telas pequenas (drawer)

### Login Page (`app/(auth)/login/page.tsx`)
- Google OAuth button
- Estilo clean com gradientes
- Tratamento de erros

### Dashboard Layout (`app/(dashboard)/layout.tsx`)
- Carrega dados do usuário no servidor
- Passa user info para sidebar
- Main content com bg light

## 🚀 Desenvolvimento

```bash
npm run dev
```

Acesse `http://localhost:3000`

## 📋 Checklist de Configuração

- [ ] Projeto Supabase criado
- [ ] Google OAuth configurado no Supabase
- [ ] Redirect URIs adicionadas
- [ ] Variáveis de ambiente definidas (`.env`)
- [ ] `npm install @supabase/supabase-js` executado
- [ ] `npm run dev` rodando
- [ ] Testar fluxo completo de login

## 🐛 Troubleshooting

**"NEXT_PUBLIC_SUPABASE_URL is not configured"**
- Verifique se as variáveis estão definidas em `.env`
- Certifique-se de reiniciar o servidor após alterar `.env`

**Redirect infinito no login**
- Verifique se o Google OAuth está bem configurado no Supabase
- Verifique as Authorized redirect URIs

**Cookie não é salvo**
- Em desenvolvimento local, cookies são salvos normalmente
- Em produção, certifique-se de usar HTTPS

## 📚 Recursos

- [Supabase Docs](https://supabase.com/docs)
- [Supabase Google Auth](https://supabase.com/docs/guides/auth/social-login/auth-google)
- [Next.js App Router](https://nextjs.org/docs/app)
