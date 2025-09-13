# Otimizações de Infraestrutura - Supabase & Railway

## Problema Identificado
Após períodos de inatividade, o app apresentava timeouts e cancelamentos de requests devido a:
1. **Cold Starts** no Railway (serviço "hibernando")
2. **Connection Pooling** ineficiente no Supabase
3. **Timeout** inadequado nas configurações de rede

## Soluções Implementadas

### 1. Otimização da Conexão Supabase 🗄️

**Arquivo:** `backend/src/config/database.config.ts`

- **pgbouncer=true**: Ativa o pooling de conexões do Supabase
- **connection_limit=3**: Limita conexões simultâneas (adequado para Railway)
- **pool_timeout=10**: Timeout de 10s para obter conexão do pool
- **connect_timeout=30**: Timeout de 30s para conectar ao banco

```typescript
// Parâmetros automáticos adicionados à URL do Supabase
const params = new URLSearchParams({
  pgbouncer: 'true',
  connection_limit: '3',
  pool_timeout: '10',
  connect_timeout: '30'
});
```

### 2. Sistema Keep-Alive para Railway ⚡

**Arquivo:** `backend/src/health/keep-alive.service.ts`

- **Interval de 10 minutos**: Evita que o serviço "hiberne"
- **Apenas em produção**: Não interfere no desenvolvimento
- **Health Check integrado**: Usa endpoint `/health` existente

```typescript
@Injectable()
export class KeepAliveService implements OnModuleInit {
  constructor(private readonly healthService: HealthService) {}

  onModuleInit() {
    if (process.env.NODE_ENV === 'production') {
      setInterval(() => {
        this.healthService.check();
      }, 10 * 60 * 1000); // 10 minutos
    }
  }
}
```

### 3. Timeout e Retry no Frontend 🔄

**Arquivo:** `frontend/src/api/client.ts`

- **Timeout de 30s**: Adequado para cold starts
- **Retry exponencial**: 3 tentativas com backoff
- **Detecção inteligente**: Apenas retenta erros de rede

### 4. Schema Prisma Atualizado 📋

**Arquivo:** `backend/prisma/schema.prisma`

- **directUrl**: Suporte para conexão direta ao Supabase
- **Flexibilidade**: Permite usar pooler ou conexão direta conforme necessário

## Impacto Esperado

### ✅ Benefícios
- **Redução de Cold Starts**: Keep-alive mantém Railway ativo
- **Conexões mais eficientes**: Pooling otimizado do Supabase
- **Menor latência**: Parâmetros de timeout ajustados
- **Melhor experiência**: Retries automáticos transparentes

### 📊 Métricas a Monitorar
- Tempo de resposta após inatividade
- Taxa de sucesso das requests
- Logs de conexão do Prisma
- Health checks do Railway

## Configuração de Produção

### Variáveis de Ambiente Necessárias:
```bash
DATABASE_URL=postgresql://user:pass@host:5432/db?pgbouncer=true&connection_limit=3
DIRECT_URL=postgresql://user:pass@host:5432/db  # Opcional para migrations
NODE_ENV=production
```

### Verificação no Railway:
1. **Health Check**: `GET /health` deve retornar 200
2. **Logs**: Verificar keep-alive a cada 10min
3. **Metrics**: Monitorar tempo de resposta

## Próximos Passos

1. **Deploy em produção** para testar as otimizações
2. **Monitoramento ativo** dos logs do Railway
3. **Ajuste fino** dos parâmetros se necessário
4. **Documentação** das métricas de performance

---

*Otimizações implementadas para resolver timeouts e cancelamentos após períodos de inatividade.*
