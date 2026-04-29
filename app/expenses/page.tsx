'use client';

import { useState } from 'react';
import Link from 'next/link';
import AppShell from '@/components/AppShell';
import { useFamilyData } from '@/hooks/useFamilyData';
import { formatCurrency } from '@/lib/utils';

export default function ExpensesPage() {
  const { ready, activeFamily, getFilteredExpenses, deleteExpense } = useFamilyData();
  const [memberId, setMemberId] = useState('');
  const [categoryId, setCategoryId] = useState('');

  if (!ready) return null;

  if (!activeFamily) {
    return (
      <AppShell>
        <section className="card p-6 text-center">لا توجد بيانات حالية.</section>
      </AppShell>
    );
  }

  const expenses = getFilteredExpenses({ memberId: memberId || undefined, categoryId: categoryId || undefined });

  return (
    <AppShell>
      <section className="space-y-4">
        <div className="card rounded-3xl border-0 bg-gradient-to-br from-indigo-500 to-violet-500 p-5 text-white shadow-[0_12px_40px_rgba(92,110,248,0.15)]">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-['Sora'] text-2xl font-bold">كل المصروفات</h2>
            <Link href="/expenses/new" className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-indigo-700">
              + إضافة مصروف
            </Link>
          </div>
          <p className="text-sm text-indigo-100">راجع العمليات، صفّي حسب العضو أو الفئة، واحذف أي سجل غير صحيح.</p>
        </div>

        <div className="card p-4">
          <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-2">
            <select className="input" value={memberId} onChange={(e) => setMemberId(e.target.value)}>
              <option value="">تصفية حسب العضو</option>
              {activeFamily.members.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name}
                </option>
              ))}
            </select>

            <select className="input" value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
              <option value="">تصفية حسب الفئة</option>
              {activeFamily.categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <ul className="space-y-3">
            {expenses.length === 0 ? (
              <li className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-center text-slate-500">لا توجد نتائج مطابقة للتصفية.</li>
            ) : expenses.map((expense) => {
              const member = activeFamily.members.find((m) => m.id === expense.memberId);
              const category = activeFamily.categories.find((c) => c.id === expense.categoryId);
              return (
                <li key={expense.id} className="rounded-2xl border border-[#e8ecf4] bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,.06)]">
                  <div className="grid grid-cols-1 gap-2 md:grid-cols-6 md:items-center">
                    <span className="font-bold text-slate-800">{expense.title}</span>
                    <span className="text-slate-600">{member?.name}</span>
                    <span className="inline-flex w-fit rounded-full bg-indigo-50 px-2 py-1 text-xs text-indigo-700">{category?.name}</span>
                    <span className="font-semibold text-indigo-700">{formatCurrency(expense.amount)}</span>
                    <span className="text-slate-500">{expense.proof ? '📎 مرفق' : '—'}</span>
                    <button className="text-sm font-semibold text-red-600 underline" onClick={() => deleteExpense(expense.id)}>
                      حذف
                    </button>
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
