# Configuração de URL Alternativa - Vercel + Render

## 🎯 **Objetivo**
Criar uma URL alternativa no Vercel (ex: `expensehub-preview.dev`) que utilize o Render como backend ao invés do Railway.

## 📋 **Opções de Implementação**

### **Opção 1: Environment Variables (Mais Simples)**

#### 1.1. **No Painel do Vercel:**
1. Acesse **Settings** → **Environment Variables**
2. Para environment **Preview** ou **Production**:
   ```
   REACT_APP_USE_RENDER = true
   ```

#### 1.2. **Configuração Automática:**
O frontend já detecta automaticamente quando usar Render baseado em:
- Variable de ambiente: `REACT_APP_USE_RENDER=true`
- URL contendo "preview": `myapp-preview.vercel.app`
- URL contendo "render": `myapp-render.vercel.app`

### **Opção 2: Branch Strategy (Recomendado para Produção)**

#### 2.1. **Criar Branch Preview:**
```bash
git checkout -b preview
git push origin preview
```

#### 2.2. **No Vercel - Configurar Preview Branch:**
1. **Settings** → **Git** → **Production Branch**: `main`
2. **Settings** → **Git** → **Ignored Build Step**: Configure para build apenas preview
3. **Settings** → **Environment Variables** → **Preview**:
   ```
   REACT_APP_PRIMARY_API_URL = https://expenses-app-agxa.onrender.com
   REACT_APP_BACKUP_API_URL = https://expenses-app-agxa.onrender.com
   ```

### **Opção 3: Subdomínios com expensehub.dev**

#### 3.1. **Estrutura de Subdomínios:**
```
www.expensehub.dev        → Produção (Railway)
preview.expensehub.dev    → Preview/Testing (Render)
app.expensehub.dev        → App Principal (Railway)
api.expensehub.dev        → Redirect para API
test.expensehub.dev       → Ambiente de Teste (Render)
```

#### 3.2. **Configurar DNS no Registrador:**
```
Type: CNAME | Name: www     | Value: cname.vercel-dns.com
Type: CNAME | Name: preview | Value: cname.vercel-dns.com  
Type: CNAME | Name: app     | Value: cname.vercel-dns.com
Type: CNAME | Name: test    | Value: cname.vercel-dns.com
Type: CNAME | Name: api     | Value: expenses-app-agxa.onrender.com
```

#### 3.3. **No Vercel - Adicionar Domínios:**
1. **Settings** → **Domains**
2. Adicionar cada subdomínio:
   - `www.expensehub.dev`
   - `preview.expensehub.dev`
   - `app.expensehub.dev`
   - `test.expensehub.dev`

#### 3.4. **Environment Variables por Domínio:**
- **www.expensehub.dev**: Sem variables (usa Railway)
- **preview.expensehub.dev**: `REACT_APP_USE_RENDER = true`
- **test.expensehub.dev**: `REACT_APP_USE_RENDER = true`

### **Opção 4: Redirects Automáticos**

#### 4.1. **Criar arquivo vercel.json com redirects:**
```json
{
  "redirects": [
    {
      "source": "/api/(.*)",
      "destination": "https://expenses-app-agxa.onrender.com/$1",
      "permanent": false
    }
  ]
}
```

## 🔧 **Configuração Atual Implementada**

### **Detecção Automática por Subdomínio:**
```typescript
const getApiUrl = () => {
  if (process.env.NODE_ENV === 'development') {
    return LOCAL_API_URL;
  }
  
  const hostname = window.location.hostname;
  
  // Usar Render para subdomínios específicos:
  if (process.env.REACT_APP_USE_RENDER === 'true' || 
      hostname.includes('preview.') ||
      hostname.includes('test.') ||
      hostname === 'preview.expensehub.dev') {
    return BACKUP_API_URL; // Render
  }
  
  return PRIMARY_API_URL; // Railway (padrão)
};
```

### **URLs Configuradas:**
- **Railway (Padrão):** `https://expenses-app-production.up.railway.app`
- **Render (Alternativo):** `https://expenses-app-agxa.onrender.com`
- **Local:** `http://localhost:3001`

## 🚀 **Passos para Implementar**

### **Implementação Rápida (5 minutos):**

1. **No Vercel Dashboard:**
   - Settings → Environment Variables
   - Adicionar para Preview: `REACT_APP_USE_RENDER = true`

2. **Deploy Preview:**
   ```bash
   git commit -m "feat: add render backend support for preview"
   git push origin main
   ```

3. **Testar:**
   - URL Preview automática: `expenses-app-git-preview-username.vercel.app`
   - Verificar se está usando Render backend

### **Implementação Completa (Domínio Personalizado):**

1. **Registrar domínio** `expensehub-preview.dev`
2. **Configurar DNS** apontando para Vercel
3. **Adicionar no Vercel** Settings → Domains
4. **Configurar environment** `REACT_APP_USE_RENDER = true`

## ✅ **Verificação**

### **Como testar se está funcionando:**
```javascript
// Console do navegador
console.log('API URL:', apiClient.defaults.baseURL);
```

### **Monitoramento:**
- Preview URL sempre usa Render
- Production URL sempre usa Railway
- Local development usa localhost

---

**Resultado:** Duas URLs de produção com backends diferentes, gerenciadas automaticamente pelo mesmo código! 🎉
