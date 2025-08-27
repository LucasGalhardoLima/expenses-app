import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { formatCurrency } from '../../utils';

interface MonthlyComparisonData {
  month: string;
  receitas: number;
  despesas: number;
  saldo: number;
}

interface MonthlyComparisonChartProps {
  data: MonthlyComparisonData[];
  isLoading?: boolean;
}

const MonthlyComparisonChart: React.FC<MonthlyComparisonChartProps> = ({ 
  data, 
  isLoading 
}) => {
  if (isLoading) {
    return (
      <div className="card">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
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

  return (
    <div className="card">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Comparação Mensal
        </h3>
        <p className="text-sm text-gray-600">
          Evolução de receitas, despesas e saldo nos últimos meses
        </p>
      </div>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
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
              dataKey="month" 
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
            <Legend 
              wrapperStyle={{ fontSize: '12px' }}
              iconSize={12}
            />
            <Bar 
              dataKey="receitas" 
              name="Receitas" 
              fill="#10b981" 
              radius={[2, 2, 0, 0]}
            />
            <Bar 
              dataKey="despesas" 
              name="Despesas" 
              fill="#ef4444" 
              radius={[2, 2, 0, 0]}
            />
            <Bar 
              dataKey="saldo" 
              name="Saldo" 
              fill="#3b82f6" 
              radius={[2, 2, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MonthlyComparisonChart;
