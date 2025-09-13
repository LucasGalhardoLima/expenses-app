# Guia de Testes - Manual

## Infraestrutura de Testes Disponível

### ✅ Testes Unitários
- **93 testes** cobrindo todos os controllers e services
- **Comando**: `npm run test`
- **Localização**: `src/**/*.spec.ts`

### ✅ Testes E2E (End-to-End)
- **18 testes** cobrindo todos os endpoints CRUD
- **Comando**: `npm run test:e2e`
- **Localização**: `test/**/*.e2e-spec.ts`
- **Requisito**: Banco de dados PostgreSQL rodando na porta 5432

### ✅ Testes Completos
- **Comando**: `npm run test:all`
- **Execução**: Testes unitários + E2E em sequência

## Cobertura de Testes

### Módulos Testados
- ✅ **Budgets** - CRUD completo
- ✅ **Categories** - CRUD completo  
- ✅ **Transactions** - CRUD completo + Summary
- ✅ **Credit Cards** - CRUD completo

### Cenários Cobertos
- ✅ Criação de recursos
- ✅ Listagem com filtros e paginação
- ✅ Busca por ID
- ✅ Atualização de recursos
- ✅ Exclusão de recursos
- ✅ Validação de dados inválidos
- ✅ Tratamento de recursos não encontrados
- ✅ Cenários de conflito (duplicatas)

## Scripts Disponíveis

```bash
# Testes unitários apenas
npm run test

# Testes E2E apenas (requer banco)
npm run test:e2e

# Todos os testes
npm run test:all

# Testes com coverage
npm run test:cov

# Testes em modo watch
npm run test:watch
```

## Observações

### ❌ Removido: CI/CD Automático
- GitHub Actions workflow removido
- Husky git hooks removidos
- Validação automática no push removida

### ✅ Mantido: Infraestrutura Manual
- Todos os testes funcionais e prontos para execução manual
- Scripts npm organizados e funcionais
- Estrutura de testes robusta e completa

## Para Executar os Testes E2E

1. Certifique-se que o PostgreSQL está rodando na porta 5432
2. Configure as variáveis de ambiente no `.env`
3. Execute: `npm run test:e2e`

**Nota**: Os testes unitários não dependem de banco de dados e sempre podem ser executados.

# 3. Execute migrações do banco de teste
npx prisma migrate deploy

# 4. Limpe cache do Jest
npm test -- --clearCache
```

### Hooks Git Não Funcionando

```bash
# Reinstale hooks
cd backend
npm run prepare
chmod +x .husky/pre-commit .husky/pre-push
```

### Problemas de Banco de Dados

```bash
# Reset do banco de teste
npx prisma migrate reset --force

# Recriar banco
npx prisma db push
```

## 📋 Checklist para Pull Requests

Antes de abrir um PR, verifique:

- [ ] ✅ Todos os testes passando localmente
- [ ] ✅ Código formatado (Prettier)
- [ ] ✅ Sem erros de lint (ESLint)
- [ ] ✅ Testes adicionados para novas funcionalidades
- [ ] ✅ Documentação atualizada se necessário
- [ ] ✅ Commits com mensagens descritivas
- [ ] ✅ Branch atualizada com a main

## 🎯 Objetivos Alcançados

- ✅ Testes automatizados para todas operações CRUD
- ✅ CI/CD pipeline completo no GitHub Actions
- ✅ Proteção da branch main com testes obrigatórios
- ✅ Git hooks locais para qualidade de código
- ✅ Ambiente de teste isolado
- ✅ Relatórios de cobertura
- ✅ Análise de segurança automatizada
- ✅ Documentação completa

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Adicione testes para sua funcionalidade
4. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
5. Push para a branch (`git push origin feature/nova-funcionalidade`)
6. Abra um Pull Request

O sistema de testes garantirá que sua contribuição não quebre funcionalidades existentes! 🛡️
