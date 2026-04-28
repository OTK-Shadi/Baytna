'use client';

import Link from 'next/link';
import AppShell from '@/components/AppShell';
import SmartAlerts from '@/components/SmartAlerts';
import SpendingPieChart from '@/components/SpendingPieChart';
import { useFamilyData } from '@/hooks/useFamilyData';
import { buildInsights, formatCurrency, getTopSpender } from '@/lib/utils';

export default function DashboardPage() {
  const { ready, activeFamily, activeMember } = useFamilyData();

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

  return (
    <AppShell>
      <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="card p-6 md:col-span-2">
          <h2 className="text-2xl font-bold">مرحبًا {activeMember.name} 👋</h2>
          <p className="mt-2 text-sky-900">المتبقي من الميزانية: {formatCurrency(insights.remaining)}</p>
          <div className="mt-4 h-4 overflow-hidden rounded-full bg-sky-100">
            <div style={{ width: `${budgetUsage}%` }} className="h-full bg-gradient-to-r from-blue-600 to-sky-400" />
          </div>
        </div>

        <SmartAlerts alerts={insights.alerts} />

        <div className="card p-4">
          <h3 className="text-lg font-bold">ملخص ذكي</h3>
          <div className="mt-3 space-y-2 text-sm">
            <p>إجمالي الصرف: <strong>{formatCurrency(insights.totalSpent)}</strong></p>
            <p>معدل الحرق اليومي: <strong>{formatCurrency(insights.dailyBurnRate)}</strong></p>
            <p>الأيام المتبقية بالشهر: <strong>{insights.daysLeftInMonth}</strong></p>
            <p>أعلى مُنفق: <strong>{topSpender ? `${topSpender.member.name} (${formatCurrency(topSpender.total)})` : 'لا يوجد بعد'}</strong></p>
          </div>
        </div>

        <SpendingPieChart
          data={insights.categorySpend.map((c) => ({
            name: c.name,
            value: c.spent,
          }))}
        />

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
                <li key={expense.id} className="grid grid-cols-1 gap-1 rounded-xl bg-sky-50 p-3 md:grid-cols-4">
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
