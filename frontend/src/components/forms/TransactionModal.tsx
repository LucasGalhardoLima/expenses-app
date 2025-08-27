import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { X } from 'lucide-react';
import { transactionApi } from '../../api';
import { Category, CreateTransactionDto, TransactionType } from '../../types';
import { format } from 'date-fns';
import { cn } from '../../lib/utils';
import CurrencyInput from '../ui/CurrencyInput';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  categories: Category[];
  transactionId?: string | null;
}

interface TransactionFormData {
  date: string;
  type: TransactionType;
  amount: string;
  description?: string;
  categoryId: string;
}

const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  categories,
  transactionId,
}) => {
  const isEditing = !!transactionId;
  const queryClient = useQueryClient();
  
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors }
  } = useForm<TransactionFormData>({
    mode: 'onChange',
    defaultValues: {
      date: format(new Date(), 'yyyy-MM-dd'),
      type: TransactionType.EXPENSE,
      amount: '',
      description: '',
      categoryId: '',
    }
  });

  // Register amount field with validation
  register('amount', { 
    required: 'Valor é obrigatório',
    validate: (value) => {
      const numValue = parseFloat(value);
      if (isNaN(numValue) || numValue <= 0) {
        return 'Valor deve ser maior que 0';
      }
      return true;
    }
  });

  const watchedType = watch('type');

  // Fetch transaction for editing
  const { data: transaction } = useQuery({
    queryKey: ['transaction', transactionId],
    queryFn: () => transactionApi.getById(transactionId!),
    enabled: isEditing && !!transactionId,
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: transactionApi.create,
    onSuccess: () => {
      // Invalidate and refetch relevant queries
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['transactions', 'summary'] });
      reset();
      onSuccess();
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: CreateTransactionDto }) =>
      transactionApi.update(id, data),
    onSuccess: () => {
      // Invalidate and refetch relevant queries
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['transactions', 'summary'] });
      reset();
      onSuccess();
    },
  });

  // Reset form when modal opens/closes or transaction data changes
  useEffect(() => {
    if (isOpen && !isEditing) {
      reset({
        date: format(new Date(), 'yyyy-MM-dd'),
        type: TransactionType.EXPENSE,
        amount: '',
        description: '',
        categoryId: '',
      });
    }
  }, [isOpen, isEditing, reset]);

  useEffect(() => {
    if (transaction && isEditing) {
      reset({
        date: format(new Date(transaction.date), 'yyyy-MM-dd'),
        amount: transaction.amount.toString(),
        type: transaction.type,
        description: transaction.description || '',
        categoryId: transaction.categoryId,
      });
    }
  }, [transaction, isEditing, reset]);

  const onSubmit = async (data: TransactionFormData) => {
    try {
      // Converter o valor para decimal com 2 casas decimais e garantir formato string
      const formattedAmount = parseFloat(data.amount).toFixed(2);
      
      const transactionData: CreateTransactionDto = {
        ...data,
        amount: formattedAmount, // Envia como string com 2 casas decimais
      };

      if (isEditing && transactionId) {
        await updateMutation.mutateAsync({ id: transactionId, data: transactionData });
      } else {
        await createMutation.mutateAsync(transactionData);
      }
    } catch (error) {
      console.error('Failed to save transaction:', error);
    }
  };

  // Filter categories by transaction type
  const filteredCategories = categories.filter(cat => cat.type === watchedType);

  const isLoading = createMutation.isPending || updateMutation.isPending;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Mobile: Full screen modal on small screens */}
      <div className="flex min-h-screen items-end sm:items-center justify-center sm:p-4 text-center">
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        />

        <div className="relative transform overflow-hidden rounded-t-2xl sm:rounded-lg bg-white w-full sm:w-full sm:max-w-lg text-left shadow-xl transition-all sm:my-8">
          {/* Mobile: Handle bar */}
          <div className="sm:hidden w-12 h-1 bg-gray-300 rounded-full mx-auto mt-3"></div>
          
          {/* Header */}
          <div className="px-4 pt-5 pb-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {isEditing ? 'Editar Transação' : 'Nova Transação'}
              </h3>
              <button
                type="button"
                className="nav-item text-gray-400 hover:text-gray-500"
                onClick={onClose}
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Tipo */}
              <div>
                <label className="form-label">
                  Tipo
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label className="flex items-center justify-center p-3 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50">
                    <input
                      type="radio"
                      {...register('type')}
                      value={TransactionType.EXPENSE}
                      className="sr-only"
                    />
                    <span className={cn(
                      "text-sm font-medium",
                      watchedType === TransactionType.EXPENSE 
                        ? "text-red-600" 
                        : "text-gray-500"
                    )}>
                      💸 Despesa
                    </span>
                  </label>
                  <label className="flex items-center justify-center p-3 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50">
                    <input
                      type="radio"
                      {...register('type')}
                      value={TransactionType.INCOME}
                      className="sr-only"
                    />
                    <span className={cn(
                      "text-sm font-medium",
                      watchedType === TransactionType.INCOME 
                        ? "text-green-600" 
                        : "text-gray-500"
                    )}>
                      💰 Receita
                    </span>
                  </label>
                </div>
              </div>

              {/* Valor */}
              <div>
                <label className="form-label">
                  Valor
                </label>
                <CurrencyInput
                  value={watch('amount') || ''}
                  onChange={(value) => setValue('amount', value, { shouldValidate: true })}
                  error={!!errors.amount}
                  placeholder="0,00"
                />
                {errors.amount && (
                  <p className="mt-1 text-sm text-red-600">{errors.amount.message}</p>
                )}
              </div>

              {/* Categoria */}
              <div>
                <label className="form-label">
                  Categoria
                </label>
                <select
                  {...register('categoryId', { required: 'Categoria é obrigatória' })}
                  className={cn(
                    "form-input",
                    errors.categoryId && "border-red-300 focus:border-red-500 focus:ring-red-500"
                  )}
                >
                  <option value="">Selecione uma categoria</option>
                  {filteredCategories.map((category) => (
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
                <label className="form-label">
                  Data
                </label>
                <input
                  type="date"
                  {...register('date', { required: 'Data é obrigatória' })}
                  className={cn(
                    "form-input",
                    errors.date && "border-red-300 focus:border-red-500 focus:ring-red-500"
                  )}
                />
                {errors.date && (
                  <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>
                )}
              </div>

              {/* Descrição */}
              <div>
                <label className="form-label">
                  Descrição (opcional)
                </label>
                <input
                  type="text"
                  {...register('description')}
                  className="form-input"
                  placeholder="Adicione uma descrição..."
                />
              </div>

              {/* Buttons - Mobile optimized */}
              <div className="pt-4 space-y-3 sm:space-y-0 sm:flex sm:flex-row-reverse sm:space-x-3 sm:space-x-reverse">
                <button
                  type="submit"
                  disabled={isLoading}
                  className={cn(
                    "btn-primary w-full sm:w-auto",
                    isLoading && "opacity-50 cursor-not-allowed"
                  )}
                >
                  {isLoading 
                    ? 'Salvando...' 
                    : isEditing 
                      ? 'Atualizar' 
                      : 'Adicionar'
                  }
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="btn-secondary w-full sm:w-auto"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionModal;
