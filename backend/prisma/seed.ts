import { PrismaClient, TransactionType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Criar categorias padrão de despesas
  const expenseCategories = [
    { name: 'Alimentação', color: '#FF6B6B', type: TransactionType.EXPENSE },
    { name: 'Transporte', color: '#4ECDC4', type: TransactionType.EXPENSE },
    { name: 'Compras', color: '#45B7D1', type: TransactionType.EXPENSE },
    { name: 'Entretenimento', color: '#96CEB4', type: TransactionType.EXPENSE },
    {
      name: 'Contas & Utilidades',
      color: '#FFEAA7',
      type: TransactionType.EXPENSE,
    },
    { name: 'Saúde', color: '#DDA0DD', type: TransactionType.EXPENSE },
    { name: 'Educação', color: '#98D8C8', type: TransactionType.EXPENSE },
    { name: 'Viagem', color: '#F7DC6F', type: TransactionType.EXPENSE },
    { name: 'Casa', color: '#FFB347', type: TransactionType.EXPENSE },
    { name: 'Vestuário', color: '#DEB887', type: TransactionType.EXPENSE },
    { name: 'Outros', color: '#AEB6BF', type: TransactionType.EXPENSE },
  ];

  // Criar categorias padrão de receitas
  const incomeCategories = [
    { name: 'Salário', color: '#52C41A', type: TransactionType.INCOME },
    { name: 'Freelance', color: '#1890FF', type: TransactionType.INCOME },
    { name: 'Investimentos', color: '#722ED1', type: TransactionType.INCOME },
    { name: 'Negócios', color: '#13C2C2', type: TransactionType.INCOME },
    { name: 'Presente', color: '#FA8C16', type: TransactionType.INCOME },
    { name: 'Venda', color: '#52C41A', type: TransactionType.INCOME },
    { name: 'Outros', color: '#8C8C8C', type: TransactionType.INCOME },
  ];

  // Criar categorias padrão para cartão de crédito
  const creditCardCategories = [
    { name: 'Compras Online', color: '#FF6B6B' },
    { name: 'Supermercado', color: '#4ECDC4' },
    { name: 'Restaurante', color: '#45B7D1' },
    { name: 'Combustível', color: '#96CEB4' },
    { name: 'Farmácia', color: '#FFEAA7' },
    { name: 'Roupas & Acessórios', color: '#DDA0DD' },
    { name: 'Eletrônicos', color: '#98D8C8' },
    { name: 'Viagem & Hospedagem', color: '#F7DC6F' },
    { name: 'Assinaturas', color: '#FFB347' },
    { name: 'Outros', color: '#AEB6BF' },
  ];

  console.log('🌱 Populando categorias...');

  // Criar categorias de transações normais
  for (const category of [...expenseCategories, ...incomeCategories]) {
    await prisma.category.upsert({
      where: { name: category.name },
      update: {},
      create: category,
    });
  }

  // Criar categorias de cartão de crédito
  const existingCreditCardCategories = await prisma.creditCardCategory.findMany();
  if (existingCreditCardCategories.length === 0) {
    await prisma.creditCardCategory.createMany({
      data: creditCardCategories,
    });
  }

  console.log('✅ Dados populados com sucesso');
}

main()
  .catch((e) => {
    console.error('❌ Falha ao popular dados:', e);
    process.exit(1);
  })
  .finally(() => {
    void prisma.$disconnect();
  });
