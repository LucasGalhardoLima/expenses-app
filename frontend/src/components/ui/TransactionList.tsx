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
  showTitle?: boolean;
}

const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  isLoading,
  onEdit,
  onDelete,
  showTitle = true,
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
    <div className="card">
      {showTitle && (
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Transações Recentes
          </h2>
          {/* Mobile: Show count */}
          <span className="text-sm text-gray-500 sm:hidden">
            {transactions.length}
          </span>
        </div>
      )}
      
      <div className="space-y-2 sm:space-y-3">
        {transactions.map((transaction) => {
          const isIncome = transaction.type === TransactionType.INCOME;
          
          return (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-3 sm:p-4 rounded-lg bg-gray-50 sm:bg-white border border-gray-100 hover:border-gray-200 active:bg-gray-100 transition-all group touch-manipulation"
            >
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                {/* Transaction Type Icon */}
                <div className={`
                  p-2 rounded-full flex-shrink-0
                  ${isIncome 
                    ? 'bg-green-50 border border-green-200' 
                    : 'bg-red-50 border border-red-200'
                  }
                `}>
                  {isIncome ? (
                    <ArrowUpIcon className="w-4 h-4 text-green-600" />
                  ) : (
                    <ArrowDownIcon className="w-4 h-4 text-red-600" />
                  )}
                </div>

                {/* Category Badge - Mobile: smaller */}
                <div 
                  className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: transaction.category.color }}
                />

                {/* Transaction Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {transaction.description || transaction.category.name}
                    </p>
                    {/* Desktop: Show category badge */}
                    <span className="hidden sm:inline-flex text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      {transaction.category.name}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 mt-1">
                    <p className="text-xs text-gray-500">
                      {getRelativeDate(transaction.date)}
                    </p>
                    {/* Mobile: Show category name */}
                    <span className="sm:hidden text-xs text-gray-400">
                      • {transaction.category.name}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
                {/* Amount */}
                <div className="text-right">
                  <p className={`
                    text-sm sm:text-base font-semibold
                    ${isIncome ? 'text-green-600' : 'text-red-600'}
                  `}>
                    {isIncome ? '+' : '-'}{formatCurrency(Math.abs(transaction.amount))}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => onEdit(transaction.id)}
                    className="nav-item text-gray-400 hover:text-blue-600"
                    aria-label="Editar transação"
                  >
                    <PencilIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm('Tem certeza que deseja excluir esta transação?')) {
                        onDelete(transaction.id);
                      }
                    }}
                    className="nav-item text-gray-400 hover:text-red-600"
                    aria-label="Excluir transação"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Mobile: Load more button if many transactions */}
      {transactions.length > 10 && (
        <div className="mt-4 text-center sm:hidden">
          <button className="btn-secondary text-sm px-6 py-2">
            Ver mais transações
          </button>
        </div>
      )}
    </div>
  );
};

export default TransactionList;
