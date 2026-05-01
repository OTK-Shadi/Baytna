'use client';

import { ChangeEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import AppShell from '@/components/AppShell';
import { useFamilyData } from '@/hooks/useFamilyData';

const MAX_RECEIPT_SIZE_BYTES = 3 * 1024 * 1024;

export default function NewExpensePage() {
  const parsePositiveAmount = (value: string) => {
    const parsed = Number(value.trim());
    if (!Number.isFinite(parsed) || parsed <= 0) return null;
    return Math.round(parsed * 100) / 100;
  };

  const { ready, activeFamily, addExpense } = useFamilyData();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [amountInput, setAmountInput] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [note, setNote] = useState('');
  const [proofImage, setProofImage] = useState<string | undefined>(undefined);
  const [receiptError, setReceiptError] = useState('');
  const [toast, setToast] = useState('');
  const amount = parsePositiveAmount(amountInput);

  if (!ready) return null;

  if (!activeFamily) {
    return (
      <AppShell>
        <section className="card p-6">لا توجد عائلة نشطة.</section>
      </AppShell>
    );
  }

  const onReceiptSelected = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setReceiptError('');

    if (!file) {
      setProofImage(undefined);
      return;
    }

    if (!file.type.startsWith('image/')) {
      setReceiptError('صيغة الملف غير مدعومة. الرجاء رفع صورة فقط.');
      event.target.value = '';
      return;
    }

    if (file.size > MAX_RECEIPT_SIZE_BYTES) {
      setReceiptError('حجم الصورة كبير. الحد الأقصى 3MB.');
      event.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') setProofImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount === null) return;
    const ok = addExpense({
      title,
      amount,
      categoryId,
      note,
      proof: proofImage,
    });

    if (ok) {
      setToast('✅ تمت إضافة المصروف وتحديث اللوحة مباشرة.');
      setTimeout(() => router.push('/dashboard'), 900);
    }
  };

  return (
    <AppShell>
      <section className="space-y-4">
        <div className="card rounded-3xl border-0 bg-gradient-to-br from-indigo-500 to-violet-500 p-5 text-white shadow-[0_12px_40px_rgba(92,110,248,0.15)]">
          <h2 className="font-['Sora'] text-2xl font-bold">إضافة مصروف جديد</h2>
          <p className="mt-1 text-sm text-indigo-100">أدخل تفاصيل المصروف ليظهر مباشرة في لوحة التحكم.</p>
        </div>

        <section className="card mx-auto max-w-2xl p-6">
          <form className="space-y-3" onSubmit={onSubmit}>
            <input className="input" placeholder="عنوان المصروف" value={title} onChange={(e) => setTitle(e.target.value)} required />
            <input
              className="input"
              type="text"
              inputMode="decimal"
              placeholder="التكلفة (مثال: 12.50)"
              value={amountInput}
              onChange={(e) => setAmountInput(e.target.value)}
              onBlur={() => {
                const parsed = parsePositiveAmount(amountInput);
                if (parsed !== null) setAmountInput(parsed.toFixed(2));
              }}
              required
            />
            <select className="input" value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required>
              <option value="">اختر الفئة</option>
              {activeFamily.categories.map((cat) => (
                <option value={cat.id} key={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            <textarea className="input min-h-24" placeholder="ملاحظة (اختيارية)" value={note} onChange={(e) => setNote(e.target.value)} />

            <div className="space-y-2 rounded-2xl border border-dashed border-slate-200 p-3">
              <label className="block text-sm font-semibold text-slate-700" htmlFor="receipt">
                صورة مرجعية (اختياري - مثل الإيصال)
              </label>
              <input id="receipt" className="input" type="file" accept="image/*" onChange={onReceiptSelected} />
              <p className="text-xs text-slate-500">الأنواع المدعومة: صور فقط، بحد أقصى 3MB.</p>
              {receiptError && <p className="text-xs font-medium text-red-600">{receiptError}</p>}
              {proofImage && <img src={proofImage} alt="معاينة الإيصال" className="max-h-52 rounded-xl border border-slate-200 object-cover" />}
            </div>

            <button className="btn-primary w-full" type="submit" disabled={amount === null}>
              حفظ المصروف
            </button>
            {toast && <div className="rounded-xl border border-green-200 bg-green-50 p-3 text-green-700">{toast}</div>}
          </form>
        </section>
      </section>
    </AppShell>
  );
}
