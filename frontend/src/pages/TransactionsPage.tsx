import React, { useState, useMemo } from 'react';
import { useQuery, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import { transactionApi, categoryApi } from '../api';
import { QueryTransactionDto } from '../types';
import { generateMonthOptions, getMonthString } from '../utils';
import TransactionList from '../components/ui/TransactionList';
import FilterBar from '../components/ui/FilterBar';
import SummaryCards from '../components/ui/SummaryCards';
import FloatingActionButton from '../components/ui/FloatingActionButton';
import TransactionModal from '../components/forms/TransactionModal';
import CashFlowView from '../components/budget/CashFlowView';
import CreditCardView from '../components/credit-card/CreditCardView';
import { cn } from '../lib/utils';

const TransactionsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<QueryTransactionDto>({
    month: getMonthString(new Date()),
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'transactions' | 'credit-card'>('transactions');

  // Fetch transactions com infinite scroll
  const {
    data: transactionsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: transactionsLoading,
  } = useInfiniteQuery({
    queryKey: ['transactions', filters],
    queryFn: ({ pageParam = 1 }) => 
      transactionApi.getAll({ ...filters, page: pageParam, limit: 20 }),
    getNextPageParam: (lastPage) => {
      // Verificar se lastPage e pagination existem antes de acessar hasNextPage
      if (!lastPage || !lastPage.pagination) {
        return undefined;
      }
      return lastPage.pagination.hasNextPage ? lastPage.pagination.page + 1 : undefined;
    },
    initialPageParam: 1,
  });

  // Flatten all transactions from all pages
  const transactions = useMemo(() => {
    if (!transactionsData?.pages) {
      return [];
    }
    return transactionsData.pages.flatMap(page => {
      // Verificar se page e page.data existem
      return page?.data || [];
    });
  }, [transactionsData]);

  // Get total count from first page
  const totalTransactions = transactionsData?.pages?.[0]?.pagination?.total || 0;

  // Setup intersection observer for infinite scroll
  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: '100px',
  });

  // Fetch next page when element is in view
  React.useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

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
    if (window.confirm('Tem certeza que deseja excluir esta transação?')) {
      try {
        await transactionApi.delete(transactionId);
        // Invalidate queries to refresh the data
        queryClient.invalidateQueries({ queryKey: ['transactions'] });
        queryClient.invalidateQueries({ queryKey: ['transactions', 'summary'] });
      } catch (error) {
        console.error('Error deleting transaction:', error);
        alert('Erro ao excluir transação. Tente novamente.');
      }
    }
  };

  const isLoading = transactionsLoading || summaryLoading;

  const tabs = [
    { id: 'transactions', label: 'Transações', count: totalTransactions },
    { id: 'credit-card', label: 'Cartão de Crédito' },
  ];

  return (
    <div className="space-y-6 p-4 sm:p-6 pb-20 sm:pb-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Gestão Financeira</h1>
          <p className="mt-1 text-sm text-gray-500">
            Controle completo das suas transações e orçamento
          </p>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-gray-200 overflow-x-auto">
        <nav className="flex space-x-8" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                'whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors',
                activeTab === tab.id
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              )}
            >
              {tab.label}
              {tab.count !== undefined && (
                <span className={cn(
                  'ml-2 py-0.5 px-2 rounded-full text-xs',
                  activeTab === tab.id
                    ? 'bg-indigo-100 text-indigo-600'
                    : 'bg-gray-100 text-gray-600'
                )}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'transactions' && (
        <>
          {/* Transactions Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Transações</h2>
              <p className="mt-1 text-sm text-gray-500">
                Gerencie suas receitas e despesas
              </p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Nova Transação
            </button>
          </div>

          {/* Filter Bar */}
          <FilterBar
            selectedMonth={filters.month}
            onMonthChange={(month) => handleFilterChange({ month })}
            selectedType={filters.type}
            onTypeChange={(type) => handleFilterChange({ type: type === 'all' ? undefined : type })}
            selectedCategory={filters.categoryId}
            onCategoryChange={(categoryId) => handleFilterChange({ categoryId: categoryId || undefined })}
            months={generateMonthOptions()}
            categories={categories}
            hasActiveFilters={!!(filters.type || filters.categoryId)}
            onClearFilters={() => setFilters({ month: filters.month })}
          />

          {/* Summary Cards */}
          {summary && (
            <SummaryCards
              summary={summary}
              isLoading={isLoading}
            />
          )}

          {/* Budget Section */}
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

          {/* Transactions List */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Lista de Transações
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                {totalTransactions > 0 
                  ? `${totalTransactions} transação(ões) encontrada(s)`
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
                showTitle={false}
              />
              
              {/* Infinite scroll trigger */}
              {hasNextPage && (
                <div ref={ref} className="flex justify-center py-4">
                  {isFetchingNextPage ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
                      <span className="text-sm text-gray-500">Carregando mais...</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => fetchNextPage()}
                      className="text-indigo-600 hover:text-indigo-500 text-sm font-medium"
                    >
                      Carregar mais transações
                    </button>
                  )}
                </div>
              )}
              
              {!hasNextPage && transactions.length > 0 && (
                <div className="flex justify-center py-4">
                  <span className="text-sm text-gray-500">
                    Todas as transações foram carregadas
                  </span>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {activeTab === 'credit-card' && (
        <CreditCardView />
      )}

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

export default TransactionsPage;
