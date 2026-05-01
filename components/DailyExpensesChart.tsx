'use client';

import { useMemo, useState } from 'react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { formatCurrency } from '@/lib/utils';

type RangeOption = 'month' | '30d' | '7d';

export default function DailyExpensesChart({
  expenses,
  currency,
  monthlyBudget,
}: {
  expenses: { amount: number; createdAt: string }[];
  currency: string;
  monthlyBudget: number;
}) {
  const [range, setRange] = useState<RangeOption>('30d');

  const chartData = useMemo(() => {
    const today = new Date();
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    let startDate = new Date(startOfToday);
    if (range === 'month') {
      startDate = new Date(today.getFullYear(), today.getMonth(), 1);
    } else {
      const daysBack = range === '7d' ? 6 : 29;
      startDate.setDate(startDate.getDate() - daysBack);
    }

    const bucket = new Map<string, number>();
    const cursor = new Date(startDate);
    while (cursor <= startOfToday) {
      bucket.set(cursor.toISOString().slice(0, 10), 0);
      cursor.setDate(cursor.getDate() + 1);
    }

    expenses.forEach((expense) => {
      const dateKey = new Date(expense.createdAt).toISOString().slice(0, 10);
      if (bucket.has(dateKey)) {
        bucket.set(dateKey, (bucket.get(dateKey) || 0) + expense.amount);
      }
    });

    const daysCount = bucket.size || 1;
    const dailyBudget = monthlyBudget > 0 ? monthlyBudget / 30 : 0;

    return Array.from(bucket.entries()).map(([date, amount]) => ({
      date,
      day: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      amount,
      budgetLine: dailyBudget,
      maxHint: Math.max(amount, dailyBudget),
      avg: amount / daysCount,
    }));
  }, [expenses, monthlyBudget, range]);

  const maxAmount = Math.max(...chartData.map((item) => item.amount), monthlyBudget / 30, 1);

  return (
    <div className="card p-4 sm:p-5">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-bold">اتجاه المصروفات اليومية</h3>
        </div>
        <div className="inline-flex w-full rounded-xl bg-slate-100 p-1 sm:w-auto">
          {[
            { key: '7d', label: 'آخر 7 أيام' },
            { key: '30d', label: 'آخر 30 يومًا' },
            { key: 'month', label: 'هذا الشهر' },
          ].map((option) => (
            <button
              key={option.key}
              onClick={() => setRange(option.key as RangeOption)}
              className={`flex-1 rounded-lg px-3 py-2 text-xs font-medium transition sm:flex-none ${
                range === option.key ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="h-72 w-full sm:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="dailyExpensesGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.03} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis dataKey="day" tick={{ fontSize: 11 }} minTickGap={24} />
            <YAxis
              domain={[0, Math.ceil(maxAmount * 1.2)]}
              tick={{ fontSize: 11 }}
              tickFormatter={(value) => `${Math.round(value)}`}
              width={40}
            />
            <Tooltip
              formatter={(value: number, name: string) => [formatCurrency(value, currency), name === 'budgetLine' ? 'Daily budget' : 'Expenses']}
              labelFormatter={(label) => `Date: ${label}`}
            />
            <Area type="monotone" dataKey="budgetLine" stroke="#94a3b8" strokeDasharray="5 5" fillOpacity={0} />
            <Area type="monotone" dataKey="amount" stroke="#4f46e5" strokeWidth={2.5} fill="url(#dailyExpensesGradient)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
