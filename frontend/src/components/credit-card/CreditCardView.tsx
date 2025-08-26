import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { CreditCard, Plus, Calendar, TrendingUp } from 'lucide-react';
import { formatCurrency, getMonthString } from '../../utils';
import { cn } from '../../lib/utils';
import { creditCardApi } from '../../api';
import CreditCardModal from './CreditCardModal';
import CreditCardTransactionModal from './CreditCardTransactionModal';

const CreditCardView: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState(getMonthString(new Date()));
  const [selectedCard, setSelectedCard] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);

  // Fetch credit cards
  const { data: creditCards = [], isLoading: cardsLoading } = useQuery({
    queryKey: ['credit-cards'],
    queryFn: creditCardApi.getAllCards,
  });

  // Fetch credit card bill for selected card and month
  const { data: bill, isLoading: billLoading } = useQuery({
    queryKey: ['credit-card-bill', selectedCard, selectedMonth],
    queryFn: () => creditCardApi.getCardBill(selectedCard, selectedMonth),
    enabled: !!selectedCard && !!selectedMonth,
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Cartão de Crédito</h1>
          <p className="mt-1 text-sm text-gray-500">
            Controle suas faturas e gastos do cartão
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className={cn(
            "inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white",
            "bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          )}
        >
          <Plus className="-ml-1 mr-2 h-5 w-5" />
          Novo Cartão
        </button>
      </div>

      {/* Credit Cards Selection */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Selecionar Cartão</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {creditCards.map((card: any) => (
            <button
              key={card.id}
              onClick={() => setSelectedCard(card.id)}
              className={cn(
                "p-4 border rounded-lg text-left transition-all hover:shadow-md",
                selectedCard === card.id
                  ? "border-indigo-500 bg-indigo-50"
                  : "border-gray-200 hover:border-gray-300"
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">{card.name}</h4>
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: card.color }}
                />
              </div>
              <p className="text-sm text-gray-500">
                Limite: {formatCurrency(card.limit)}
              </p>
              <p className="text-xs text-gray-400">
                Fechamento: dia {card.closingDay} | Vencimento: dia {card.dueDay}
              </p>
            </button>
          ))}
        </div>

        {creditCards.length === 0 && !cardsLoading && (
          <div className="text-center py-8">
            <CreditCard className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Nenhum cartão cadastrado
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Adicione seu primeiro cartão para começar.
            </p>
          </div>
        )}
      </div>

      {/* Bill Details */}
      {selectedCard && bill && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-gray-900">
              Fatura de {new Date(selectedMonth + '-01').toLocaleDateString('pt-BR', { 
                month: 'long', 
                year: 'numeric' 
              })}
            </h3>
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          {/* Bill Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-blue-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-blue-600">Total da Fatura</p>
                  <p className="text-2xl font-bold text-blue-900">
                    {formatCurrency(bill.totalAmount)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center">
                <CreditCard className="h-8 w-8 text-purple-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-purple-600">Limite Disponível</p>
                  <p className="text-2xl font-bold text-purple-900">
                    {formatCurrency(bill.limit - bill.totalAmount)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-green-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-600">Vencimento</p>
                  <p className="text-2xl font-bold text-green-900">
                    {new Date(bill.dueDate).getDate()}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center">
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">Uso do Limite</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {bill.usagePercentage.toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Usage Progress */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Uso do Limite</span>
              <span>{bill.usagePercentage.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={cn(
                  "h-3 rounded-full transition-all",
                  bill.usagePercentage <= 50 
                    ? "bg-green-500"
                    : bill.usagePercentage <= 80
                    ? "bg-yellow-500"
                    : "bg-red-500"
                )}
                style={{ width: `${Math.min(bill.usagePercentage, 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>{formatCurrency(0)}</span>
              <span>{formatCurrency(bill.limit)}</span>
            </div>
          </div>

          {/* Transactions List */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-md font-medium text-gray-900">
                Transações ({bill.transactionCount})
              </h4>
              <button
                onClick={() => setIsTransactionModalOpen(true)}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <Plus className="-ml-1 mr-2 h-4 w-4" />
                Nova Transação
              </button>
            </div>
            <div className="space-y-3">
              {bill.transactions.map((transaction: any) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center">
                    <div
                      className="w-3 h-3 rounded-full mr-3"
                      style={{ backgroundColor: transaction.category.color }}
                    />
                    <div>
                      <p className="font-medium text-gray-900">
                        {transaction.description || transaction.category.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(transaction.date).toLocaleDateString('pt-BR')}
                        {transaction.installments > 1 && (
                          <span className="ml-2">
                            {transaction.currentInstallment}/{transaction.installments}x
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">
                      {formatCurrency(transaction.amount)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {bill.transactions.length === 0 && (
              <p className="text-center py-8 text-gray-500">
                Nenhuma transação neste período
              </p>
            )}
          </div>
        </div>
      )}

      {selectedCard && !bill && !billLoading && (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-500">
            Selecione um mês para ver a fatura
          </p>
        </div>
      )}

      {/* Credit Card Modal */}
      <CreditCardModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => setIsModalOpen(false)}
      />

      {/* Credit Card Transaction Modal */}
      {selectedCard && (
        <CreditCardTransactionModal
          isOpen={isTransactionModalOpen}
          onClose={() => setIsTransactionModalOpen(false)}
          onSuccess={() => setIsTransactionModalOpen(false)}
          cardId={selectedCard}
        />
      )}
    </div>
  );
};

export default CreditCardView;
