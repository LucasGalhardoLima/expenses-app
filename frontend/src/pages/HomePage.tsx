import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Wallet, CreditCard } from 'lucide-react';
import { transactionApi, categoryApi } from '../api';
import { QueryTransactionDto } from '../types';
import { getMonthString } from '../utils';
import TransactionModal from '../components/forms/TransactionModal';
import { Tabs, TabPanel } from '../components/ui/Tabs';
import CashFlowView from '../components/budget/CashFlowView';
import CreditCardView from '../components/credit-card/CreditCardView';

const HomePage: React.FC = () => {
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

  const tabs = [
    {
      id: 'cash-flow',
      label: 'Fluxo de Caixa',
      icon: Wallet,
    },
    {
      id: 'credit-card',
      label: 'Cartão de Crédito',
      icon: CreditCard,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Controle completo das suas finanças
        </p>
      </div>

      {/* Tabs */}
      <Tabs tabs={tabs} defaultTab="cash-flow">
        <TabPanel tabId="cash-flow">
          <CashFlowView 
            filters={filters}
            onFilterChange={handleFilterChange}
            transactions={transactions}
            summary={summary}
            categories={categories}
            isLoading={isLoading}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onOpenModal={() => setIsModalOpen(true)}
          />
        </TabPanel>
        
        <TabPanel tabId="credit-card">
          <CreditCardView />
        </TabPanel>
      </Tabs>

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

export default HomePage;
