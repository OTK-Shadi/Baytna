'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import AppShell from '@/components/AppShell';
import { useFamilyData } from '@/hooks/useFamilyData';

export default function SettingsPage() {
  const router = useRouter();
  const {
    ready,
    activeFamily,
    activeMember,
    leaveFamily,
    updateFamilyCurrency,
    updateFamilyMonthlyBudget,
    addCategory,
    updateCategory,
    deleteCategory,
  } = useFamilyData();
  const [notifications, setNotifications] = useState(true);
  const [warnings, setWarnings] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [budgetInput, setBudgetInput] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryLimit, setNewCategoryLimit] = useState('500');

  const profileName = useMemo(() => activeMember?.name ?? '-', [activeMember]);
  const isAdmin = activeMember?.role === 'admin';

  if (!ready) return null;

  if (!activeFamily || !activeMember) {
    return (
      <AppShell>
        <section className="card p-6 text-center">لا توجد إعدادات متاحة بدون عائلة نشطة.</section>
      </AppShell>
    );
  }

  const parsePositiveAmount = (value: string) => {
    const parsed = Number(value.trim());
    if (!Number.isFinite(parsed) || parsed <= 0) return null;
    return Math.round(parsed * 100) / 100;
  };

  const onLeave = () => {
    leaveFamily();
    router.push('/');
  };

  const toggleClass = (active: boolean) =>
    `rounded-full px-4 py-2 text-xs font-semibold transition ${active ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'bg-slate-100 text-slate-500 border border-slate-200'}`;

  return (
    <AppShell>
      <section className="space-y-4">
        <div className="card rounded-3xl border-0 bg-gradient-to-br from-indigo-500 to-violet-500 p-5 text-white shadow-[0_12px_40px_rgba(92,110,248,0.15)]">
          <h2 className="font-['Sora'] text-2xl font-bold">الإعدادات</h2>
          <div className="mt-3 rounded-2xl border border-white/30 bg-white/10 p-3">
            <p className="font-semibold">{profileName}</p>
            <p className="text-sm text-indigo-100">{activeMember.role === 'admin' ? 'مدير' : 'عضو'} · {activeFamily.familyName}</p>
          </div>
        </div>

        <div className="card space-y-3 p-4">
          <div className="settings-row">
            <span className="font-['Sora']">العملة</span>
            <select
              className="rounded-lg border border-slate-200 px-2 py-1 text-sm"
              value={activeFamily.currency}
              onChange={(e) => updateFamilyCurrency(e.target.value)}
            >
              <option value="JOD">JOD 🇯🇴</option>
              <option value="USD">USD 🇺🇸</option>
              <option value="SAR">SAR 🇸🇦</option>
              <option value="AED">AED 🇦🇪</option>
              <option value="EGP">EGP 🇪🇬</option>
            </select>
          </div>
          <div className="settings-row">
            <span className="font-['Sora']">الإشعارات</span>
            <button className={toggleClass(notifications)} onClick={() => setNotifications((v) => !v)}>
              {notifications ? 'مفعلة ✓' : 'مغلقة'}
            </button>
          </div>
          <div className="settings-row">
            <span className="font-['Sora']">تنبيهات الميزانية</span>
            <button className={toggleClass(warnings)} onClick={() => setWarnings((v) => !v)}>
              {warnings ? 'مفعلة ✓' : 'مغلقة'}
            </button>
          </div>
          <div className="settings-row">
            <span className="font-['Sora']">الوضع الداكن</span>
            <button className={toggleClass(darkMode)} onClick={() => setDarkMode((v) => !v)}>
              {darkMode ? 'مفعل' : 'غير مفعل'}
            </button>
          </div>
        </div>

        {isAdmin && (
          <div className="card space-y-4 p-4 md:p-5">
            <h3 className="font-['Sora'] text-lg font-bold text-slate-800">إعدادات المدير</h3>

            <div className="space-y-2 rounded-2xl border border-sky-100 bg-sky-50/70 p-4">
              <p className="text-sm font-semibold text-slate-700">تعديل ميزانية العائلة</p>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_auto]">
                <input
                  className="input"
                  type="text"
                  inputMode="decimal"
                  placeholder={`الميزانية الحالية: ${activeFamily.monthlyBudget.toFixed(2)}`}
                  value={budgetInput}
                  onChange={(e) => setBudgetInput(e.target.value)}
                  onBlur={() => {
                    const parsed = parsePositiveAmount(budgetInput);
                    if (parsed !== null) setBudgetInput(parsed.toFixed(2));
                  }}
                />
                <button
                  className="btn-primary"
                  onClick={() => {
                    const parsed = parsePositiveAmount(budgetInput);
                    if (parsed === null) return;
                    if (updateFamilyMonthlyBudget(parsed)) setBudgetInput('');
                  }}
                >
                  حفظ الميزانية
                </button>
              </div>
            </div>

            <div className="space-y-2 rounded-2xl border border-sky-100 bg-sky-50/70 p-4">
              <p className="text-sm font-semibold text-slate-700">إضافة فئة جديدة</p>
              <div className="grid grid-cols-1 gap-2 md:grid-cols-[1fr_180px_auto]">
                <input
                  className="input"
                  placeholder="اسم الفئة"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                />
                <input
                  className="input"
                  type="text"
                  inputMode="decimal"
                  placeholder="حد الفئة"
                  value={newCategoryLimit}
                  onChange={(e) => setNewCategoryLimit(e.target.value)}
                />
                <button
                  className="btn-secondary"
                  onClick={() => {
                    const parsed = parsePositiveAmount(newCategoryLimit);
                    if (!newCategoryName.trim() || parsed === null) return;
                    if (addCategory(newCategoryName.trim(), parsed)) {
                      setNewCategoryName('');
                      setNewCategoryLimit('500');
                    }
                  }}
                >
                  إضافة
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-semibold text-slate-700">الفئات الحالية</p>
              <div className="space-y-2">
                {activeFamily.categories.map((category) => (
                  <div key={category.id} className="rounded-2xl border border-slate-200 bg-white p-3">
                    <div className="grid grid-cols-1 items-center gap-2 md:grid-cols-[1fr_180px_auto]">
                      <input
                        className="input"
                        defaultValue={category.name}
                        onBlur={(e) => {
                          const nextName = e.target.value.trim();
                          if (!nextName || nextName === category.name) return;
                          updateCategory(category.id, { name: nextName });
                        }}
                      />
                      <input
                        className="input"
                        type="text"
                        inputMode="decimal"
                        defaultValue={category.limit.toFixed(2)}
                        onBlur={(e) => {
                          const parsed = parsePositiveAmount(e.target.value);
                          if (parsed === null) return;
                          e.target.value = parsed.toFixed(2);
                          updateCategory(category.id, { limit: parsed });
                        }}
                      />
                      <button
                        className="btn-secondary border-red-200 text-red-600"
                        onClick={() => deleteCategory(category.id)}
                      >
                        حذف
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <button className="btn-secondary w-full border-red-200 text-red-600" onClick={onLeave}>
          مغادرة العائلة
        </button>
      </section>
    </AppShell>
  );
}
