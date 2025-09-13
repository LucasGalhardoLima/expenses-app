# 🚀 Fix Render Database Connection

## ⚡ **Solução Rápida (2 minutos):**

### **No Render Dashboard:**
1. **Environment Variables**
2. **Adicionar nova variável:**
   ```
   Name: RENDER_DATABASE_URL
   Value: postgres://prisma.nxmgvduggjrjzxxhurjz:expenses_prisma_2024!@aws-1-sa-east-1.pooler.supabase.com:6543/postgres
   ```

### **Ou Editar DATABASE_URL existente:**
```
DATABASE_URL = postgres://prisma.nxmgvduggjrjzxxhurjz:expenses_prisma_2024!@aws-1-sa-east-1.pooler.supabase.com:6543/postgres
```

## 🔧 **Diferenças:**
- **Railway**: Porta 5432 (Session Mode) ✅ Funciona
- **Render**: Precisa porta 6543 (Transaction Mode) 🔄 

## 📊 **URL Correta para Render:**
```
postgres://prisma.nxmgvduggjrjzxxhurjz:expenses_prisma_2024!@aws-1-sa-east-1.pooler.supabase.com:6543/postgres
```

## ✅ **Depois de configurar:**
1. **Deploy automático** no Render
2. **Logs devem mostrar**: "Using Render-specific DATABASE_URL"
3. **preview.expensehub.dev** deve funcionar!
