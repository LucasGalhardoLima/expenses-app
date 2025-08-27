import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { X } from 'lucide-react';
import { categoryApi } from '../../api';
import { CreateCategoryDto, UpdateCategoryDto, TransactionType } from '../../types';
import { cn } from '../../lib/utils';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  categoryId?: string | null;
}

const colors = [
  '#ef4444', '#f97316', '#f59e0b', '#eab308', 
  '#84cc16', '#22c55e', '#10b981', '#14b8a6',
  '#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1',
  '#8b5cf6', '#a855f7', '#d946ef', '#ec4899',
  '#f43f5e', '#64748b', '#6b7280', '#374151'
];

const CategoryModal: React.FC<CategoryModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  categoryId,
}) => {
  const queryClient = useQueryClient();
  const isEditing = !!categoryId;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<CreateCategoryDto | UpdateCategoryDto>();

  const selectedColor = watch('color');

  // Fetch category data for editing
  const { data: category } = useQuery({
    queryKey: ['categories', categoryId],
    queryFn: () => categoryApi.getById(categoryId!),
    enabled: isEditing,
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (data: CreateCategoryDto) => categoryApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      onSuccess();
      reset();
    },
    onError: (error) => {
      console.error('Failed to create category:', error);
      alert('Erro ao criar categoria. Tente novamente.');
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: (data: UpdateCategoryDto) => categoryApi.update(categoryId!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      onSuccess();
      reset();
    },
    onError: (error) => {
      console.error('Failed to update category:', error);
      alert('Erro ao atualizar categoria. Tente novamente.');
    },
  });

  // Reset form when modal opens/closes or when editing a different category
  useEffect(() => {
    if (isOpen) {
      if (isEditing && category) {
        setValue('name', category.name);
        setValue('color', category.color);
        setValue('type', category.type);
      } else {
        reset({
          name: '',
          color: colors[0],
          type: TransactionType.EXPENSE,
        });
      }
    }
  }, [isOpen, isEditing, category, reset, setValue]);

  const onSubmit = (data: CreateCategoryDto | UpdateCategoryDto) => {
    if (isEditing) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data as CreateCategoryDto);
    }
  };

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
                {isEditing ? 'Editar Categoria' : 'Nova Categoria'}
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
              {/* Nome */}
              <div>
                <label className="form-label">
                  Nome
                </label>
                <input
                  {...register('name', { required: 'Nome é obrigatório' })}
                  type="text"
                  className={cn(
                    "form-input",
                    errors.name && "border-red-300 focus:border-red-500 focus:ring-red-500"
                  )}
                  placeholder="Ex: Alimentação, Transporte..."
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

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
                      watch('type') === TransactionType.EXPENSE 
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
                      watch('type') === TransactionType.INCOME 
                        ? "text-green-600" 
                        : "text-gray-500"
                    )}>
                      💰 Receita
                    </span>
                  </label>
                </div>
              </div>

              {/* Cor */}
              <div>
                <label className="form-label">
                  Cor
                </label>
                <div className="grid grid-cols-8 sm:grid-cols-10 gap-2">
                  {colors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setValue('color', color)}
                      className={cn(
                        "w-10 h-10 sm:w-8 sm:h-8 rounded-full border-2 transition-all touch-manipulation",
                        selectedColor === color
                          ? "border-gray-900 scale-110"
                          : "border-gray-300 hover:border-gray-400"
                      )}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <input
                  {...register('color', { required: 'Cor é obrigatória' })}
                  type="hidden"
                />
                {errors.color && (
                  <p className="mt-1 text-sm text-red-600">{errors.color.message}</p>
                )}
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
                    : 'Criar'}
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

export default CategoryModal;
