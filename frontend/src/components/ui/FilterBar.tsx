import React, { useState } from 'react';
import { Filter, X, ChevronDown, ChevronUp } from 'lucide-react';
import { TransactionType } from '../../types';
import { cn } from '../../lib/utils';

interface FilterBarProps {
  selectedMonth?: string;
  onMonthChange: (month: string) => void;
  selectedType?: TransactionType | 'all';
  onTypeChange: (type: TransactionType | 'all') => void;
  selectedCategory?: string;
  onCategoryChange: (category: string) => void;
  months: Array<{ value: string; label: string }>;
  categories: Array<{ id: string; name: string }>;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
}

const FilterBar: React.FC<FilterBarProps> = ({
  selectedMonth,
  onMonthChange,
  selectedType,
  onTypeChange,
  selectedCategory,
  onCategoryChange,
  months,
  categories,
  hasActiveFilters,
  onClearFilters,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
      {/* Mobile: Collapsible header */}
      <div className="sm:hidden">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50"
        >
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-500" />
            <span className="font-medium text-gray-900">Filtros</span>
            {hasActiveFilters && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Ativo
              </span>
            )}
          </div>
          {isExpanded ? (
            <ChevronUp className="h-5 w-5 text-gray-500" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-500" />
          )}
        </button>
      </div>

      {/* Filter content */}
      {/* Desktop: Always visible */}
      <div className="hidden sm:block sm:p-4">
        <div className="flex items-end space-x-4">
          {/* Mês */}
          <div className="flex-1 min-w-0">
            <label className="form-label">
              Mês
            </label>
            <select
              value={selectedMonth || ''}
              onChange={(e) => onMonthChange(e.target.value)}
              className="form-input w-full"
            >
              <option value="">Todos os meses</option>
              {months.map((month) => (
                <option key={month.value} value={month.value}>
                  {month.label}
                </option>
              ))}
            </select>
          </div>

          {/* Tipo */}
          <div className="flex-1 min-w-0">
            <label className="form-label">
              Tipo
            </label>
            <select
              value={selectedType || 'all'}
              onChange={(e) => onTypeChange(e.target.value as TransactionType | 'all')}
              className="form-input w-full"
            >
              <option value="all">Todos os tipos</option>
              <option value={TransactionType.EXPENSE}>Despesas</option>
              <option value={TransactionType.INCOME}>Receitas</option>
            </select>
          </div>

          {/* Categoria */}
          <div className="flex-1 min-w-0">
            <label className="form-label">#
              Categoria
            </label>
            <select
              value={selectedCategory || ''}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="form-input w-full"
            >
              <option value="">Todas as categorias</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Clear filters */}
          {hasActiveFilters && (
            <div className="flex-shrink-0">
              <button
                onClick={onClearFilters}
                className="flex items-center justify-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors h-[42px]"
              >
                <X className="h-4 w-4" />
                <span>Limpar</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile: Collapsible */}
      <div className={cn(
        "sm:hidden transition-all duration-300 ease-in-out overflow-hidden",
        isExpanded ? "block max-h-96" : "hidden max-h-0"
      )}>
        <div className="space-y-4 p-4">
          {/* Mês */}
          <div>
            <label className="form-label">
              Mês
            </label>
            <select
              value={selectedMonth || ''}
              onChange={(e) => onMonthChange(e.target.value)}
              className="form-input w-full"
            >
              <option value="">Todos os meses</option>
              {months.map((month) => (
                <option key={month.value} value={month.value}>
                  {month.label}
                </option>
              ))}
            </select>
          </div>

          {/* Tipo */}
          <div>
            <label className="form-label">
              Tipo
            </label>
            <select
              value={selectedType || 'all'}
              onChange={(e) => onTypeChange(e.target.value as TransactionType | 'all')}
              className="form-input w-full"
            >
              <option value="all">Todos os tipos</option>
              <option value={TransactionType.EXPENSE}>Despesas</option>
              <option value={TransactionType.INCOME}>Receitas</option>
            </select>
          </div>

          {/* Categoria */}
          <div>
            <label className="form-label">
              Categoria
            </label>
            <select
              value={selectedCategory || ''}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="form-input w-full"
            >
              <option value="">Todas as categorias</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Clear filters */}
          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              className="flex items-center justify-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors w-full"
            >
              <X className="h-4 w-4" />
              <span>Limpar</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
