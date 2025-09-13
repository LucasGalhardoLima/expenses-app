#!/bin/bash

# Setup script for expenses-app development environment
# This script sets up the development environment and installs git hooks

echo "🚀 Setting up expenses-app development environment..."

# Check if we're in the right directory
if [ ! -d "backend" ] || [ ! -d "frontend" ] || [ ! -f "backend/package.json" ] || [ ! -f "frontend/package.json" ]; then
  echo "❌ Please run this script from the project root directory"
  echo "Make sure you are in the expenses-app directory and both backend/ and frontend/ folders exist"
  exit 1
fi

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install

# Generate Prisma client
echo "🔄 Generating Prisma client..."
npx prisma generate

# Setup Husky hooks
echo "🪝 Setting up Git hooks..."
npm run prepare

# Make hook files executable
chmod +x .husky/pre-commit
chmod +x .husky/pre-push

cd ..

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend
npm install

cd ..

echo "✅ Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Copy .env.example to .env in both backend and frontend directories"
echo "2. Configure your database connection in backend/.env"
echo "3. Run 'npm run prisma:migrate' in backend directory to setup database"
echo "4. Run 'npm run dev' in both backend and frontend directories to start development servers"
echo ""
echo "🧪 Test commands:"
echo "Backend tests: cd backend && npm test"
echo "Frontend tests: cd frontend && npm test"
echo "E2E tests: cd backend && npm run test:e2e"
echo ""
echo "🛡️ Git hooks are now active:"
echo "- Pre-commit: Will run linting and formatting"
echo "- Pre-push: Will run all tests before allowing push"
