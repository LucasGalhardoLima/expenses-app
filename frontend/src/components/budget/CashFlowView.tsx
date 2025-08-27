import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Plus, Target } from 'lucide-react';
import { QueryTransactionDto, Transaction, TransactionSummary, Category } from '../../types';
import { getMonthString, formatCurrency } from '../../utils';
import { budgetApi } from '../../api';
import BudgetModal from '../forms/BudgetModal';
import { cn } from '../../lib/utils';

interface CashFlowViewProps {
  filters: QueryTransactionDto;
  onFilterChange: (newFilters: Partial<QueryTransactionDto>) => void;
  transactions: Transaction[];
  summary?: TransactionSummary;
  categories: Category[];
  isLoading: boolean;
  onEdit: (transactionId: string) => void;
  onDelete: (transactionId: string) => void;
  onOpenModal: () => void;
}

const CashFlowView: React.FC<CashFlowViewProps> = ({
  filters,
  onFilterChange,
  transactions,
  summary,
  categories,
  isLoading,
  onEdit,
  onDelete,
  onOpenModal,
}) => {
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);

  // Fetch budget for current month
  const { data: budget } = useQuery({
    queryKey: ['budget', filters.month],
    queryFn: () => budgetApi.getByMonth(filters.month || getMonthString(new Date())),
    enabled: !!filters.month,
  });

  const budgetProgress = budget && summary ? {
    percentage: (summary.totalExpenses / budget.amount) * 100,
    remaining: budget.amount - summary.totalExpenses,
    exceeded: summary.totalExpenses > budget.amount
  } : null;

  return (
    <div className="space-y-6">
      {/* Budget Section */}
      {budget ? (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              Orçamento de {new Date(filters.month + '-01').toLocaleDateString('pt-BR', { 
                month: 'long', 
                year: 'numeric' 
              })}
            </h3>
            <button
              onClick={() => setIsBudgetModalOpen(true)}
              className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
            >
              Editar
            </button>
          </div>
          
          {budgetProgress && (
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Gasto</span>
                <span className={cn(
                  "font-medium",
                  budgetProgress.exceeded ? "text-red-600" : "text-gray-900"
                )}>
                  {formatCurrency(summary?.totalExpenses || 0)} / {formatCurrency(budget.amount)}
                </span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={cn(
                    "h-3 rounded-full transition-all",
                    budgetProgress.percentage <= 70 
                      ? "bg-green-500"
                      : budgetProgress.percentage <= 90
                      ? "bg-yellow-500"
                      : "bg-red-500"
                  )}
                  style={{ width: `${Math.min(budgetProgress.percentage, 100)}%` }}
                />
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  {budgetProgress.percentage.toFixed(1)}% utilizado
                </span>
                <span className={cn(
                  "text-sm font-medium",
                  budgetProgress.exceeded ? "text-red-600" : "text-green-600"
                )}>
                  {budgetProgress.exceeded ? 'Excedido em ' : 'Restante: '}
                  {formatCurrency(Math.abs(budgetProgress.remaining))}
                </span>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-gray-50 rounded-lg p-6 text-center">
          <Target className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            Nenhum orçamento definido
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Defina um orçamento mensal para controlar seus gastos.
          </p>
          <button
            onClick={() => setIsBudgetModalOpen(true)}
            className={cn(
              "mt-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white",
              "bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            )}
          >
            <Plus className="-ml-1 mr-2 h-5 w-5" />
            Criar Orçamento
          </button>
        </div>
      )}

      {/* Budget Modal */}
      <BudgetModal
        isOpen={isBudgetModalOpen}
        onClose={() => setIsBudgetModalOpen(false)}
        onSuccess={() => {
          setIsBudgetModalOpen(false);
          // Revalidate budget query
        }}
        month={filters.month || getMonthString(new Date())}
        existingBudget={budget}
      />
    </div>
  );
};

export default CashFlowView;
