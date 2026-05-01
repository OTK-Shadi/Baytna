'use client';

import { useState } from 'react';
import Link from 'next/link';
import AppShell from '@/components/AppShell';
import SmartAlerts from '@/components/SmartAlerts';
import SpendingPieChart from '@/components/SpendingPieChart';
import DailyExpensesChart from '@/components/DailyExpensesChart';
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
  const safeBudget = Number.isFinite(activeFamily.monthlyBudget) && activeFamily.monthlyBudget > 0 ? activeFamily.monthlyBudget : 1;
  const hasInvalidBudget = !Number.isFinite(activeFamily.monthlyBudget) || activeFamily.monthlyBudget <= 0;
  const budgetUsage = Math.min((insights.totalSpent / safeBudget) * 100, 100);
  const topSpender = getTopSpender(activeFamily.members, activeFamily.expenses);
  const overspend = Math.max(insights.totalSpent - safeBudget, 0);
  const quickSummaryItems = [
    {
      type: 'info',
      text: `المتبقي من الميزانية: ${formatCurrency(insights.remaining, activeFamily.currency)}` ,
    },
    {
      type: 'warn',
      text: `إجمالي المصروف حتى الآن: ${formatCurrency(insights.totalSpent, activeFamily.currency)}` ,
    },
    {
      type: 'danger',
      text: hasInvalidBudget
        ? 'نسبة استخدام الميزانية: الميزانية الشهرية غير صالحة'
        : `نسبة استخدام الميزانية: ${budgetUsage.toFixed(0)}%`,
    },
  ];
  const formatExpenseDate = (isoDate: string) => {
    const parsed = new Date(isoDate);
    if (Number.isNaN(parsed.getTime())) return '—';
    return parsed.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <AppShell>
      <section className="grid grid-cols-1 gap-4">
        {hasInvalidBudget && (
          <div className="card border border-amber-200 bg-amber-50 p-4 text-amber-900">
            ⚠️ الميزانية الشهرية غير صالحة أو غير مُحددة. يرجى ضبط الميزانية من الإعدادات أو أثناء الإعداد الأولي.
          </div>
        )}

        <div className="card relative overflow-hidden rounded-3xl border-0 bg-gradient-to-br from-indigo-500 via-indigo-500 to-violet-500 p-5 text-white">
          <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/10" />
          <div className="pointer-events-none absolute -bottom-12 right-12 h-28 w-28 rounded-full bg-white/10" />
          <h2 className="text-2xl font-extrabold">Dashboard</h2>
          <p className="text-xs text-indigo-100">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
          <p className="mt-3 text-[11px] font-semibold tracking-wide text-indigo-100">TOTAL BUDGET</p>
          <h3 className="text-4xl font-black leading-tight">{formatCurrency(activeFamily.monthlyBudget, activeFamily.currency)}</h3>
          <div className="mt-3 flex flex-wrap gap-2 text-[11px] font-semibold">
            <span className="rounded-full bg-white/25 px-3 py-1">Spent: {formatCurrency(insights.totalSpent, activeFamily.currency)}</span>
            <span className="rounded-full bg-rose-200/40 px-3 py-1">Over: {formatCurrency(overspend, activeFamily.currency)}</span>
          </div>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/30">
            <div style={{ width: `${budgetUsage}%` }} className="h-full bg-white" />
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-indigo-100">
            <span>{formatCurrency(0, activeFamily.currency)}</span>
            <span>{budgetUsage.toFixed(0)}% used</span>
            <span>{formatCurrency(activeFamily.monthlyBudget, activeFamily.currency)}</span>
          </div>
        </div>

        <div className="card border-sky-200 bg-[#f7fbff] p-4">
          <SmartAlerts alerts={insights.alerts} />
        </div>

        <div className="card p-4">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-lg font-bold">Quick Summary</h3>
          </div>
          <div className="mt-3 space-y-2 text-sm">
            {quickSummaryItems.map((item, idx) => (
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

        <div className="card p-4">
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
            currency={activeFamily.currency}
            data={insights.categorySpend.map((c) => ({
              name: c.name,
              value: c.spent,
            }))}
          />

          <div className="mt-4">
            <DailyExpensesChart
              expenses={activeFamily.expenses.map((expense) => ({ amount: expense.amount, createdAt: expense.createdAt }))}
              currency={activeFamily.currency}
              monthlyBudget={activeFamily.monthlyBudget}
            />
          </div>
        </div>

        <div className="card p-4">
          <h3 className="text-lg font-bold">Top Spender</h3>
          <div className="mt-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">
            <p className="text-xs font-semibold text-amber-700">🏆 الأعلى إنفاقًا هذا الشهر</p>
            <p className="mt-1 text-xl font-bold">{topSpender ? topSpender.member.name : 'لا يوجد بعد'}</p>
            <p className="text-sm text-amber-700">{topSpender ? formatCurrency(topSpender.total, activeFamily.currency) : formatCurrency(0, activeFamily.currency)}</p>
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
                  <strong>{formatCurrency(entry.total, activeFamily.currency)}</strong>
                </li>
              ))}
          </ul>
        </div>

        <div className="card p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-lg font-bold">آخر العمليات</h3>
            <Link className="text-sky-700 underline" href="/expenses">
              عرض الكل
            </Link>
          </div>
          <ul className="space-y-2 text-sm">
            {activeFamily.expenses.length === 0 ? (
              <li className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4 text-center text-slate-500">No expenses yet</li>
            ) : activeFamily.expenses.slice(0, 5).map((expense) => {
              const member = activeFamily.members.find((m) => m.id === expense.memberId);
              const category = activeFamily.categories.find((c) => c.id === expense.categoryId);
              return (
                <li key={expense.id} className="rounded-2xl border border-[#e8ecf4] bg-white p-3 shadow-[0_1px_3px_rgba(0,0,0,.05)]">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 font-bold text-slate-600">
                      {(member?.name?.[0] ?? 'A').toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate font-semibold text-slate-900">{expense.title}</div>
                      <div className="text-xs text-slate-500">{formatExpenseDate(expense.createdAt)}</div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="shrink-0 text-base font-bold text-slate-900">{formatCurrency(expense.amount, activeFamily.currency)}</span>
                      <span className="rounded-full bg-violet-100 px-2 py-0.5 text-[11px] font-semibold text-violet-700">{category?.name ?? 'Uncategorized'}</span>
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-slate-500">
                    by {member?.name ?? '—'}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
    </AppShell>
  );
}
