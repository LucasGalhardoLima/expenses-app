const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createCreditCardCategories() {
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

  console.log('🌱 Criando categorias de cartão de crédito...');

  try {
    // Verificar quantas categorias já existem
    const existing = await prisma.creditCardCategory.findMany();
    console.log(`📊 Categorias existentes: ${existing.length}`);
    
    if (existing.length === 0) {
      // Criar todas as categorias
      await prisma.creditCardCategory.createMany({
        data: creditCardCategories,
      });
      console.log('✅ Todas as categorias criadas com sucesso!');
    } else {
      // Verificar quais não existem e criar apenas essas
      for (const category of creditCardCategories) {
        const exists = existing.find(cat => cat.name === category.name);
        if (!exists) {
          await prisma.creditCardCategory.create({
            data: category,
          });
          console.log(`✅ Categoria "${category.name}" criada!`);
        } else {
          console.log(`⏭️ Categoria "${category.name}" já existe`);
        }
      }
    }

    // Listar todas as categorias
    const allCategories = await prisma.creditCardCategory.findMany({
      orderBy: { name: 'asc' }
    });
    
    console.log(`\n📋 Total de categorias de cartão de crédito: ${allCategories.length}`);
    allCategories.forEach((cat, index) => {
      console.log(`${index + 1}. ${cat.name} (${cat.color})`);
    });

  } catch (error) {
    console.error('❌ Erro ao criar categorias:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createCreditCardCategories();
