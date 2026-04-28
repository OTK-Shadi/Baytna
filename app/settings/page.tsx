'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import AppShell from '@/components/AppShell';
import { useFamilyData } from '@/hooks/useFamilyData';

export default function SettingsPage() {
  const router = useRouter();
  const { ready, activeFamily, activeMember, leaveFamily } = useFamilyData();
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

  return (
    <AppShell>
      <section className="space-y-4">
        <div className="card p-5">
          <h2 className="text-2xl font-bold">الإعدادات</h2>
          <div className="mt-3 rounded-xl border border-slate-200 p-3">
            <p className="font-semibold">{profileName}</p>
            <p className="text-sm text-slate-500">{activeMember.role === 'admin' ? 'Admin' : 'Member'} · {activeFamily.familyName}</p>
          </div>
        </div>

        <div className="card p-4">
          <div className="settings-row">
            <span>Currency</span>
            <span className="settings-val">EGP 🇪🇬</span>
          </div>
          <div className="settings-row">
            <span>Notifications</span>
            <button className={`btn-secondary py-2 ${notifications ? 'bg-green-50 text-green-700' : ''}`} onClick={() => setNotifications((v) => !v)}>
              {notifications ? 'On ✓' : 'Off'}
            </button>
          </div>
          <div className="settings-row">
            <span>Budget Warnings</span>
            <button className={`btn-secondary py-2 ${warnings ? 'bg-green-50 text-green-700' : ''}`} onClick={() => setWarnings((v) => !v)}>
              {warnings ? 'On ✓' : 'Off'}
            </button>
          </div>
          <div className="settings-row">
            <span>Dark Mode</span>
            <button className={`btn-secondary py-2 ${darkMode ? 'bg-indigo-50 text-indigo-700' : ''}`} onClick={() => setDarkMode((v) => !v)}>
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
