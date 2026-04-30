'use client';

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { formatCurrency } from '@/lib/utils';

const COLORS = ['#1d4ed8', '#ea580c', '#dc2626', '#16a34a', '#7c3aed', '#0f766e', '#d97706'];

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
        {mode === 'bar' ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value: number) => formatCurrency(value, currency)} />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {chartData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} stroke="#ffffff" strokeWidth={2} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full items-center gap-4">
            <div className="h-full w-2/3">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={mode === 'donut' ? 55 : 0}
                    outerRadius={90}
                    label={false}
                    labelLine={false}
                  >
                    {chartData.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} stroke="#ffffff" strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => formatCurrency(value, currency)} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <ul className="w-1/3 space-y-2 overflow-auto text-sm">
              {chartData.map((item, index) => (
                <li key={`${item.name}-${index}`} className="flex items-center justify-between gap-2">
                  <div className="flex min-w-0 items-center gap-2">
                    <span
                      className="inline-block h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="truncate">{item.name}</span>
                  </div>
                  <span className="shrink-0 font-medium">{formatCurrency(item.value, currency)}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
