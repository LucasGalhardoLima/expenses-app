import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { transactionApi, categoryApi } from '../api';
import { QueryTransactionDto } from '../types';
import { getMonthString, generateMonthOptions } from '../utils';
import SummaryCards from './ui/SummaryCards';
import TransactionList from './ui/TransactionList';
import FilterBar from './ui/FilterBar';
import FloatingActionButton from './ui/FloatingActionButton';
import TransactionModal from './forms/TransactionModal';

const Dashboard: React.FC = () => {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<QueryTransactionDto>({
    month: getMonthString(new Date()),
  });
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

  // Fetch summary
  const {
    data: summary,
    isLoading: summaryLoading,
  } = useQuery({
    queryKey: ['transactions', 'summary', filters],
    queryFn: () => transactionApi.getSummary(filters),
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
    try {
      await transactionApi.delete(transactionId);
      // Invalidate all transaction-related queries to ensure UI updates
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['transactions', 'summary'] });
    } catch (error) {
      console.error('Failed to delete transaction:', error);
    }
  };

  const isLoading = transactionsLoading || summaryLoading;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Expense Tracker
        </h1>
        <p className="text-gray-600">
          Manage your finances with minimalist elegance
        </p>
      </div>

      {/* Filter Bar */}
      <FilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        categories={categories}
        monthOptions={generateMonthOptions()}
      />

      {/* Summary Cards */}
      {summary && (
        <SummaryCards
          summary={summary}
          isLoading={isLoading}
        />
      )}

      {/* Transaction List */}
      <TransactionList
        transactions={transactions}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Floating Action Button */}
      <FloatingActionButton onClick={() => setIsModalOpen(true)} />

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

export default Dashboard;
