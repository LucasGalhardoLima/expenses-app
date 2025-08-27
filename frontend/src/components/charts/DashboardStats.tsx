import React from 'react';
import { 
  ArrowTrendingUpIcon, 
  ArrowTrendingDownIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  MinusIcon
} from '@heroicons/react/24/outline';
import { formatCurrency } from '../../utils';

interface StatCardData {
  title: string;
  value: number;
  previousValue?: number;
  format?: 'currency' | 'number' | 'percentage';
  icon?: React.ComponentType<any>;
  trend?: 'up' | 'down' | 'neutral';
}

interface DashboardStatsProps {
  stats: StatCardData[];
  isLoading?: boolean;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ stats, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white border border-sky-blue/10 rounded-lg shadow-sm p-3 sm:p-4 animate-pulse">
            <div className="h-3 sm:h-4 bg-sky-blue/20 rounded w-1/2 mb-2"></div>
            <div className="h-6 sm:h-8 bg-sky-blue/20 rounded w-3/4 mb-2"></div>
            <div className="h-2 sm:h-3 bg-sky-blue/20 rounded w-1/3"></div>
          </div>
        ))}
      </div>
    );
  }

  const formatValue = (value: number, format: string = 'currency') => {
    // Verificar se value é válido
    if (value === null || value === undefined || isNaN(value)) {
      return format === 'currency' ? 'R$ 0,00' : '0';
    }

    switch (format) {
      case 'currency':
        return formatCurrency(value);
      case 'percentage':
        return `${value.toFixed(1)}%`;
      case 'number':
        return value.toLocaleString('pt-BR');
      default:
        return value.toString();
    }
  };

  const calculateVariation = (current: number, previous?: number) => {
    // Verificar se os valores são válidos
    if (current === null || current === undefined || isNaN(current)) return null;
    if (!previous || previous === 0 || isNaN(previous)) return null;
    
    const variation = ((current - previous) / previous) * 100;
    return {
      value: Math.abs(variation),
      isPositive: variation > 0,
      isNeutral: Math.abs(variation) < 0.1
    };
  };

  const getTrendIcon = (trend?: string) => {
    switch (trend) {
      case 'up':
        return ArrowTrendingUpIcon;
      case 'down':
        return ArrowTrendingDownIcon;
      default:
        return MinusIcon;
    }
  };

  const getVariationIcon = (isPositive: boolean, isNeutral: boolean) => {
    if (isNeutral) return MinusIcon;
    return isPositive ? ArrowUpIcon : ArrowDownIcon;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
      {stats.map((stat, index) => {
        const variation = calculateVariation(stat.value, stat.previousValue);
        const TrendIcon = getTrendIcon(stat.trend);
        const StatIcon = stat.icon;
        
        return (
          <div key={index} className="bg-white border border-sky-blue/10 rounded-lg shadow-sm hover:shadow-md hover:border-sky-blue/20 transition-all duration-200 p-3 sm:p-4">
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <div className="flex items-center min-w-0 flex-1">
                {StatIcon && (
                  <div className="p-1.5 sm:p-2 rounded-lg bg-sky-blue/5 mr-2 sm:mr-3 flex-shrink-0">
                    <StatIcon className="h-4 w-4 sm:h-5 sm:w-5 text-sky-blue" />
                  </div>
                )}
                <h3 className="text-xs sm:text-sm font-medium text-black/70 truncate">{stat.title}</h3>
              </div>
              
              {stat.trend && (
                <div className={`p-1 rounded-full flex-shrink-0 ${
                  stat.trend === 'up' 
                    ? 'bg-sky-blue/10 text-sky-blue' 
                    : stat.trend === 'down'
                      ? 'bg-vista-blue/10 text-vista-blue'
                      : 'bg-black/5 text-black/50'
                }`}>
                  <TrendIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                </div>
              )}
            </div>
            
            <div className="mb-1 sm:mb-2">
              <div className="text-lg sm:text-2xl font-bold text-black truncate">
                {formatValue(stat.value, stat.format)}
              </div>
            </div>
            
            {variation && (
              <div className={`flex items-center text-xs ${
                variation.isNeutral 
                  ? 'text-black/50' 
                  : variation.isPositive 
                    ? 'text-sky-blue' 
                    : 'text-vista-blue'
              }`}>
                {React.createElement(
                  getVariationIcon(variation.isPositive, variation.isNeutral), 
                  { className: 'h-3 w-3 mr-1 flex-shrink-0' }
                )}
                <span className="truncate font-medium">
                  {variation.value.toFixed(1)}% vs. mês anterior
                </span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default DashboardStats;
