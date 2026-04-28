'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import AppShell from '@/components/AppShell';
import { useFamilyData } from '@/hooks/useFamilyData';

const CATEGORY_TEMPLATES = [
  { name: 'الطعام', emoji: '🍔', limit: 2500 },
  { name: 'المواصلات', emoji: '🚗', limit: 1200 },
  { name: 'الفواتير', emoji: '💡', limit: 1000 },
  { name: 'الصحة', emoji: '🏥', limit: 1000 },
  { name: 'التعليم', emoji: '📚', limit: 1500 },
  { name: 'التسوق', emoji: '🛍️', limit: 1200 },
  { name: 'الترفيه', emoji: '🎮', limit: 800 },
  { name: 'السفر', emoji: '✈️', limit: 1800 },
  { name: 'الإيجار', emoji: '🏠', limit: 5000 },
  { name: 'البقالة', emoji: '🛒', limit: 2200 },
  { name: 'الملابس', emoji: '👕', limit: 900 },
  { name: 'الاشتراكات', emoji: '📱', limit: 600 },
  { name: 'الادخار', emoji: '🏦', limit: 1200 },
  { name: 'الهدايا', emoji: '🎁', limit: 500 },
  { name: 'أخرى', emoji: '➕', limit: 500 },
];

export default function AdminOnboardingPage() {
  const router = useRouter();
  const { ready, createFamily } = useFamilyData();
  const [step, setStep] = useState(1);
  const [adminName, setAdminName] = useState('');
  const [familyName, setFamilyName] = useState('');
  const [monthlyBudget, setMonthlyBudget] = useState(12000);
  const [customCategory, setCustomCategory] = useState('');
  const [customEmoji, setCustomEmoji] = useState('');
  const [categories, setCategories] = useState(CATEGORY_TEMPLATES);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    CATEGORY_TEMPLATES.slice(0, 3).map((c) => c.name),
  );
  const [inviteCode, setInviteCode] = useState('');

  const canStep1 = adminName.trim() && familyName.trim() && monthlyBudget > 0;
  const chosenCategories = useMemo(
    () => categories.filter((c) => selectedCategories.includes(c.name)),
    [categories, selectedCategories],
  );
  const canCreate = useMemo(
    () => chosenCategories.length > 0 && chosenCategories.every((c) => c.name.trim() && c.limit > 0),
    [chosenCategories],
  );

  if (!ready) return null;

  const updateLimit = (index: number, value: number) => {
    setCategories((prev) => prev.map((cat, i) => (i === index ? { ...cat, limit: value } : cat)));
  };

  const addCustom = () => {
    if (!customCategory.trim()) return;
    const nextName = customCategory.trim();
    if (categories.some((category) => category.name === nextName)) return;

    const nextCategory = {
      name: nextName,
      emoji: customEmoji.trim() || '😀',
      limit: 500,
    };
    setCategories((prev) => [...prev, nextCategory]);
    setSelectedCategories((prev) => [...prev, nextName]);
    setCustomCategory('');
    setCustomEmoji('');
  };

  const toggleCategory = (name: string) => {
    setSelectedCategories((prev) =>
      prev.includes(name) ? prev.filter((catName) => catName !== name) : [...prev, name],
    );
  };

  const handleCreate = () => {
    const family = createFamily({
      adminName,
      familyName,
      monthlyBudget,
      categories: chosenCategories,
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
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
              {categories.map((cat, idx) => (
                <div
                  key={`${cat.name}-${idx}`}
                  role="button"
                  tabIndex={0}
                  onClick={() => toggleCategory(cat.name)}
                  onKeyDown={(e) => e.key === 'Enter' && toggleCategory(cat.name)}
                  className={`category-tile ${selectedCategories.includes(cat.name) ? 'category-tile-selected' : ''}`}
                >
                  <span className="text-3xl">{cat.emoji}</span>
                  <span className="font-semibold">{cat.name}</span>
                </div>
              ))}
            </div>

            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">إضافة فئة مخصصة</p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-[84px_1fr_auto]">
              <input className="input text-center" placeholder="😀" value={customEmoji} maxLength={2} onChange={(e) => setCustomEmoji(e.target.value)} />
              <input className="input" placeholder="إضافة فئة مخصصة" value={customCategory} onChange={(e) => setCustomCategory(e.target.value)} />
              <button className="btn-secondary" onClick={addCustom}>
                إضافة
              </button>
            </div>

            <div className="space-y-2 rounded-2xl border border-sky-100 bg-sky-50/70 p-4">
              <p className="text-sm font-semibold text-slate-700">حدود الميزانية للفئات المختارة</p>
              {chosenCategories.map((cat) => {
                const index = categories.findIndex((item) => item.name === cat.name);
                return (
                  <div key={cat.name} className="grid grid-cols-[1fr_auto] items-center gap-2 rounded-xl bg-white p-2">
                    <p className="text-sm font-medium text-slate-700">
                      {cat.emoji} {cat.name}
                    </p>
                    <input
                      className="w-28 rounded-xl border border-sky-200 bg-white px-3 py-2 text-sm outline-none ring-sky-300 transition focus:ring-2"
                      type="number"
                      value={cat.limit}
                      onChange={(e) => updateLimit(index, Number(e.target.value))}
                    />
                  </div>
                );
              })}
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
