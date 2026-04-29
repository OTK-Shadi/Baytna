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
        <div className="card rounded-3xl border-0 bg-gradient-to-br from-indigo-500 via-indigo-500 to-violet-500 p-5 text-white shadow-[0_12px_40px_rgba(92,110,248,0.15)]">
          <h2 className="font-['Sora'] text-2xl font-bold">العائلة</h2>
          <p className="mt-1 text-indigo-100">{activeFamily.members.length} أعضاء</p>
          <div className="mt-3 inline-flex items-center rounded-full bg-white/20 px-3 py-1 text-xs font-semibold">Invite: {activeFamily.inviteCode}</div>
        </div>

        <div className="card p-4">
          <h3 className="font-['Sora'] text-lg font-bold">الأعضاء</h3>
          <ul className="mt-3 space-y-3">
            {activeFamily.members.map((member) => {
              const memberTotal = activeFamily.expenses
                .filter((expense) => expense.memberId === member.id)
                .reduce((sum, expense) => sum + expense.amount, 0);
              const pct = activeFamily.monthlyBudget > 0 ? Math.min((memberTotal / activeFamily.monthlyBudget) * 100, 100) : 0;
              return (
                <li key={member.id} className="rounded-2xl border border-[#e8ecf4] bg-white p-3 shadow-[0_1px_3px_rgba(0,0,0,.06)]">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="font-semibold">{member.name}</p>
                    <p className="rounded-full bg-indigo-50 px-2 py-1 text-xs text-indigo-700">{member.role === 'admin' ? 'Admin' : 'Member'}</p>
                  </div>
                  <div className="mb-2 h-2 overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-indigo-300" style={{ width: `${pct}%` }} />
                  </div>
                  <p className="text-sm text-slate-500">إجمالي صرفه: {formatCurrency(memberTotal, activeFamily.currency)}</p>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="card p-4 text-center">
          <p className="text-sm text-slate-500">شارك كود العائلة مع الأعضاء الجدد</p>
          <div className="mt-3 rounded-2xl border border-indigo-200 bg-indigo-50 p-4 text-2xl font-black tracking-widest text-indigo-700">
            {activeFamily.inviteCode}
          </div>
          <div className="mt-3 flex flex-wrap justify-center gap-2">
            <button className="btn-secondary" onClick={copyCode}>📋 Copy Code</button>
            <button className="btn-primary" onClick={generateCode}>🔄 Generate New Code</button>
          </div>
          {toast && <p className="mt-3 text-sm font-semibold text-green-700">{toast}</p>}
        </div>
      </section>
    </AppShell>
  );
}
