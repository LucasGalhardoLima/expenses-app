# Expenses App - Sistema de Testes Completo

Este projeto agora possui um sistema completo de testes automatizados que garante a qualidade do código e impede que alterações quebrem funcionalidades existentes.

## 🧪 Estrutura de Testes

### Backend
- **Testes Unitários**: Testam funções individuais e classes isoladamente
- **Testes de Integração**: Testam a interação entre componentes
- **Testes E2E**: Testam fluxos completos da API

### Frontend  
- **Testes de Componentes**: Testam componentes React
- **Testes de Integração**: Testam funcionalidades completas

## 🚀 Configuração Inicial

```bash
# Clone o repositório
git clone https://github.com/LucasGalhardoLima/expenses-app.git
cd expenses-app

# Execute o script de setup (recomendado)
chmod +x setup.sh
./setup.sh

# OU configure manualmente:
cd backend && npm install
cd ../frontend && npm install
```

## 🗄️ Configuração do Banco de Dados de Teste

O projeto está configurado para usar um banco PostgreSQL separado para testes:

```bash
# 1. Configure as variáveis de ambiente de teste
cp backend/.env.example backend/.env.test

# 2. Edite backend/.env.test com suas credenciais de teste:
DATABASE_URL="postgresql://test_user:test_password@localhost:5432/expenses_test_db"

# 3. Execute as migrações no banco de teste
cd backend
npx prisma migrate deploy --schema=./prisma/schema.prisma
```

## 🧪 Executando Testes

### Backend

```bash
cd backend

# Testes unitários
npm test

# Testes unitários com cobertura
npm run test:cov

# Testes E2E
npm run test:e2e

# Todos os testes (CI)
npm run test:ci

# Testes em modo watch
npm run test:watch
```

### Frontend

```bash
cd frontend

# Testes de componentes
npm test

# Testes com cobertura
npm test -- --coverage

# Build de produção (teste de build)
npm run build
```

## 🤖 CI/CD Automatizado

### GitHub Actions

O projeto possui um pipeline completo no GitHub Actions que executa:

- ✅ Testes unitários e E2E do backend
- ✅ Testes de componentes do frontend  
- ✅ Verificação de lint e formatação
- ✅ Análise de segurança
- ✅ Auditoria de dependências
- ✅ Relatórios de cobertura

O pipeline é executado automaticamente em:
- Push para branches `main` e `develop`
- Pull Requests para `main` e `develop`

### Proteção da Branch Main

A branch `main` está protegida e requer:
- ✅ Pull Request aprovado
- ✅ Todos os testes passando
- ✅ Verificações de lint/segurança passando
- ✅ Branch atualizada com a main

## 🪝 Git Hooks Locais

### Pre-commit Hook
Executa automaticamente antes de cada commit:
- Formatação automática do código (Prettier)
- Verificação de lint (ESLint)
- Correção automática de problemas simples

### Pre-push Hook
Executa automaticamente antes de cada push:
- Todos os testes unitários
- Todos os testes E2E
- **Bloqueia o push se algum teste falhar**

### Bypassar Hooks (Emergência)

```bash
# Apenas em emergências! Use com cuidado:
git commit --no-verify -m "emergency fix"
git push --no-verify
```

## 📊 Cobertura de Testes

### Módulos Testados

#### Backend - Operações CRUD Completas
- ✅ **Budgets**: Create, Read, Update, Delete
- ✅ **Categories**: Create, Read, Update, Delete  
- ✅ **Credit Cards**: Create, Read, Update, Delete
- ✅ **Credit Card Transactions**: Create, Read, Update, Delete
- 🔄 **Transactions**: Em desenvolvimento

#### Cenários Testados
- ✅ Operações bem-sucedidas
- ✅ Validação de dados de entrada
- ✅ Tratamento de erros
- ✅ Casos extremos (edge cases)
- ✅ Integração com banco de dados
- ✅ APIs REST completas

### Métricas de Cobertura

Execute os comandos para ver relatórios detalhados:

```bash
# Backend
cd backend && npm run test:cov

# Frontend  
cd frontend && npm test -- --coverage
```

## 🛠️ Desenvolvimento

### Adicionando Novos Testes

#### Para Controllers (Backend)
```typescript
// src/module/module.controller.spec.ts
describe('ModuleController', () => {
  // Testes unitários com mocks
});
```

#### Para Services (Backend)
```typescript
// src/module/module.service.spec.ts  
describe('ModuleService', () => {
  // Testes unitários com Prisma mockado
});
```

#### Para E2E (Backend)
```typescript
// test/module/module.e2e-spec.ts
describe('Module (e2e)', () => {
  // Testes de integração com banco real
});
```

#### Para Componentes (Frontend)
```typescript
// src/components/Component.test.tsx
describe('Component', () => {
  // Testes de renderização e interação
});
```

### Executando Testes Durante Desenvolvimento

```bash
# Terminal 1: Backend em modo watch
cd backend && npm run test:watch

# Terminal 2: Frontend em modo watch  
cd frontend && npm test

# Terminal 3: Servidor de desenvolvimento
cd backend && npm run start:dev
cd frontend && npm start
```

## 🚨 Solução de Problemas

### Testes Falhando Localmente

```bash
# 1. Limpe node_modules e reinstale
rm -rf node_modules package-lock.json
npm install

# 2. Regenere o Prisma Client
npx prisma generate

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
