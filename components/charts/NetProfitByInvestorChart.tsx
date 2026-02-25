'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

interface NetProfitDataPoint {
  name: string;
  netProfit: number;
  deposits: number;
  returns: number;
}

interface NetProfitByInvestorChartProps {
  data: NetProfitDataPoint[];
}

export function NetProfitByInvestorChart({ data }: NetProfitByInvestorChartProps) {
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="bg-white px-4 py-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900 mb-2">{item.name}</p>
          <p className="text-sm text-gray-700">
            <span className="font-medium">Net Profit:</span> UGX {item.netProfit.toLocaleString('en-UG')}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Total Deposits:</span> UGX {item.deposits.toLocaleString('en-UG')}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Total Returns:</span> UGX {item.returns.toLocaleString('en-UG')}
          </p>
        </div>
      );
    }
    return null;
  };

  const getBarColor = (value: number) => {
    if (value > 0) return '#10b981'; // Green for positive
    if (value < 0) return '#ef4444'; // Red for negative
    return '#6b7280'; // Gray for zero
  };

  // Sort data by net profit in descending order
  const sortedData = [...data].sort((a, b) => b.netProfit - a.netProfit);

  return (
    <div className="w-full bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Net Profit by Investor</h3>
      <div className="w-full h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={sortedData}
            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="name"
              angle={-45}
              textAnchor="end"
              height={100}
              interval={0}
              tick={{ fontSize: 12, fill: '#6b7280' }}
            />
            <YAxis
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
              tickFormatter={(value) => `UGX ${(value / 1000000).toFixed(1)}M`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="netProfit" radius={[8, 8, 0, 0]}>
              {sortedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getBarColor(entry.netProfit)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200">
        <div>
          <p className="text-sm text-gray-600 font-medium mb-1">Total Net Profit</p>
          <p className="text-2xl font-bold text-gray-900">
            UGX {sortedData.reduce((sum, d) => sum + d.netProfit, 0).toLocaleString('en-UG')}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600 font-medium mb-1">Total Deposits</p>
          <p className="text-2xl font-bold text-blue-600">
            UGX {sortedData.reduce((sum, d) => sum + d.deposits, 0).toLocaleString('en-UG')}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600 font-medium mb-1">Total Returns</p>
          <p className="text-2xl font-bold text-green-600">
            UGX {sortedData.reduce((sum, d) => sum + d.returns, 0).toLocaleString('en-UG')}
          </p>
        </div>
      </div>
    </div>
  );
}
