import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { transactionApi, categoryApi } from '../api';
import { getMonthString } from '../utils';
import MonthlyComparisonChart from './charts/MonthlyComparisonChart';
import CategoryPieChart from './charts/CategoryPieChart';
import TrendLineChart from './charts/TrendLineChart';
import DashboardStats from './charts/DashboardStats';
import { 
  BanknotesIcon,
  CreditCardIcon,
  ChartBarIcon,
  CalendarDaysIcon
} from '@heroicons/react/24/outline';

const Dashboard: React.FC = () => {
  // Buscar dados dos últimos 6 meses para comparação
  const getLastMonths = (count: number) => {
    const months = [];
    for (let i = 0; i < count; i++) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      months.push(getMonthString(date));
    }
    return months.reverse();
  };

  const months = getLastMonths(6);
  const currentMonth = getMonthString(new Date());
  const previousMonth = getMonthString(new Date(new Date().setMonth(new Date().getMonth() - 1)));

  // Fetch summary para o mês atual
  const { data: currentSummary, isLoading: currentLoading } = useQuery({
    queryKey: ['transactions', 'summary', currentMonth],
    queryFn: () => transactionApi.getSummary({ month: currentMonth }),
  });

  // Fetch summary para o mês anterior
  const { data: previousSummary } = useQuery({
    queryKey: ['transactions', 'summary', previousMonth],
    queryFn: () => transactionApi.getSummary({ month: previousMonth }),
  });

  // Fetch dados de comparação mensal
  const { data: monthlyData, isLoading: monthlyLoading } = useQuery({
    queryKey: ['transactions', 'monthly-comparison'],
    queryFn: async () => {
      const promises = months.map(async (month) => {
        const summary = await transactionApi.getSummary({ month });
        return {
          month: new Date(month + '-01').toLocaleDateString('pt-BR', { month: 'short' }),
          receitas: summary?.totalIncome || 0,
          despesas: summary?.totalExpenses || 0,
          saldo: (summary?.totalIncome || 0) - (summary?.totalExpenses || 0),
        };
      });
      return Promise.all(promises);
    },
  });

  // Fetch categorias para gráfico de pizza
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryApi.getAll(),
  });

  // Fetch transações do mês atual para análise de categorias
  const { data: currentTransactionsResponse } = useQuery({
    queryKey: ['transactions', currentMonth],
    queryFn: () => transactionApi.getAll({ month: currentMonth }),
  });

  const currentTransactions = React.useMemo(() => {
    return currentTransactionsResponse?.data || [];
  }, [currentTransactionsResponse]);

  // Processar dados das categorias de despesas
  const expenseCategories = React.useMemo(() => {
    if (!currentTransactions.length || !categories.length) return [];

    const expenseTransactions = currentTransactions.filter(
      (t: any) => t.type === 'EXPENSE'
    );

    const categoryTotals = expenseTransactions.reduce((acc: any, transaction: any) => {
      const categoryId = transaction.categoryId;
      const category = categories.find((c: any) => c.id === categoryId);
      
      if (category) {
        acc[categoryId] = (acc[categoryId] || 0) + parseFloat(transaction.amount);
      }
      return acc;
    }, {});

    const total = Object.values(categoryTotals).reduce((sum: number, amount: any) => sum + amount, 0);

    return Object.entries(categoryTotals)
      .map(([categoryId, amount]: [string, any]) => {
        const category = categories.find((c: any) => c.id === categoryId);
        return {
          name: category?.name || 'Categoria',
          value: amount,
          color: category?.color || '#6b7280',
          percentage: (amount / total) * 100,
        };
      })
      .sort((a, b) => b.value - a.value)
      .slice(0, 8); // Mostrar apenas top 8 categorias
  }, [currentTransactions, categories]);

  // Dados para tendência de despesas
  const expenseTrend = React.useMemo(() => {
    if (!monthlyData) return [];
    return monthlyData.map((data) => ({
      period: data.month,
      value: data.despesas,
    }));
  }, [monthlyData]);

  // Dados para tendência de receitas
  const incomeTrend = React.useMemo(() => {
    if (!monthlyData) return [];
    return monthlyData.map((data) => ({
      period: data.month,
      value: data.receitas,
    }));
  }, [monthlyData]);

  // Estatísticas para os cards
  const dashboardStats = React.useMemo(() => {
    const current = currentSummary;
    const previous = previousSummary;
    
    // Função para garantir que o valor seja um número válido
    const safeNumber = (value: any) => {
      const num = Number(value);
      return isNaN(num) ? 0 : num;
    };
    
    return [
      {
        title: 'Receitas',
        value: safeNumber(current?.totalIncome),
        previousValue: safeNumber(previous?.totalIncome),
        format: 'currency' as const,
        icon: BanknotesIcon,
        trend: 'up' as const,
      },
      {
        title: 'Despesas',
        value: safeNumber(current?.totalExpenses),
        previousValue: safeNumber(previous?.totalExpenses),
        format: 'currency' as const,
        icon: CreditCardIcon,
        trend: 'down' as const,
      },
      {
        title: 'Saldo',
        value: safeNumber(current?.totalIncome) - safeNumber(current?.totalExpenses),
        previousValue: safeNumber(previous?.totalIncome) - safeNumber(previous?.totalExpenses),
        format: 'currency' as const,
        icon: ChartBarIcon,
      },
      {
        title: 'Transações',
        value: currentTransactions?.length || 0,
        format: 'number' as const,
        icon: CalendarDaysIcon,
      },
    ];
  }, [currentSummary, previousSummary, currentTransactions]);

  return (
    <div className="min-h-screen bg-snow">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 pb-20 sm:pb-6">
        {/* Header */}
        <div className="text-center sm:text-left mb-6">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-black mb-1 sm:mb-2">
            Dashboard Financeiro
          </h1>
          <p className="text-black/70 text-xs sm:text-sm lg:text-base">
            Análise completa das suas finanças com comparações mensais
          </p>
        </div>

        {/* Estatísticas */}
        <DashboardStats stats={dashboardStats} isLoading={currentLoading} />

        {/* Gráficos principais */}
        <div className="space-y-6">
          {/* Comparação Mensal - sempre full width */}
          <MonthlyComparisonChart 
            data={monthlyData || []} 
            isLoading={monthlyLoading}
          />

          {/* Grid de gráficos secundários */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Categorias de Despesas */}
            <CategoryPieChart
              data={expenseCategories}
              title="Despesas por Categoria"
              isLoading={currentLoading}
            />

            {/* Tendência de Despesas */}
            <TrendLineChart
              data={expenseTrend}
              title="Tendência de Despesas"
              dataKey="value"
              color="#ef4444"
              isLoading={monthlyLoading}
            />
          </div>

          {/* Tendência de Receitas - sempre full width */}
          <TrendLineChart
            data={incomeTrend}
            title="Tendência de Receitas"
            dataKey="value"
            color="#10b981"
            isLoading={monthlyLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
