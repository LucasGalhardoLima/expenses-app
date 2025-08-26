import React, { forwardRef, InputHTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

interface CurrencyInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange' | 'value'> {
  value: string;
  onChange: (value: string) => void;
  error?: boolean;
}

const CurrencyInput = forwardRef<HTMLInputElement, CurrencyInputProps>(
  ({ value, onChange, error, className, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;
      
      // Remove tudo que não é dígito ou vírgula/ponto
      let numericValue = inputValue.replace(/[^\d,]/g, '');
      
      // Se há vírgula, substitui por ponto para formato decimal
      numericValue = numericValue.replace(',', '.');
      
      // Limita a duas casas decimais
      const parts = numericValue.split('.');
      if (parts.length > 2) {
        numericValue = parts[0] + '.' + parts.slice(1).join('');
      }
      if (parts[1] && parts[1].length > 2) {
        numericValue = parts[0] + '.' + parts[1].substring(0, 2);
      }
      
      onChange(numericValue);
    };

    // Formato para exibição
    const displayValue = value ? `R$ ${value.replace('.', ',')}` : '';

    return (
      <input
        ref={ref}
        type="text"
        inputMode="numeric"
        value={displayValue}
        onChange={handleChange}
        className={cn(
          "block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm",
          error && "border-red-300 focus:border-red-500 focus:ring-red-500",
          className
        )}
        {...props}
      />
    );
  }
);

CurrencyInput.displayName = 'CurrencyInput';

export default CurrencyInput;
