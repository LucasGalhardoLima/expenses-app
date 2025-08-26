import React from 'react';
import { 
  PencilIcon, 
  TrashIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from '@heroicons/react/24/outline';
import { Transaction, TransactionType } from '../../types';
import { formatCurrency, getRelativeDate } from '../../utils';

interface TransactionListProps {
  transactions: Transaction[];
  isLoading?: boolean;
  onEdit: (transactionId: string) => void;
  onDelete: (transactionId: string) => void;
}

const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  isLoading,
  onEdit,
  onDelete,
}) => {
  if (isLoading) {
    return (
      <div className="glass-effect rounded-2xl p-6">
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4 animate-pulse">
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/3"></div>
              </div>
              <div className="h-6 bg-gray-200 rounded w-20"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="glass-effect rounded-2xl p-8 text-center">
        <div className="text-gray-400 mb-2">
          <ArrowUpIcon className="w-12 h-12 mx-auto opacity-50" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">
          Nenhuma transação encontrada
        </h3>
        <p className="text-gray-600">
          Adicione sua primeira transação para começar
        </p>
      </div>
    );
  }

  return (
    <div className="glass-effect rounded-2xl p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Recent Transactions
      </h2>
      
      <div className="space-y-3">
        {transactions.map((transaction) => {
          const isIncome = transaction.type === TransactionType.INCOME;
          
          return (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-4 rounded-xl bg-white border border-gray-100 hover:border-gray-200 transition-colors group"
            >
              <div className="flex items-center space-x-4">
                {/* Transaction Type Icon */}
                <div className={`
                  p-2 rounded-full
                  ${isIncome 
                    ? 'bg-green-50 border border-green-200' 
                    : 'bg-red-50 border border-red-200'
                  }
                `}>
                  {isIncome ? (
                    <ArrowUpIcon className="w-5 h-5 text-green-600" />
                  ) : (
                    <ArrowDownIcon className="w-5 h-5 text-red-600" />
                  )}
                </div>

                {/* Category Badge */}
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: transaction.category.color }}
                />

                {/* Transaction Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {transaction.description || transaction.category.name}
                    </p>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      {transaction.category.name}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {getRelativeDate(transaction.date)}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                {/* Amount */}
                <div className="text-right">
                  <p className={`
                    font-semibold
                    ${isIncome ? 'text-green-600' : 'text-red-600'}
                  `}>
                    {isIncome ? '+' : '-'}{formatCurrency(Math.abs(transaction.amount))}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => onEdit(transaction.id)}
                    className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors"
                    aria-label="Edit transaction"
                  >
                    <PencilIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete this transaction?')) {
                        onDelete(transaction.id);
                      }
                    }}
                    className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                    aria-label="Delete transaction"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TransactionList;
