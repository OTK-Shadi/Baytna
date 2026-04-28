'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import AppShell from '@/components/AppShell';
import { DEFAULT_CATEGORIES } from '@/lib/constants';
import { useFamilyData } from '@/hooks/useFamilyData';

export default function AdminOnboardingPage() {
  const router = useRouter();
  const { ready, createFamily } = useFamilyData();
  const [step, setStep] = useState(1);
  const [adminName, setAdminName] = useState('');
  const [familyName, setFamilyName] = useState('');
  const [monthlyBudget, setMonthlyBudget] = useState(12000);
  const [customCategory, setCustomCategory] = useState('');
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [inviteCode, setInviteCode] = useState('');

  const canStep1 = adminName.trim() && familyName.trim() && monthlyBudget > 0;
  const canCreate = useMemo(() => categories.length > 0 && categories.every((c) => c.name.trim() && c.limit > 0), [categories]);

  if (!ready) return null;

  const updateLimit = (index: number, value: number) => {
    setCategories((prev) => prev.map((cat, i) => (i === index ? { ...cat, limit: value } : cat)));
  };

  const addCustom = () => {
    if (!customCategory.trim()) return;
    setCategories((prev) => [...prev, { name: customCategory.trim(), limit: 500 }]);
    setCustomCategory('');
  };

  const handleCreate = () => {
    const family = createFamily({
      adminName,
      familyName,
      monthlyBudget,
      categories,
    });
    setInviteCode(family.inviteCode);
    setStep(3);
  };

  return (
    <AppShell>
      <section className="card p-6 md:p-8">
        <h2 className="text-2xl font-bold">إعداد المدير</h2>
        <p className="mt-1 text-sky-900">الخطوة {step} من 3</p>

        {step === 1 && (
          <div className="mt-6 space-y-4">
            <input className="input" placeholder="اسم المدير" value={adminName} onChange={(e) => setAdminName(e.target.value)} />
            <input className="input" placeholder="اسم العائلة/المجموعة" value={familyName} onChange={(e) => setFamilyName(e.target.value)} />
            <input
              className="input"
              type="number"
              placeholder="إجمالي ميزانية الشهر"
              value={monthlyBudget}
              onChange={(e) => setMonthlyBudget(Number(e.target.value))}
            />
            <button className="btn-primary" disabled={!canStep1} onClick={() => setStep(2)}>
              التالي
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="mt-6 space-y-4">
            {categories.map((cat, idx) => (
              <div key={`${cat.name}-${idx}`} className="grid grid-cols-1 gap-3 rounded-2xl bg-sky-50 p-4 md:grid-cols-2">
                <input className="input" value={cat.name} readOnly />
                <input className="input" type="number" value={cat.limit} onChange={(e) => updateLimit(idx, Number(e.target.value))} />
              </div>
            ))}

            <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_auto]">
              <input className="input" placeholder="إضافة فئة مخصصة" value={customCategory} onChange={(e) => setCustomCategory(e.target.value)} />
              <button className="btn-secondary" onClick={addCustom}>
                إضافة
              </button>
            </div>

            <div className="flex gap-3">
              <button className="btn-secondary" onClick={() => setStep(1)}>
                رجوع
              </button>
              <button className="btn-primary" disabled={!canCreate} onClick={handleCreate}>
                إنشاء العائلة
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="mt-6 space-y-4 text-center">
            <p className="text-lg">تم إنشاء العائلة بنجاح 🎉</p>
            <p className="text-sky-900">كود الدعوة الخاص بكم:</p>
            <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-sky-400 p-4 text-3xl font-black tracking-widest text-white">{inviteCode}</div>
            <button className="btn-primary" onClick={() => router.push('/dashboard')}>
              الانتقال إلى لوحة التحكم
            </button>
          </div>
        )}
      </section>
    </AppShell>
  );
}
