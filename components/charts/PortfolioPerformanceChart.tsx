'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface PerformanceData {
  date: string;
  portfolioValue: number;
  benchmark: number;
}

interface PortfolioPerformanceChartProps {
  data: PerformanceData[];
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 shadow-lg rounded-lg border border-gray-200">
        <p className="font-semibold text-gray-900 mb-2">{payload[0].payload.date}</p>
        <p className="text-primary-600">
          Portfolio: ${(payload[0].value / 1000000000).toFixed(2)}B
        </p>
        <p className="text-gray-600">
          Benchmark: ${(payload[1].value / 1000000000).toFixed(2)}B
        </p>
      </div>
    );
  }
  return null;
};

export default function PortfolioPerformanceChart({ data }: PortfolioPerformanceChartProps) {
  // Format data for display
  const chartData = data.map((item) => ({
    date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
    portfolio: item.portfolioValue,
    benchmark: item.benchmark,
  }));

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 12 }}
          angle={-45}
          textAnchor="end"
          height={80}
        />
        <YAxis
          tick={{ fontSize: 12 }}
          tickFormatter={(value) => `$${(value / 1000000000).toFixed(1)}B`}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Line
          type="monotone"
          dataKey="portfolio"
          stroke="#1e40af"
          strokeWidth={3}
          name="Portfolio Value"
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="benchmark"
          stroke="#94a3b8"
          strokeWidth={2}
          name="Benchmark"
          dot={false}
          strokeDasharray="5 5"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
