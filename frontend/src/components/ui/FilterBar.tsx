import React from 'react';
import { Listbox } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/24/outline';
import { QueryTransactionDto, Category, TransactionType } from '../../types';

interface FilterBarProps {
  filters: QueryTransactionDto;
  onFilterChange: (filters: Partial<QueryTransactionDto>) => void;
  categories: Category[];
  monthOptions: Array<{ label: string; value: string }>;
}

const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFilterChange,
  categories,
  monthOptions,
}) => {
  const typeOptions = [
    { label: 'Todos os Tipos', value: '' },
    { label: 'Receita', value: TransactionType.INCOME },
    { label: 'Despesa', value: TransactionType.EXPENSE },
  ];

  const categoryOptions = [
    { label: 'Todas as Categorias', value: '' },
    ...categories.map(cat => ({ label: cat.name, value: cat.id })),
  ];

  const selectedMonth = monthOptions.find(opt => opt.value === filters.month) || monthOptions[0];
  const selectedType = typeOptions.find(opt => opt.value === (filters.type || '')) || typeOptions[0];
  const selectedCategory = categoryOptions.find(opt => opt.value === (filters.categoryId || '')) || categoryOptions[0];

  return (
    <div className="glass-effect rounded-2xl p-4 relative z-50">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Month Filter */}
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mês
          </label>
          <Listbox
            value={selectedMonth}
            onChange={(option) => onFilterChange({ month: option.value })}
          >
            <div className="relative">
              <Listbox.Button className="relative w-full cursor-pointer rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <span className="block truncate">{selectedMonth.label}</span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <ChevronUpDownIcon className="h-5 w-5 text-gray-400" />
                </span>
              </Listbox.Button>
              <Listbox.Options className="absolute z-[9999] mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                {monthOptions.map((option) => (
                  <Listbox.Option
                    key={option.value}
                    value={option}
                    className={({ active, selected }) =>
                      `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                        active ? 'bg-blue-100 text-blue-900' : 'text-gray-900'
                      }`
                    }
                  >
                    {({ selected }) => (
                      <>
                        <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                          {option.label}
                        </span>
                        {selected ? (
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                            <CheckIcon className="h-5 w-5" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </div>
          </Listbox>
        </div>

        {/* Type Filter */}
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tipo
          </label>
          <Listbox
            value={selectedType}
            onChange={(option) => onFilterChange({ type: option.value ? option.value as TransactionType : undefined })}
          >
            <div className="relative">
              <Listbox.Button className="relative w-full cursor-pointer rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <span className="block truncate">{selectedType.label}</span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <ChevronUpDownIcon className="h-5 w-5 text-gray-400" />
                </span>
              </Listbox.Button>
              <Listbox.Options className="absolute z-[9999] mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                {typeOptions.map((option) => (
                  <Listbox.Option
                    key={option.value}
                    value={option}
                    className={({ active, selected }) =>
                      `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                        active ? 'bg-blue-100 text-blue-900' : 'text-gray-900'
                      }`
                    }
                  >
                    {({ selected }) => (
                      <>
                        <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                          {option.label}
                        </span>
                        {selected ? (
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                            <CheckIcon className="h-5 w-5" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </div>
          </Listbox>
        </div>

        {/* Category Filter */}
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Categoria
          </label>
          <Listbox
            value={selectedCategory}
            onChange={(option) => onFilterChange({ categoryId: option.value || undefined })}
          >
            <div className="relative">
              <Listbox.Button className="relative w-full cursor-pointer rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <span className="block truncate">{selectedCategory.label}</span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <ChevronUpDownIcon className="h-5 w-5 text-gray-400" />
                </span>
              </Listbox.Button>
              <Listbox.Options className="absolute z-[9999] mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                {categoryOptions.map((option) => (
                  <Listbox.Option
                    key={option.value}
                    value={option}
                    className={({ active, selected }) =>
                      `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                        active ? 'bg-blue-100 text-blue-900' : 'text-gray-900'
                      }`
                    }
                  >
                    {({ selected }) => (
                      <>
                        <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                          {option.label}
                        </span>
                        {selected ? (
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                            <CheckIcon className="h-5 w-5" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </div>
          </Listbox>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
