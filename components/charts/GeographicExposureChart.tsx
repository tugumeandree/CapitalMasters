'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface GeographicData {
  region: string;
  percentage: number;
}

interface GeographicExposureChartProps {
  data: GeographicData[];
}

const COLORS = [
  '#1e40af', // blue-800
  '#3b82f6', // blue-500
  '#60a5fa', // blue-400
  '#93c5fd', // blue-300
  '#dbeafe', // blue-100
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 shadow-lg rounded-lg border border-gray-200">
        <p className="font-semibold text-gray-900">{payload[0].name}</p>
        <p className="text-primary-600">
          {payload[0].value}% of portfolio
        </p>
      </div>
    );
  }
  return null;
};

export default function GeographicExposureChart({ data }: GeographicExposureChartProps) {
  const chartData = data.map((item) => ({
    name: item.region,
    value: item.percentage,
  }));

  return (
    <ResponsiveContainer width="100%" height={400}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
          outerRadius={120}
          fill="#8884d8"
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
