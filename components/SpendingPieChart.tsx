'use client';

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { formatCurrency } from '@/lib/utils';

const COLORS = ['#0ea5e9', '#1e40af', '#38bdf8', '#0284c7', '#7dd3fc', '#3b82f6', '#60a5fa'];

export default function SpendingPieChart({
  data,
  mode = 'pie',
  currency = 'JOD',
}: {
  data: { name: string; value: number }[];
  mode?: 'pie' | 'donut' | 'bar';
  currency?: string;
}) {
  const chartData = data.length ? data : [{ name: 'No Data', value: 1 }];

  return (
    <div className="card h-80 p-4">
      <h3 className="text-lg font-bold">توزيع الإنفاق حسب الفئة</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          {mode === 'bar' ? (
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value: number) => formatCurrency(value, currency)} />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {chartData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          ) : (
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={mode === 'donut' ? 55 : 0}
                outerRadius={90}
                label
              >
                {chartData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => formatCurrency(value, currency)} />
            </PieChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
