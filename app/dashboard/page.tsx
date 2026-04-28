'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import AppShell from '@/components/AppShell';
import SmartAlerts from '@/components/SmartAlerts';
import SpendingPieChart from '@/components/SpendingPieChart';
import { useFamilyData } from '@/hooks/useFamilyData';
import { buildInsights, formatCurrency, getTopSpender } from '@/lib/utils';

export default function DashboardPage() {
  const { ready, activeFamily, activeMember } = useFamilyData();
  const [chartMode, setChartMode] = useState<'pie' | 'donut' | 'bar'>('pie');

  if (!ready) return null;

  if (!activeFamily || !activeMember) {
    return (
      <AppShell>
        <section className="card p-6 text-center">
          <p>لا توجد عائلة نشطة حاليًا. ابدأ من الصفحة الرئيسية.</p>
          <Link className="btn-primary mt-4 inline-block" href="/">
            العودة للرئيسية
          </Link>
        </section>
      </AppShell>
    );
  }

  const insights = buildInsights(activeFamily);
  const budgetUsage = Math.min((insights.totalSpent / activeFamily.monthlyBudget) * 100, 100);
  const topSpender = getTopSpender(activeFamily.members, activeFamily.expenses);
  const insightItems = useMemo(
    () => [
      { type: 'info', text: `المتبقي من الميزانية: ${formatCurrency(insights.remaining)}` },
      { type: 'warn', text: `معدل الحرق اليومي: ${formatCurrency(insights.dailyBurnRate)}` },
      {
        type: 'danger',
        text:
          insights.predictedDaysLeft !== Infinity
            ? `بهذا المعدل قد تكفي الميزانية ${Math.max(Math.floor(insights.predictedDaysLeft), 0)} يوم فقط`
            : 'لا يوجد إنفاق كافٍ لحساب توقع النفاد حتى الآن',
      },
    ],
    [insights.dailyBurnRate, insights.predictedDaysLeft, insights.remaining],
  );

  return (
    <AppShell>
      <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="card p-6 md:col-span-2">
          <h2 className="text-2xl font-bold">مرحبًا {activeMember.name} 👋</h2>
          <p className="mt-2 text-slate-500">ميزانية هذا الشهر: {formatCurrency(activeFamily.monthlyBudget)}</p>
          <div className="mt-4 h-3 overflow-hidden rounded-full bg-indigo-100">
            <div style={{ width: `${budgetUsage}%` }} className="h-full bg-gradient-to-r from-indigo-500 to-indigo-300" />
          </div>
          <div className="mt-2 text-sm text-slate-500">تم استخدام {budgetUsage.toFixed(0)}% من الميزانية</div>
        </div>

        <SmartAlerts alerts={insights.alerts} />

        <div className="card p-4">
          <h3 className="text-lg font-bold">💡 Insights</h3>
          <div className="mt-3 space-y-2 text-sm">
            {insightItems.map((item, idx) => (
              <p
                key={idx}
                className={`rounded-xl p-3 ${
                  item.type === 'info'
                    ? 'bg-sky-50 text-sky-800'
                    : item.type === 'warn'
                      ? 'bg-amber-50 text-amber-800'
                      : 'bg-rose-50 text-rose-700'
                }`}
              >
                {item.text}
              </p>
            ))}
          </div>
        </div>

        <div className="card p-4 md:col-span-2">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-lg font-bold">Spending Breakdown</h3>
            <div className="flex flex-wrap gap-2">
              <button className={`btn-secondary py-2 text-xs ${chartMode === 'pie' ? 'bg-indigo-50 text-indigo-600' : ''}`} onClick={() => setChartMode('pie')}>🥧 Pie</button>
              <button className={`btn-secondary py-2 text-xs ${chartMode === 'donut' ? 'bg-indigo-50 text-indigo-600' : ''}`} onClick={() => setChartMode('donut')}>🍩 Donut</button>
              <button className={`btn-secondary py-2 text-xs ${chartMode === 'bar' ? 'bg-indigo-50 text-indigo-600' : ''}`} onClick={() => setChartMode('bar')}>📊 Bar</button>
            </div>
          </div>
          <SpendingPieChart
            mode={chartMode}
            data={insights.categorySpend.map((c) => ({
              name: c.name,
              value: c.spent,
            }))}
          />
        </div>

        <div className="card p-4">
          <h3 className="text-lg font-bold">Top Spender</h3>
          <div className="mt-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">
            <p className="text-xs font-semibold text-amber-700">🏆 الأعلى إنفاقًا هذا الشهر</p>
            <p className="mt-1 text-xl font-bold">{topSpender ? topSpender.member.name : 'لا يوجد بعد'}</p>
            <p className="text-sm text-amber-700">{topSpender ? formatCurrency(topSpender.total) : '0'}</p>
          </div>
        </div>

        <div className="card p-4">
          <h3 className="text-lg font-bold">لوحة أعلى المُنفقين</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {activeFamily.members
              .map((member) => ({
                member,
                total: activeFamily.expenses.filter((e) => e.memberId === member.id).reduce((sum, e) => sum + e.amount, 0),
              }))
              .sort((a, b) => b.total - a.total)
              .map((entry, index) => (
                <li key={entry.member.id} className="flex items-center justify-between rounded-xl bg-sky-50 p-3">
                  <span>{index + 1}. {entry.member.name}</span>
                  <strong>{formatCurrency(entry.total)}</strong>
                </li>
              ))}
          </ul>
        </div>

        <div className="card p-4 md:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-lg font-bold">آخر العمليات</h3>
            <Link className="text-sky-700 underline" href="/expenses">
              عرض الكل
            </Link>
          </div>
          <ul className="space-y-2 text-sm">
            {activeFamily.expenses.slice(0, 5).map((expense) => {
              const member = activeFamily.members.find((m) => m.id === expense.memberId);
              const category = activeFamily.categories.find((c) => c.id === expense.categoryId);
              return (
                <li key={expense.id} className="grid grid-cols-1 gap-1 rounded-xl bg-sky-50 p-3 sm:grid-cols-2 md:grid-cols-4">
                  <span className="font-semibold">{expense.title}</span>
                  <span>{member?.name}</span>
                  <span>{category?.name}</span>
                  <span className="font-bold">{formatCurrency(expense.amount)}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
    </AppShell>
  );
}
