const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function migrateCreditCardCategories() {
  console.log('🔄 Iniciando migração das categorias de cartão de crédito...');

  try {
    // 1. Buscar todas as categorias de cartão de crédito existentes
    const creditCardCategories = await prisma.creditCardCategory.findMany();
    console.log(`📋 Encontradas ${creditCardCategories.length} categorias de cartão de crédito`);

    // 2. Buscar categorias normais existentes
    const normalCategories = await prisma.category.findMany();
    console.log(`📋 Encontradas ${normalCategories.length} categorias normais`);

    // 3. Criar um mapeamento de categorias de cartão para categorias normais
    const categoryMapping = new Map();

    for (const ccCategory of creditCardCategories) {
      // Verificar se já existe uma categoria normal com o mesmo nome
      let existingCategory = normalCategories.find(
        cat => cat.name.toLowerCase() === ccCategory.name.toLowerCase()
      );

      if (existingCategory) {
        console.log(`🔗 Mapeando "${ccCategory.name}" → categoria existente "${existingCategory.name}"`);
        categoryMapping.set(ccCategory.id, existingCategory.id);
      } else {
        // Criar uma nova categoria normal baseada na categoria de cartão
        const newCategory = await prisma.category.create({
          data: {
            name: ccCategory.name,
            color: ccCategory.color,
            type: 'EXPENSE', // Assumindo que categorias de cartão são despesas
          }
        });
        console.log(`➕ Criada nova categoria: "${newCategory.name}"`);
        categoryMapping.set(ccCategory.id, newCategory.id);
      }
    }

    // 4. Buscar todas as transações de cartão de crédito
    const creditCardTransactions = await prisma.creditCardTransaction.findMany();
    console.log(`💳 Encontradas ${creditCardTransactions.length} transações de cartão de crédito`);

    // 5. Atualizar as transações de cartão para usar as categorias normais
    let updatedCount = 0;
    for (const transaction of creditCardTransactions) {
      const newCategoryId = categoryMapping.get(transaction.categoryId);
      if (newCategoryId) {
        await prisma.creditCardTransaction.update({
          where: { id: transaction.id },
          data: { categoryId: newCategoryId }
        });
        updatedCount++;
      } else {
        console.warn(`⚠️ Não foi possível mapear categoria para transação ${transaction.id}`);
      }
    }

    console.log(`✅ ${updatedCount} transações de cartão atualizadas`);

    // 6. Exibir resumo da migração
    console.log('\n📊 Resumo da migração:');
    console.log(`- Categorias de cartão processadas: ${creditCardCategories.length}`);
    console.log(`- Novas categorias criadas: ${Array.from(categoryMapping.values()).length - normalCategories.length}`);
    console.log(`- Transações atualizadas: ${updatedCount}`);

    console.log('\n🎉 Migração concluída com sucesso!');
    console.log('\n⚠️ PRÓXIMOS PASSOS:');
    console.log('1. Execute: npx prisma migrate dev --name "unify-categories"');
    console.log('2. Remova a tabela credit_card_categories manualmente se necessário');

  } catch (error) {
    console.error('❌ Erro durante a migração:', error);
  } finally {
    await prisma.$disconnect();
  }
}

migrateCreditCardCategories();
