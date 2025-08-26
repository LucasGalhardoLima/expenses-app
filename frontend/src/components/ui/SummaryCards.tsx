import React from 'react';
import { 
  ArrowUpIcon, 
  ArrowDownIcon, 
  BanknotesIcon 
} from '@heroicons/react/24/outline';
import { TransactionSummary } from '../../types';
import { formatCurrency } from '../../utils';

interface SummaryCardsProps {
  summary: TransactionSummary;
  isLoading?: boolean;
}

const SummaryCards: React.FC<SummaryCardsProps> = ({ summary, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="glass-effect rounded-2xl p-6 animate-pulse"
          >
            <div className="h-6 bg-gray-200 rounded mb-2"></div>
            <div className="h-8 bg-gray-200 rounded mb-1"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: 'Total de Receitas',
      amount: summary.totalIncome,
      count: summary.incomeCount,
      icon: ArrowUpIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
    },
    {
      title: 'Total de Despesas',
      amount: summary.totalExpenses,
      count: summary.expenseCount,
      icon: ArrowDownIcon,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
    },
    {
      title: 'Saldo',
      amount: summary.balance,
      count: summary.incomeCount + summary.expenseCount,
      icon: BanknotesIcon,
      color: summary.balance >= 0 ? 'text-blue-600' : 'text-red-600',
      bgColor: summary.balance >= 0 ? 'bg-blue-50' : 'bg-red-50',
      borderColor: summary.balance >= 0 ? 'border-blue-200' : 'border-red-200',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div
            key={index}
            className={`
              glass-effect rounded-2xl p-6
              hover:scale-[1.02] transition-all duration-300
              border ${card.borderColor}
            `}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`
                p-3 rounded-xl ${card.bgColor}
                border ${card.borderColor}
              `}>
                <Icon className={`w-6 h-6 ${card.color}`} />
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">{card.count} transações</p>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-1">
                {card.title}
              </h3>
              <p className={`
                text-2xl font-bold ${card.color}
                ${index === 2 && summary.balance < 0 ? 'text-red-600' : ''}
              `}>
                {formatCurrency(card.amount)}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SummaryCards;
