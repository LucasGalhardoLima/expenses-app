# Deploy Configuration

Este documento descreve a configuração de deploy com Railway como backend primário e Render como backup.

## Arquitetura de Deploy

### Frontend (Vercel)
- **Plataforma**: Vercel
- **Branch**: `main`
- **Auto-deploy**: Habilitado

### Backend - Configuração de Failover

#### 🟢 Primary: Railway
- **URL**: `https://expenses-app-production.up.railway.app`
- **Plataforma**: Railway
- **Status**: Backend principal
- **Configuração**: `railway.json`

#### 🟡 Backup: Render
- **URL**: `https://expenses-app-agxa.onrender.com`
- **Plataforma**: Render
- **Status**: Fallback automático
- **Ativação**: Quando Railway falha

## Configuração do Frontend

O frontend possui um sistema de failover automático que:

1. **Desenvolvimento**: Usa `localhost:3001`
2. **Produção**: 
   - Tenta Railway primeiro
   - Se Railway falha (timeout, 5xx, rede), muda para Render automaticamente
   - Após 30 segundos de sucesso no backup, tenta voltar para Railway

### Variáveis de Ambiente

#### `.env.production`
```bash
REACT_APP_PRIMARY_API_URL=https://expenses-app-production.up.railway.app
REACT_APP_BACKUP_API_URL=https://expenses-app-agxa.onrender.com
```

#### Vercel Environment Variables
Configure no dashboard da Vercel:
- `REACT_APP_PRIMARY_API_URL`: URL do Railway
- `REACT_APP_BACKUP_API_URL`: URL do Render

## Configuração do Backend

### Railway

1. **Conectar repositório** ao Railway
2. **Configurar variáveis de ambiente**:
   ```bash
   NODE_ENV=production
   DATABASE_URL=sua-string-conexao-supabase
   PORT=3001
   ```
3. **Deploy automático** na branch `main`

### Render (Backup)

1. **Manter configuração existente**
2. **Não fazer mudanças** - funciona como backup passivo
3. **Monitorar** apenas para garantir que está funcionando

## Monitoramento

### Logs do Sistema de Failover

O frontend registra automaticamente:
- ✅ `Primary API (Railway) working`
- ⚠️ `Primary API (Railway) failed, switching to backup (Render)`
- 🔄 `Resetting to primary API (Railway)`
- ❌ `Both primary (Railway) and backup (Render) APIs failed`

### Health Checks

- **Railway**: Timeout de 10 segundos
- **Render**: Timeout de 10 segundos
- **Auto-retry**: 1 tentativa por request
- **Reset time**: 30 segundos após sucesso no backup

## Deploy Steps

1. **Push para main**: `git push origin main`
2. **Auto-deploy**:
   - Vercel: Frontend automaticamente
   - Railway: Backend automaticamente
   - Render: Mantém versão existente como backup

3. **Verificação**:
   - Teste Railway diretamente
   - Teste failover desligando Railway temporariamente
   - Verificar logs do frontend para confirmar failover

## Troubleshooting

### Se Railway falhar completamente:
1. Frontend mudará automaticamente para Render
2. Logs mostrarão a mudança
3. Usuários continuarão usando a aplicação normalmente

### Se ambos falharem:
1. Verificar Supabase (database)
2. Verificar configurações de ambiente
3. Verificar logs de ambas as plataformas

### Forçar uso do backup:
```javascript
// No console do browser
localStorage.setItem('forceBackupApi', 'true');
location.reload();
```

## Benefícios desta Configuração

1. **Reliability**: 99.9%+ uptime com failover automático
2. **Performance**: Railway geralmente mais rápido que Render
3. **Cost-effective**: Render como backup não gera custos extras
4. **Transparent**: Usuários não percebem mudanças de backend
5. **Self-healing**: Volta automaticamente para Railway quando disponível
