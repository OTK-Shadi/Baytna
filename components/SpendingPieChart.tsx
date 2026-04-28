'use client';

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

const COLORS = ['#0ea5e9', '#1e40af', '#38bdf8', '#0284c7', '#7dd3fc', '#3b82f6', '#60a5fa'];

export default function SpendingPieChart({ data }: { data: { name: string; value: number }[] }) {
  return (
    <div className="card h-80 p-4">
      <h3 className="text-lg font-bold">توزيع الإنفاق حسب الفئة</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
              {data.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value: number) => `${value.toLocaleString('ar-EG')} ج.م`} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
