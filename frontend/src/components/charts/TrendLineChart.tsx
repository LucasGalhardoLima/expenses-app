import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { formatCurrency } from '../../utils';

interface TrendData {
  period: string;
  value: number;
  previousValue?: number;
}

interface TrendLineChartProps {
  data: TrendData[];
  title: string;
  dataKey: string;
  color: string;
  isLoading?: boolean;
}

const TrendLineChart: React.FC<TrendLineChartProps> = ({ 
  data, 
  title,
  dataKey,
  color,
  isLoading 
}) => {
  if (isLoading) {
    return (
      <div className="card">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="h-80 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  const customTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border">
          <p className="font-medium text-gray-900 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Calcular variação percentual
  const calculateVariation = () => {
    if (data.length < 2) return null;
    
    const current = data[data.length - 1]?.value || 0;
    const previous = data[data.length - 2]?.value || 0;
    
    if (previous === 0) return null;
    
    const variation = ((current - previous) / previous) * 100;
    return {
      value: variation,
      isPositive: variation > 0,
      isNeutral: Math.abs(variation) < 0.1
    };
  };

  const variation = calculateVariation();

  return (
    <div className="card h-[420px] flex flex-col">
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="mb-2 sm:mb-0">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {title}
            </h3>
            <p className="text-sm text-gray-600">
              Tendência nos últimos meses
            </p>
          </div>
          
          {variation && (
            <div className={`text-left sm:text-right ${
              variation.isNeutral 
                ? 'text-gray-600' 
                : variation.isPositive 
                  ? 'text-green-600' 
                  : 'text-red-600'
            }`}>
              <div className="text-xs font-medium uppercase tracking-wide">
                vs. mês anterior
              </div>
              <div className="text-sm sm:text-lg font-bold flex items-center">
                {variation.isPositive ? '↗' : variation.isNeutral ? '→' : '↘'} 
                {Math.abs(variation.value).toFixed(1)}%
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart 
            data={data} 
            margin={{ 
              top: 10, 
              right: 10, 
              left: 10, 
              bottom: 25 
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="period" 
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => value.slice(0, 3)}
              interval={0}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => formatCurrency(value).replace('R$', 'R$').replace(',00', '')}
              width={60}
            />
            <Tooltip content={customTooltip} />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke={color} 
              strokeWidth={2}
              dot={{ fill: color, strokeWidth: 1, r: 3 }}
              activeDot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TrendLineChart;
