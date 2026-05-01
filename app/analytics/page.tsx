'use client';

import { useState } from 'react';
import AppShell from '@/components/AppShell';
import SpendingPieChart from '@/components/SpendingPieChart';
import DailyExpensesChart from '@/components/DailyExpensesChart';
import { useFamilyData } from '@/hooks/useFamilyData';
import { buildInsights, formatCurrency } from '@/lib/utils';

export default function AnalyticsPage() {
  const { ready, activeFamily } = useFamilyData();
  const [chartMode, setChartMode] = useState<'pie' | 'donut' | 'bar'>('pie');

  if (!ready) return null;

  if (!activeFamily) {
    return (
      <AppShell>
        <section className="card p-6 text-center">لا توجد بيانات تحليلات حاليًا.</section>
      </AppShell>
    );
  }

  const insights = buildInsights(activeFamily);

  return (
    <AppShell>
      <section className="space-y-4">
        <div className="card p-5">
          <h2 className="text-2xl font-bold">التحليلات</h2>
          <p className="mt-1 text-slate-500">عرض مرئي لأنماط الصرف لمساعدتك على فهم عادات الإنفاق.</p>
        </div>

        <div className="card p-4">
          <div className="mb-3 flex flex-wrap gap-2">
            <button className={`btn-secondary py-2 text-xs ${chartMode === 'pie' ? 'bg-indigo-50 text-indigo-600' : ''}`} onClick={() => setChartMode('pie')}>🥧 Pie</button>
            <button className={`btn-secondary py-2 text-xs ${chartMode === 'donut' ? 'bg-indigo-50 text-indigo-600' : ''}`} onClick={() => setChartMode('donut')}>🍩 Donut</button>
            <button className={`btn-secondary py-2 text-xs ${chartMode === 'bar' ? 'bg-indigo-50 text-indigo-600' : ''}`} onClick={() => setChartMode('bar')}>📊 Bar</button>
          </div>
          <SpendingPieChart
            mode={chartMode}
            currency={activeFamily.currency}
            data={insights.categorySpend.map((item) => ({ name: item.name, value: item.spent }))}
          />
        </div>


        <DailyExpensesChart
          expenses={activeFamily.expenses.map((expense) => ({ amount: expense.amount, createdAt: expense.createdAt }))}
          currency={activeFamily.currency}
          monthlyBudget={activeFamily.monthlyBudget}
        />

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {insights.categorySpend.map((item) => (
            <div key={item.id} className="card p-4">
              <p className="font-semibold">{item.name}</p>
              <p className="mt-1 text-sm text-slate-500">المصروف: {formatCurrency(item.spent, activeFamily.currency)}</p>
              <p className="text-sm text-slate-500">الحد: {formatCurrency(item.limit, activeFamily.currency)}</p>
            </div>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
