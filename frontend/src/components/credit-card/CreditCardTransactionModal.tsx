import React from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { X } from 'lucide-react';
import { creditCardApi } from '../../api';
import { CreateCreditCardTransactionDto } from '../../types';
import { format } from 'date-fns';
import { cn } from '../../lib/utils';

interface CreditCardTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  cardId: string;
}

interface TransactionFormData {
  date: string;
  amount: string;
  description?: string;
  categoryId: string;
  installments: string;
  currentInstallment: string;
}

const CreditCardTransactionModal: React.FC<CreditCardTransactionModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  cardId,
}) => {
  const queryClient = useQueryClient();
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<TransactionFormData>({
    defaultValues: {
      date: format(new Date(), 'yyyy-MM-dd'),
      amount: '',
      description: '',
      categoryId: '',
      installments: '1',
      currentInstallment: '1',
    }
  });

  // Fetch credit card categories
  const { data: categories = [] } = useQuery({
    queryKey: ['credit-card-categories'],
    queryFn: creditCardApi.getAllCategories,
  });

  const createMutation = useMutation({
    mutationFn: creditCardApi.createTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['credit-card-bill'] });
      queryClient.invalidateQueries({ queryKey: ['credit-cards'] });
      reset();
      onSuccess();
    },
  });

  const onSubmit = async (data: TransactionFormData) => {
    try {
      const transactionData: CreateCreditCardTransactionDto = {
        date: data.date,
        amount: parseFloat(data.amount),
        description: data.description,
        categoryId: data.categoryId,
        cardId,
        installments: parseInt(data.installments),
        currentInstallment: parseInt(data.currentInstallment),
      };

      await createMutation.mutateAsync(transactionData);
    } catch (error) {
      console.error('Failed to create credit card transaction:', error);
    }
  };

  const isLoading = createMutation.isPending;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4 text-center sm:p-0">
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        />

        <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
          <div className="absolute right-0 top-0 pr-4 pt-4">
            <button
              type="button"
              className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              onClick={onClose}
            >
              <span className="sr-only">Fechar</span>
              <X className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          <div className="sm:flex sm:items-start">
            <div className="mt-3 text-center sm:ml-0 sm:mt-0 sm:text-left w-full">
              <h3 className="text-lg font-semibold leading-6 text-gray-900 mb-4">
                Nova Transação do Cartão
              </h3>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Valor */}
                <div>
                  <label
                    htmlFor="amount"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Valor
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    {...register('amount', { 
                      required: 'Valor é obrigatório',
                      min: { value: 0.01, message: 'Valor deve ser maior que 0' }
                    })}
                    className={cn(
                      "block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm",
                      errors.amount && "border-red-300 focus:border-red-500 focus:ring-red-500"
                    )}
                    placeholder="0,00"
                  />
                  {errors.amount && (
                    <p className="mt-1 text-sm text-red-600">{errors.amount.message}</p>
                  )}
                </div>

                {/* Categoria */}
                <div>
                  <label
                    htmlFor="categoryId"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Categoria
                  </label>
                  <select
                    {...register('categoryId', { required: 'Categoria é obrigatória' })}
                    className={cn(
                      "block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm",
                      errors.categoryId && "border-red-300 focus:border-red-500 focus:ring-red-500"
                    )}
                  >
                    <option value="">Selecione uma categoria</option>
                    {categories.map((category: any) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  {errors.categoryId && (
                    <p className="mt-1 text-sm text-red-600">{errors.categoryId.message}</p>
                  )}
                </div>

                {/* Data */}
                <div>
                  <label
                    htmlFor="date"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Data
                  </label>
                  <input
                    type="date"
                    {...register('date', { required: 'Data é obrigatória' })}
                    className={cn(
                      "block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm",
                      errors.date && "border-red-300 focus:border-red-500 focus:ring-red-500"
                    )}
                  />
                  {errors.date && (
                    <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>
                  )}
                </div>

                {/* Descrição */}
                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Descrição (Opcional)
                  </label>
                  <input
                    type="text"
                    {...register('description')}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="Adicione uma descrição..."
                  />
                </div>

                {/* Parcelas */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="installments"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Total de Parcelas
                    </label>
                    <select
                      {...register('installments')}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                      {Array.from({ length: 24 }, (_, i) => i + 1).map((num) => (
                        <option key={num} value={num}>
                          {num}x
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="currentInstallment"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Parcela Atual
                    </label>
                    <select
                      {...register('currentInstallment')}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                      {Array.from({ length: 24 }, (_, i) => i + 1).map((num) => (
                        <option key={num} value={num}>
                          {num}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Botões */}
                <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={cn(
                      "inline-flex w-full justify-center rounded-md border border-transparent px-4 py-2 text-base font-medium text-white shadow-sm sm:col-start-2 sm:text-sm",
                      "bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2",
                      isLoading && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    {isLoading ? 'Criando...' : 'Criar Transação'}
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:col-start-1 sm:mt-0 sm:text-sm"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreditCardTransactionModal;
