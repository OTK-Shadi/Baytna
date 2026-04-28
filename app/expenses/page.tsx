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
      <section className="card p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-2xl font-bold">كل المصروفات</h2>
          <Link href="/expenses/new" className="btn-primary py-2">
            إضافة مصروف
          </Link>
        </div>

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

        <ul className="space-y-2">
          {expenses.map((expense) => {
            const member = activeFamily.members.find((m) => m.id === expense.memberId);
            const category = activeFamily.categories.find((c) => c.id === expense.categoryId);
            return (
              <li key={expense.id} className="rounded-2xl bg-sky-50 p-4">
                <div className="grid grid-cols-1 gap-2 md:grid-cols-6 md:items-center">
                  <span className="font-bold">{expense.title}</span>
                  <span>{member?.name}</span>
                  <span>{category?.name}</span>
                  <span>{formatCurrency(expense.amount)}</span>
                  <span>{expense.proof ? '📎 مرفق' : '—'}</span>
                  <button className="text-red-600 underline" onClick={() => deleteExpense(expense.id)}>
                    حذف
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </section>
    </AppShell>
  );
}
