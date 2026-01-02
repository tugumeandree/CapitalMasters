'use client';

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';
import { formatPrimaryAndSecondary } from '@/lib/currency';

interface AssetAllocationChartProps {
  holdings: Array<{
    name: string;
    type: string;
    value: number;
    allocation: number;
  }>;
}

const COLORS = ['#1e40af', '#3b82f6', '#60a5fa', '#93c5fd', '#dbeafe'];

export function AssetAllocationChart({ holdings }: AssetAllocationChartProps) {
  const data = holdings.map(holding => ({
    name: holding.name,
    value: holding.allocation,
    amount: holding.value,
  }));

  const renderCustomLabel = ({ name, value }: any) => {
    return `${name}: ${value}%`;
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white px-4 py-2 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900">{payload[0].name}</p>
          <p className="text-sm text-gray-600">
            {(() => {
              const vals = formatPrimaryAndSecondary(payload[0].payload.amount);
              return (
                <>
                  <span>{vals.primary}</span>
                  <div className="text-xs text-gray-500">{vals.secondary}</div>
                </>
              );
            })()}
          </p>
          <p className="text-sm text-primary-600 font-semibold">
            {payload[0].value.toFixed(1)}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label={renderCustomLabel}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
