'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import AppShell from '@/components/AppShell';
import { useFamilyData } from '@/hooks/useFamilyData';

export default function SettingsPage() {
  const router = useRouter();
  const { ready, activeFamily, activeMember, leaveFamily, updateFamilyCurrency } = useFamilyData();
  const [notifications, setNotifications] = useState(true);
  const [warnings, setWarnings] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const profileName = useMemo(() => activeMember?.name ?? '-', [activeMember]);

  if (!ready) return null;

  if (!activeFamily || !activeMember) {
    return (
      <AppShell>
        <section className="card p-6 text-center">لا توجد إعدادات متاحة بدون عائلة نشطة.</section>
      </AppShell>
    );
  }

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
            <p className="text-sm text-indigo-100">{activeMember.role === 'admin' ? 'Admin' : 'Member'} · {activeFamily.familyName}</p>
          </div>
        </div>

        <div className="card p-4">
          <div className="settings-row">
            <span className="font-['Sora']">Currency</span>
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
            <span className="font-['Sora']">Notifications</span>
            <button className={toggleClass(notifications)} onClick={() => setNotifications((v) => !v)}>
              {notifications ? 'On ✓' : 'Off'}
            </button>
          </div>
          <div className="settings-row">
            <span className="font-['Sora']">Budget Warnings</span>
            <button className={toggleClass(warnings)} onClick={() => setWarnings((v) => !v)}>
              {warnings ? 'On ✓' : 'Off'}
            </button>
          </div>
          <div className="settings-row">
            <span className="font-['Sora']">Dark Mode</span>
            <button className={toggleClass(darkMode)} onClick={() => setDarkMode((v) => !v)}>
              {darkMode ? 'Enabled' : 'Disabled'}
            </button>
          </div>
        </div>

        <button className="btn-secondary w-full border-red-200 text-red-600" onClick={onLeave}>
          Leave Family
        </button>
      </section>
    </AppShell>
  );
}
