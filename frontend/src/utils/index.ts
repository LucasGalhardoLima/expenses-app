import { format, startOfMonth, endOfMonth, isToday, isYesterday } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Format currency
export const formatCurrency = (amount: number, currency = 'BRL'): string => {
  // Verificar se o valor é válido
  if (amount === null || amount === undefined || isNaN(amount)) {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency,
    }).format(0);
  }

  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency,
  }).format(amount);
};

// Format date
export const formatDate = (date: string | Date, formatString = 'dd MMM yyyy'): string => {
  return format(new Date(date), formatString, { locale: ptBR });
};

// Get relative date
export const getRelativeDate = (date: string | Date): string => {
  const dateObj = new Date(date);
  
  if (isToday(dateObj)) {
    return 'Hoje';
  }
  
  if (isYesterday(dateObj)) {
    return 'Ontem';
  }
  
  return formatDate(date);
};

// Get current month bounds
export const getCurrentMonthBounds = () => {
  const now = new Date();
  return {
    start: startOfMonth(now),
    end: endOfMonth(now),
  };
};

// Get month string for API
export const getMonthString = (date: Date): string => {
  return format(date, 'yyyy-MM');
};

// Generate month options for filters
export const generateMonthOptions = (count = 12): Array<{ label: string; value: string }> => {
  const options = [];
  const now = new Date();
  
  for (let i = 0; i < count; i++) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    options.push({
      label: format(date, 'MMMM yyyy', { locale: ptBR }),
      value: getMonthString(date),
    });
  }
  
  return options;
};

// Color utilities
export const getContrastColor = (backgroundColor: string): string => {
  // Remove # if present
  const hex = backgroundColor.replace('#', '');
  
  // Convert to RGB
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  
  // Calculate relative luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  return luminance > 0.5 ? '#000000' : '#FFFFFF';
};

// Debounce function
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): T => {
  let timeout: NodeJS.Timeout;
  return ((...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  }) as T;
};
