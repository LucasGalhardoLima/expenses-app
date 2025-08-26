import React from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { X } from 'lucide-react';
import { creditCardApi } from '../../api';
import { CreateCreditCardDto } from '../../types';
import { cn } from '../../lib/utils';
import CurrencyInput from '../ui/CurrencyInput';

interface CreditCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface CreditCardFormData {
  name: string;
  limit: string;
  closingDay: string;
  dueDay: string;
  color: string;
}

const CreditCardModal: React.FC<CreditCardModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const queryClient = useQueryClient();
  
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors }
  } = useForm<CreditCardFormData>({
    mode: 'onChange',
    defaultValues: {
      name: '',
      limit: '',
      closingDay: '1',
      dueDay: '10',
      color: '#3B82F6',
    }
  });

  // Register limit field with validation
  register('limit', { 
    required: 'Limite é obrigatório',
    validate: (value) => {
      const numValue = parseFloat(value);
      if (isNaN(numValue) || numValue <= 0) {
        return 'Limite deve ser maior que 0';
      }
      return true;
    }
  });

  const createMutation = useMutation({
    mutationFn: creditCardApi.createCard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['credit-cards'] });
      reset();
      onSuccess();
    },
  });

  const onSubmit = async (data: CreditCardFormData) => {
    try {
      const cardData: CreateCreditCardDto = {
        name: data.name,
        limit: parseFloat(data.limit),
        closingDay: parseInt(data.closingDay),
        dueDay: parseInt(data.dueDay),
        color: data.color,
      };

      await createMutation.mutateAsync(cardData);
    } catch (error) {
      console.error('Failed to create credit card:', error);
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
                Novo Cartão de Crédito
              </h3>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Nome do Cartão */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Nome do Cartão
                  </label>
                  <input
                    type="text"
                    {...register('name', { 
                      required: 'Nome do cartão é obrigatório',
                      minLength: { value: 2, message: 'Nome deve ter pelo menos 2 caracteres' }
                    })}
                    className={cn(
                      "block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm",
                      errors.name && "border-red-300 focus:border-red-500 focus:ring-red-500"
                    )}
                    placeholder="Ex: Nubank, Itaú, XP..."
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                  )}
                </div>

                {/* Limite */}
                <div>
                  <label
                    htmlFor="limit"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Limite
                  </label>
                  <CurrencyInput
                    value={watch('limit') || ''}
                    onChange={(value) => setValue('limit', value, { shouldValidate: true })}
                    error={!!errors.limit}
                    placeholder="0,00"
                  />
                  {errors.limit && (
                    <p className="mt-1 text-sm text-red-600">{errors.limit.message}</p>
                  )}
                </div>

                {/* Dia do Fechamento */}
                <div>
                  <label
                    htmlFor="closingDay"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Dia do Fechamento
                  </label>
                  <select
                    {...register('closingDay', { required: 'Dia do fechamento é obrigatório' })}
                    className={cn(
                      "block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm",
                      errors.closingDay && "border-red-300 focus:border-red-500 focus:ring-red-500"
                    )}
                  >
                    {Array.from({ length: 28 }, (_, i) => i + 1).map((day) => (
                      <option key={day} value={day}>
                        Dia {day}
                      </option>
                    ))}
                  </select>
                  {errors.closingDay && (
                    <p className="mt-1 text-sm text-red-600">{errors.closingDay.message}</p>
                  )}
                </div>

                {/* Dia do Vencimento */}
                <div>
                  <label
                    htmlFor="dueDay"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Dia do Vencimento
                  </label>
                  <select
                    {...register('dueDay', { required: 'Dia do vencimento é obrigatório' })}
                    className={cn(
                      "block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm",
                      errors.dueDay && "border-red-300 focus:border-red-500 focus:ring-red-500"
                    )}
                  >
                    {Array.from({ length: 28 }, (_, i) => i + 1).map((day) => (
                      <option key={day} value={day}>
                        Dia {day}
                      </option>
                    ))}
                  </select>
                  {errors.dueDay && (
                    <p className="mt-1 text-sm text-red-600">{errors.dueDay.message}</p>
                  )}
                </div>

                {/* Cor */}
                <div>
                  <label
                    htmlFor="color"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Cor do Cartão
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      {...register('color')}
                      className="h-10 w-16 rounded border border-gray-300 cursor-pointer"
                    />
                    <div className="flex space-x-2">
                      {['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899'].map((color) => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => {
                            const colorInput = document.querySelector('input[type="color"]') as HTMLInputElement;
                            if (colorInput) {
                              colorInput.value = color;
                              colorInput.dispatchEvent(new Event('input', { bubbles: true }));
                            }
                          }}
                          className="w-8 h-8 rounded-full border-2 border-gray-300 hover:border-gray-400"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
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
                    {isLoading ? 'Criando...' : 'Criar Cartão'}
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

export default CreditCardModal;
