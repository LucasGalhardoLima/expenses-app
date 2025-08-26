import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { transactionApi, categoryApi } from '../api';
import { QueryTransactionDto } from '../types';
import { generateMonthOptions } from '../utils';
import TransactionList from '../components/ui/TransactionList';
import FilterBar from '../components/ui/FilterBar';
import TransactionModal from '../components/forms/TransactionModal';
import { cn } from '../lib/utils';

const TransactionsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<QueryTransactionDto>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<string | null>(null);

  // Fetch transactions
  const {
    data: transactions = [],
    isLoading: transactionsLoading,
  } = useQuery({
    queryKey: ['transactions', filters],
    queryFn: () => transactionApi.getAll(filters),
  });

  // Fetch categories
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryApi.getAll(),
  });

  const handleFilterChange = (newFilters: Partial<QueryTransactionDto>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleTransactionSuccess = () => {
    // Invalidate all transaction-related queries to ensure UI updates
    queryClient.invalidateQueries({ queryKey: ['transactions'] });
    queryClient.invalidateQueries({ queryKey: ['transactions', 'summary'] });
    setIsModalOpen(false);
    setEditingTransaction(null);
  };

  const handleEdit = (transactionId: string) => {
    setEditingTransaction(transactionId);
    setIsModalOpen(true);
  };

  const handleDelete = async (transactionId: string) => {
    if (!window.confirm('Tem certeza que deseja excluir esta transação?')) {
      return;
    }

    try {
      await transactionApi.delete(transactionId);
      // Invalidate all transaction-related queries to ensure UI updates
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['transactions', 'summary'] });
    } catch (error) {
      console.error('Failed to delete transaction:', error);
      alert('Erro ao excluir transação. Tente novamente.');
    }
  };

  const handleNewTransaction = () => {
    setEditingTransaction(null);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Transações</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gerencie todas as suas transações
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            type="button"
            onClick={handleNewTransaction}
            className={cn(
              "inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white",
              "bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            )}
          >
            <Plus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            Nova Transação
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Filtros</h3>
        <FilterBar
          filters={filters}
          onFilterChange={handleFilterChange}
          categories={categories}
          monthOptions={generateMonthOptions()}
        />
      </div>

      {/* Transactions Table */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Lista de Transações
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            {transactions.length > 0 
              ? `${transactions.length} transação(ões) encontrada(s)`
              : 'Nenhuma transação encontrada'
            }
          </p>
        </div>
        <div className="border-t border-gray-200">
          <TransactionList
            transactions={transactions}
            isLoading={transactionsLoading}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </div>

      {/* Transaction Modal */}
      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTransaction(null);
        }}
        onSuccess={handleTransactionSuccess}
        categories={categories}
        transactionId={editingTransaction}
      />
    </div>
  );
};

export default TransactionsPage;
