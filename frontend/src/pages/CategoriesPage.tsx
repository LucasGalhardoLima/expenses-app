import React, { useState } from 'react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { Plus, Edit, Trash2, Tag } from 'lucide-react';
import { categoryApi } from '../api';
import { TransactionType, Category } from '../types';
import CategoryModal from '../components/forms/CategoryModal';
import { cn } from '../lib/utils';

const CategoriesPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [filter, setFilter] = useState<TransactionType | 'ALL'>('ALL');

  // Fetch categories
  const {
    data: categories = [],
    isLoading,
  } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryApi.getAll(),
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (categoryId: string) => categoryApi.delete(categoryId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
    onError: (error) => {
      console.error('Failed to delete category:', error);
      alert('Erro ao excluir categoria. Verifique se não há transações associadas.');
    },
  });

  const handleCategorySuccess = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  const handleEdit = (categoryId: string) => {
    setEditingCategory(categoryId);
    setIsModalOpen(true);
  };

  const handleDelete = async (categoryId: string, categoryName: string) => {
    if (!window.confirm(`Tem certeza que deseja excluir a categoria "${categoryName}"?`)) {
      return;
    }

    deleteMutation.mutate(categoryId);
  };

  const handleNewCategory = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  // Filter categories based on type
  const filteredCategories = categories.filter(category => 
    filter === 'ALL' || category.type === filter
  );

  const getTypeLabel = (type: TransactionType) => {
    return type === TransactionType.INCOME ? 'Receita' : 'Despesa';
  };

  const getTypeColor = (type: TransactionType) => {
    return type === TransactionType.INCOME 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Categorias</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gerencie as categorias das suas transações
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            type="button"
            onClick={handleNewCategory}
            className={cn(
              "inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white",
              "bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            )}
          >
            <Plus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            Nova Categoria
          </button>
        </div>
      </div>

      {/* Filter */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Filtros</h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('ALL')}
            className={cn(
              "px-3 py-1 rounded-full text-sm font-medium transition-colors",
              filter === 'ALL'
                ? "bg-indigo-100 text-indigo-800"
                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
            )}
          >
            Todas
          </button>
          <button
            onClick={() => setFilter(TransactionType.EXPENSE)}
            className={cn(
              "px-3 py-1 rounded-full text-sm font-medium transition-colors",
              filter === TransactionType.EXPENSE
                ? "bg-red-100 text-red-800"
                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
            )}
          >
            Despesas
          </button>
          <button
            onClick={() => setFilter(TransactionType.INCOME)}
            className={cn(
              "px-3 py-1 rounded-full text-sm font-medium transition-colors",
              filter === TransactionType.INCOME
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
            )}
          >
            Receitas
          </button>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Lista de Categorias
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            {filteredCategories.length > 0 
              ? `${filteredCategories.length} categoria(s) encontrada(s)`
              : 'Nenhuma categoria encontrada'
            }
          </p>
        </div>

        {isLoading ? (
          <div className="border-t border-gray-200 px-4 py-8">
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="border-t border-gray-200 px-4 py-8 text-center">
            <Tag className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Nenhuma categoria
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Comece criando uma nova categoria.
            </p>
            <div className="mt-6">
              <button
                type="button"
                onClick={handleNewCategory}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <Plus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                Nova Categoria
              </button>
            </div>
          </div>
        ) : (
          <div className="border-t border-gray-200">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 p-6">
              {filteredCategories.map((category: Category) => (
                <div
                  key={category.id}
                  className="relative bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: category.color }}
                      />
                      <h4 className="text-lg font-medium text-gray-900">
                        {category.name}
                      </h4>
                    </div>
                    <span
                      className={cn(
                        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                        getTypeColor(category.type)
                      )}
                    >
                      {getTypeLabel(category.type)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500">
                      {category.transactions?.length || 0} transações
                    </p>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(category.id)}
                        className="p-2 text-gray-400 hover:text-indigo-600 transition-colors"
                        title="Editar categoria"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(category.id, category.name)}
                        disabled={deleteMutation.isPending}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50"
                        title="Excluir categoria"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Category Modal */}
      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingCategory(null);
        }}
        onSuccess={handleCategorySuccess}
        categoryId={editingCategory}
      />
    </div>
  );
};

export default CategoriesPage;
