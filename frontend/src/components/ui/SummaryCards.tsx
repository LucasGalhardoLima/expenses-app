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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="card animate-pulse"
          >
            <div className="h-4 bg-gray-200 rounded mb-3"></div>
            <div className="h-8 bg-gray-200 rounded mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: 'Receitas',
      amount: summary.totalIncome,
      count: summary.incomeCount,
      icon: ArrowUpIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      change: '+12%', // Você pode calcular isso baseado em dados históricos
    },
    {
      title: 'Despesas',
      amount: summary.totalExpenses,
      count: summary.expenseCount,
      icon: ArrowDownIcon,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      change: '+8%',
    },
    {
      title: 'Saldo',
      amount: summary.balance,
      count: summary.incomeCount + summary.expenseCount,
      icon: BanknotesIcon,
      color: summary.balance >= 0 ? 'text-blue-600' : 'text-red-600',
      bgColor: summary.balance >= 0 ? 'bg-blue-50' : 'bg-red-50',
      borderColor: summary.balance >= 0 ? 'border-blue-200' : 'border-red-200',
      change: summary.balance >= 0 ? '+5%' : '-3%',
    },
  ];

  return (
    <div className="spacing-mobile mb-6">
      {/* Mobile: Stack cards vertically on small screens */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {cards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={index}
              className={`
                card hover:shadow-md active:scale-[0.98] 
                transition-all duration-200 touch-manipulation
                border-l-4 ${card.borderColor}
              `}
            >
              {/* Mobile-optimized layout */}
              <div className="flex items-start justify-between mb-3">
                <div className={`
                  p-2.5 rounded-lg ${card.bgColor} ${card.borderColor} border
                `}>
                  <Icon className={`w-5 h-5 ${card.color}`} />
                </div>
                <div className="text-right">
                  <span className={`text-xs font-medium ${card.color} bg-white px-2 py-1 rounded-full`}>
                    {card.change}
                  </span>
                </div>
              </div>
              
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-gray-600">
                  {card.title}
                </h3>
                <p className={`text-xl sm:text-2xl font-bold ${card.color} leading-tight`}>
                  {formatCurrency(card.amount)}
                </p>
                <p className="text-xs text-gray-500">
                  {card.count} transaç{card.count === 1 ? 'ão' : 'ões'}
                </p>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Quick Stats - Mobile Only */}
      <div className="sm:hidden mt-4 p-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg border border-indigo-100">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Este mês</span>
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <div className="text-xs text-gray-500">Economia</div>
              <div className={`font-semibold ${summary.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {summary.balance >= 0 ? '+' : ''}{((summary.balance / (summary.totalIncome || 1)) * 100).toFixed(0)}%
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-500">Transações</div>
              <div className="font-semibold text-gray-900">
                {summary.incomeCount + summary.expenseCount}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryCards;
