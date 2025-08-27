# Guia de Segurança - Configuração de Database

## ⚠️ Problema de Segurança Identificado

O GitHub detectou credenciais expostas porque senhas estavam sendo passadas diretamente na `DATABASE_URL`. Este guia mostra como configurar de forma segura.

## ❌ Configuração Insegura (NÃO FAZER)

```bash
# NUNCA faça isso - expõe credenciais
DATABASE_URL="postgresql://postgres:minha-senha-123@db.supabase.co:5432/postgres"
```

## ✅ Configuração Segura (RECOMENDADO)

### Opção 1: Componentes Separados (Mais Seguro)

```bash
# Configuração segura com componentes separados
DB_HOST=db.your-project.supabase.co
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=sua-senha-segura-aqui
DB_SSL=true
```

### Opção 2: DATABASE_URL com Secrets (Plataformas)

Use secrets/variáveis de ambiente criptografadas nas plataformas:

#### Railway
1. Vá em **Railway Dashboard** → **Seu Projeto** → **Variables**
2. Adicione cada variável separadamente:
   - `DB_HOST`: `db.your-project.supabase.co`
   - `DB_USER`: `postgres`
   - `DB_PASSWORD`: (sua senha - será criptografada automaticamente)
   - `DB_NAME`: `postgres`
   - `DB_SSL`: `true`

#### Render
1. Vá em **Render Dashboard** → **Seu Service** → **Environment**
2. Adicione as variáveis ou use a `DATABASE_URL` completa como secret

#### Vercel (Frontend)
1. **Dashboard** → **Project** → **Settings** → **Environment Variables**
2. Adicione apenas as URLs dos backends (sem credenciais de DB)

## 🔧 Como Funciona a Nova Configuração

### 1. Detecção Automática
O sistema detecta automaticamente qual método usar:

```typescript
// Se DATABASE_URL existe, usa ela
if (process.env.DATABASE_URL) {
  return process.env.DATABASE_URL;
}

// Senão, constrói a partir dos componentes
const url = `postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`;
```

### 2. Prisma Integration
O Prisma recebe a URL construída de forma segura:

```typescript
super({
  datasources: {
    db: {
      url: getDatabaseUrl(), // URL construída internamente
    },
  },
});
```

## 🚀 Steps para Deploy Seguro

### 1. Railway Configuration
```bash
# No Railway Dashboard → Variables
NODE_ENV=production
DB_HOST=db.your-project.supabase.co
DB_USER=postgres
DB_PASSWORD=your-actual-password
DB_NAME=postgres
DB_SSL=true
PORT=3001
```

### 2. Render Configuration (Backup)
```bash
# No Render Dashboard → Environment
NODE_ENV=production
DATABASE_URL=postgresql://postgres:password@host:5432/db?sslmode=require
# OU usar componentes separados como Railway
```

### 3. Vercel Configuration (Frontend)
```bash
# No Vercel Dashboard → Environment Variables
REACT_APP_PRIMARY_API_URL=https://your-app.up.railway.app
REACT_APP_BACKUP_API_URL=https://your-app.onrender.com
```

## 🔒 Boas Práticas de Segurança

1. **Nunca commitar credenciais** nos arquivos `.env`
2. **Usar secrets das plataformas** para senhas
3. **Rotacionar senhas** periodicamente
4. **Monitorar acessos** no Supabase Dashboard
5. **Usar HTTPS** sempre (já configurado)
6. **Configurar IP allowlist** no Supabase se necessário

## 📋 Checklist de Deploy

- [ ] Remover credenciais dos arquivos `.env`
- [ ] Configurar variáveis no Railway Dashboard
- [ ] Configurar variáveis no Render Dashboard  
- [ ] Testar conexão local com componentes separados
- [ ] Fazer deploy e verificar logs
- [ ] Confirmar que aplicação conecta no database
- [ ] Verificar que GitHub não detecta mais credenciais

## 🛠️ Troubleshooting

### Se a conexão falhar:
1. Verificar se todas as variáveis estão configuradas
2. Checar logs do Railway/Render
3. Testar conexão direta com psql:
   ```bash
   psql "postgresql://user:pass@host:5432/db?sslmode=require"
   ```
4. Verificar allowlist de IPs no Supabase

### Se o GitHub ainda detectar problemas:
1. Verificar se não há arquivos `.env` commitados
2. Limpar histórico se necessário
3. Usar `.gitignore` para excluir arquivos sensíveis
