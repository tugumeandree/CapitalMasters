'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { formatPrimaryAndSecondary } from '@/lib/currency';

interface PerformanceChartProps {
  data: Array<{
    month: string;
    value: number;
    benchmark?: number;
  }>;
}

export function PerformanceChart({ data }: PerformanceChartProps) {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white px-4 py-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900 mb-2">{label}</p>
          {payload.map((item: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: item.color }}>
              {item.name}: {(() => {
                const v = formatPrimaryAndSecondary(item.value);
                return (
                  <>
                    <span>{v.primary}</span>
                    <span className="text-xs text-gray-500 ml-2">{v.secondary}</span>
                  </>
                );
              })()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="month" 
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#1e40af"
            strokeWidth={2}
            name="Portfolio Value"
            dot={{ fill: '#1e40af', r: 4 }}
            activeDot={{ r: 6 }}
          />
          {data[0]?.benchmark !== undefined && (
            <Line
              type="monotone"
              dataKey="benchmark"
              stroke="#9ca3af"
              strokeWidth={2}
              strokeDasharray="5 5"
              name="Market Benchmark"
              dot={{ fill: '#9ca3af', r: 4 }}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
