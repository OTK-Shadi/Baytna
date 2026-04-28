'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AppShell from '@/components/AppShell';
import { useFamilyData } from '@/hooks/useFamilyData';

export default function NewExpensePage() {
  const { ready, activeFamily, addExpense } = useFamilyData();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState(0);
  const [categoryId, setCategoryId] = useState('');
  const [note, setNote] = useState('');
  const [proof, setProof] = useState('');
  const [toast, setToast] = useState('');

  if (!ready) return null;

  if (!activeFamily) {
    return (
      <AppShell>
        <section className="card p-6">لا توجد عائلة نشطة.</section>
      </AppShell>
    );
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = addExpense({
      title,
      amount,
      categoryId,
      note,
      proof: proof.trim() ? proof.trim() : undefined,
    });

    if (ok) {
      setToast('✅ تمت إضافة المصروف وتحديث اللوحة مباشرة.');
      setTimeout(() => router.push('/dashboard'), 900);
    }
  };

  return (
    <AppShell>
      <section className="card mx-auto max-w-2xl p-6">
        <h2 className="text-2xl font-bold">إضافة مصروف جديد</h2>
        <form className="mt-4 space-y-3" onSubmit={onSubmit}>
          <input className="input" placeholder="عنوان المصروف" value={title} onChange={(e) => setTitle(e.target.value)} required />
          <input className="input" type="number" placeholder="التكلفة" value={amount} onChange={(e) => setAmount(Number(e.target.value))} required />
          <select className="input" value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required>
            <option value="">اختر الفئة</option>
            {activeFamily.categories.map((cat) => (
              <option value={cat.id} key={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          <textarea className="input min-h-24" placeholder="ملاحظة (اختيارية)" value={note} onChange={(e) => setNote(e.target.value)} />
          <input
            className="input"
            placeholder="الإثبات/الصورة (Base64 قصير أو IMAGE_ATTACHED)"
            value={proof}
            onChange={(e) => setProof(e.target.value)}
          />
          <button className="btn-primary w-full" type="submit">
            حفظ المصروف
          </button>
          {toast && <div className="animate-pulse rounded-xl bg-green-50 p-3 text-green-700">{toast}</div>}
        </form>
      </section>
    </AppShell>
  );
}
