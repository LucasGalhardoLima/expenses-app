import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { X, Target } from 'lucide-react';
import { CreateBudgetDto, UpdateBudgetDto, BudgetType, Budget } from '../../types';
import { budgetApi } from '../../api';
import { cn } from '../../lib/utils';

interface BudgetFormData {
  amount: string;
  type: BudgetType;
}

interface BudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  month: string;
  existingBudget?: Budget | null;
}

const BudgetModal: React.FC<BudgetModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  month,
  existingBudget,
}) => {
  const queryClient = useQueryClient();
  const isEditing = !!existingBudget;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<BudgetFormData>();

  const selectedType = watch('type');

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (data: CreateBudgetDto) => budgetApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budget'] });
      onSuccess();
      reset();
    },
    onError: (error) => {
      console.error('Failed to create budget:', error);
      alert('Erro ao criar budget. Tente novamente.');
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: (data: UpdateBudgetDto) => budgetApi.update(month, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budget'] });
      onSuccess();
      reset();
    },
    onError: (error) => {
      console.error('Failed to update budget:', error);
      alert('Erro ao atualizar budget. Tente novamente.');
    },
  });

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      if (isEditing && existingBudget) {
        reset({
          amount: existingBudget.amount.toString(),
          type: existingBudget.type,
        });
      } else {
        reset({
          amount: '',
          type: BudgetType.FIXED_AMOUNT,
        });
      }
    }
  }, [isOpen, isEditing, existingBudget, reset, month]);

  const onSubmit = (data: BudgetFormData) => {
    const budgetData = {
      ...data,
      amount: parseFloat(data.amount),
      month,
    };
    if (isEditing) {
      updateMutation.mutate(budgetData);
    } else {
      createMutation.mutate(budgetData as CreateBudgetDto);
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

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
            <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
              <Target className="h-6 w-6 text-green-600" aria-hidden="true" />
            </div>
            <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
              <h3 className="text-lg font-semibold leading-6 text-gray-900 mb-4">
                {isEditing ? 'Editar Budget' : 'Definir Budget'}
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Mês: {new Date(month + '-01').toLocaleDateString('pt-BR', { 
                  month: 'long', 
                  year: 'numeric' 
                })}
              </p>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Tipo */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Budget
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        {...register('type', { required: 'Tipo é obrigatório' })}
                        value={BudgetType.FIXED_AMOUNT}
                        className="mr-3 text-green-600 focus:ring-green-500"
                      />
                      <div>
                        <span className="text-sm font-medium">Valor Fixo</span>
                        <p className="text-xs text-gray-500">Defina um valor específico para o mês</p>
                      </div>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        {...register('type', { required: 'Tipo é obrigatório' })}
                        value={BudgetType.INCOME_BASED}
                        className="mr-3 text-green-600 focus:ring-green-500"
                      />
                      <div>
                        <span className="text-sm font-medium">Baseado na Receita</span>
                        <p className="text-xs text-gray-500">Use a receita do mês como limite</p>
                      </div>
                    </label>
                  </div>
                  {errors.type && (
                    <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
                  )}
                </div>

                {/* Valor (apenas para FIXED_AMOUNT) */}
                {selectedType === BudgetType.FIXED_AMOUNT && (
                  <div>
                    <label
                      htmlFor="amount"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Valor do Budget
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      {...register('amount', { 
                        required: 'Valor é obrigatório',
                        min: { value: 0.01, message: 'Valor deve ser maior que 0' }
                      })}
                      className={cn(
                        "block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm",
                        errors.amount && "border-red-300 focus:border-red-500 focus:ring-red-500"
                      )}
                      placeholder="0,00"
                    />
                    {errors.amount && (
                      <p className="mt-1 text-sm text-red-600">{errors.amount.message}</p>
                    )}
                  </div>
                )}

                {/* Botões */}
                <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={cn(
                      "inline-flex w-full justify-center rounded-md border border-transparent px-4 py-2 text-base font-medium text-white shadow-sm sm:col-start-2 sm:text-sm",
                      "bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2",
                      isLoading && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    {isLoading
                      ? 'Salvando...'
                      : isEditing
                      ? 'Atualizar'
                      : 'Criar'}
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

export default BudgetModal;
