'use client';

import { useState } from 'react';
import AppShell from '@/components/AppShell';
import { useFamilyData } from '@/hooks/useFamilyData';
import { formatCurrency } from '@/lib/utils';

export default function FamilyPage() {
  const { ready, activeFamily, regenerateInviteCode } = useFamilyData();
  const [toast, setToast] = useState('');

  if (!ready) return null;

  if (!activeFamily) {
    return (
      <AppShell>
        <section className="card p-6 text-center">لا توجد عائلة نشطة.</section>
      </AppShell>
    );
  }

  const copyCode = async () => {
    await navigator.clipboard.writeText(activeFamily.inviteCode);
    setToast('تم نسخ الكود ✅');
    setTimeout(() => setToast(''), 1500);
  };

  const generateCode = () => {
    const next = regenerateInviteCode();
    if (!next) return;
    setToast(`تم إنشاء كود جديد: ${next}`);
    setTimeout(() => setToast(''), 1800);
  };

  return (
    <AppShell>
      <section className="space-y-4">
        <div className="card p-5">
          <h2 className="text-2xl font-bold">العائلة</h2>
          <p className="text-slate-500">{activeFamily.members.length} أعضاء · Code: {activeFamily.inviteCode}</p>
        </div>

        <div className="card p-4">
          <h3 className="text-lg font-bold">الأعضاء</h3>
          <ul className="mt-3 space-y-3">
            {activeFamily.members.map((member) => {
              const memberTotal = activeFamily.expenses
                .filter((expense) => expense.memberId === member.id)
                .reduce((sum, expense) => sum + expense.amount, 0);
              const pct = activeFamily.monthlyBudget > 0 ? Math.min((memberTotal / activeFamily.monthlyBudget) * 100, 100) : 0;
              return (
                <li key={member.id} className="rounded-xl border border-slate-200 p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="font-semibold">{member.name}</p>
                    <p className="text-sm text-slate-500">{member.role === 'admin' ? 'Admin' : 'Member'}</p>
                  </div>
                  <div className="mb-2 h-2 overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full rounded-full bg-indigo-500" style={{ width: `${pct}%` }} />
                  </div>
                  <p className="text-sm text-slate-500">إجمالي صرفه: {formatCurrency(memberTotal)}</p>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="card p-4 text-center">
          <p className="text-sm text-slate-500">شارك كود العائلة مع الأعضاء الجدد</p>
          <div className="mt-3 rounded-xl border border-indigo-200 bg-indigo-50 p-4 text-2xl font-black tracking-widest text-indigo-700">
            {activeFamily.inviteCode}
          </div>
          <div className="mt-3 flex flex-wrap justify-center gap-2">
            <button className="btn-secondary" onClick={copyCode}>📋 Copy Code</button>
            <button className="btn-primary" onClick={generateCode}>🔄 Generate New Code</button>
          </div>
          {toast && <p className="mt-3 text-sm text-green-700">{toast}</p>}
        </div>
      </section>
    </AppShell>
  );
}
