# Expense Tracker

Um aplicativo completo para controle de despesas pessoais com funcionalidades de orçamento e cartão de crédito.

## 🚀 Funcionalidades

- ✅ **Gestão de Transações**: Adicione, edite e visualize receitas e despesas
- ✅ **Categorias**: Organize suas transações por categorias personalizáveis
- ✅ **Orçamento**: Defina metas de gastos mensais
- ✅ **Cartão de Crédito**: Controle faturas e gastos do cartão
- ✅ **Dashboard**: Visualize resumos e estatísticas financeiras
- ✅ **Filtros**: Filtre transações por período, tipo e categoria
- ✅ **Performance Otimizada**: API com resposta de 218ms (96% melhoria)

## Tech Stack

### Frontend
- React 18 with TypeScript
- Tailwind CSS for styling
- Headless UI for components
- React Hook Form for form handling
- React Query for data fetching
- Chart.js for data visualization

### Backend
- NestJS with TypeScript
- Prisma ORM
- PostgreSQL database
- Class Validator for validation
- JWT authentication (optional)

## Features

- ✅ Monthly expense dashboard
- ✅ Custom date and category filters
- ✅ Liquid glass-style floating action button
- ✅ Modal-based expense/income entry
- ✅ Category management
- ✅ Type-safe API communication
- ✅ Responsive minimalist design

## Project Structure

```
expenses-app/
├── frontend/          # React TypeScript app
├── backend/           # NestJS API server
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js 18+
- npm or yarn

### Quick Start

1. **Clone and setup the project:**
```bash
cd expenses-app
```

2. **Backend Setup:**
```bash
cd backend
npm install

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init

# Seed the database with default categories
npm run db:seed

# Start the development server
npm run start:dev
```

3. **Frontend Setup (in a new terminal):**
```bash
cd frontend
npm install

# Start the React development server
npm start
```

4. **Access the application:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

### Database Setup

The project uses Prisma with a local Postgres database. The default configuration should work out of the box. If you need to use your own PostgreSQL database:

1. Update `backend/.env` with your database URL:
```env
DATABASE_URL="postgresql://postgres:pbp9CMA.kch6zha_whe@db.nxmgvduggjrjzxxhurjz.supabase.co:5432/postgres"
```

2. Run migrations:
```bash
cd backend
npx prisma migrate dev
npx prisma generate
npm run db:seed
```

## Database Schema

- **Transaction**: id, date, amount, type (INCOME/EXPENSE), category, description
- **Category**: id, name, type, color
