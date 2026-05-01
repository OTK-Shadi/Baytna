'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import AppShell from '@/components/AppShell';
import { useFamilyData } from '@/hooks/useFamilyData';
import { formatCurrency } from '@/lib/utils';

const formatExpenseDate = (isoDate: string) => {
  const parsed = new Date(isoDate);
  if (Number.isNaN(parsed.getTime())) return '—';
  return parsed.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

export default function ExpensesPage() {
  const { ready, activeFamily, getFilteredExpenses, deleteExpense } = useFamilyData();
  const [memberId, setMemberId] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [activeProof, setActiveProof] = useState<{ src: string; title: string } | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

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
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h4 className="truncate text-base font-bold text-slate-900">{expense.title}</h4>
                      <p className="mt-0.5 text-xs text-slate-500">{formatExpenseDate(expense.createdAt)}</p>
                    </div>
                    <span className="shrink-0 text-base font-extrabold text-indigo-700">{formatCurrency(expense.amount, activeFamily.currency)}</span>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 font-medium text-slate-700">👤 {member?.name ?? '—'}</span>
                    <span className="rounded-full bg-indigo-50 px-2.5 py-1 font-medium text-indigo-700">🏷️ {category?.name ?? 'غير مصنّف'}</span>
                    <span className="rounded-full bg-amber-50 px-2.5 py-1 font-medium text-amber-700">{expense.proof ? '📎 يوجد مرفق' : 'بدون مرفق'}</span>
                  </div>

                  <p className="mt-3 rounded-xl bg-slate-50 px-3 py-2 text-sm leading-relaxed text-slate-600">
                    <span className="font-semibold text-slate-700">ملاحظة:</span>{' '}
                    {expense.note?.trim() ? expense.note : 'لا توجد ملاحظة'}
                  </p>

                  {expense.proof && (
                    <div className="mt-3">
                      <button
                        type="button"
                        className="rounded-lg bg-indigo-50 px-3 py-1.5 text-sm font-semibold text-indigo-700 hover:bg-indigo-100"
                        onClick={() => setActiveProof({ src: expense.proof as string, title: expense.title })}
                      >
                        اظهار المرفق
                      </button>
                    </div>
                  )}

                  <div className="mt-3 flex justify-end border-t border-slate-100 pt-3">
                    <button className="rounded-lg bg-red-50 px-3 py-1.5 text-sm font-semibold text-red-600" onClick={() => deleteExpense(expense.id)}>
                      حذف
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </section>


      {isClient && activeProof && createPortal(
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/65 p-4"
          onClick={() => setActiveProof(null)}
        >
          <div
            className="relative w-full max-w-3xl overflow-hidden rounded-2xl bg-white p-3 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-2 flex items-center justify-between gap-3">
              <p className="truncate text-sm font-semibold text-slate-700">مرفق: {activeProof.title}</p>
              <button
                type="button"
                className="rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-200"
                onClick={() => setActiveProof(null)}
              >
                إغلاق
              </button>
            </div>
            <img src={activeProof.src} alt={`مرفق ${activeProof.title}`} className="max-h-[85vh] w-full rounded-xl object-contain" />
          </div>
        </div>,
        document.body,
      )}
    </AppShell>
  );
}
