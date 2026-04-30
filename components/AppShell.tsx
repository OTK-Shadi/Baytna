'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart3, LayoutDashboard, PlusCircle, Settings, UsersRound } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import { useFamilyData } from '@/hooks/useFamilyData';

const desktopNav = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/family', label: 'Family', icon: UsersRound },
  { href: '/analytics', label: 'Budget', icon: BarChart3 },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { activeMember } = useFamilyData();
  const currentUserLabel = activeMember ? `Logged in: ${activeMember.name}` : 'Not logged in';

  return (
    <main className="min-h-screen bg-slate-100 p-3 pb-24 md:p-6 lg:p-8">
      <div className="mx-auto w-full rounded-3xl border border-slate-200 bg-white/90 p-4 shadow-xl backdrop-blur md:p-6 lg:p-8">
        <div className="mx-auto w-full max-w-7xl space-y-4 px-0 md:px-6 lg:px-8">
          <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 md:hidden">
            <h1 className="text-base font-bold text-slate-900">FamilyLedger</h1>
            <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
              {currentUserLabel}
            </span>
          </div>
          <nav className="hidden flex-wrap items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 md:flex md:justify-between">
            <h1 className="text-lg font-bold text-slate-900 md:text-xl">FamilyLedger</h1>
            <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
              {currentUserLabel}
            </span>
            <div className="flex flex-wrap gap-2 text-sm md:ms-auto">
              {desktopNav.map((item) => {
                const Icon = item.icon;
                return (
                  <Link key={item.href} className="btn-secondary flex items-center gap-2 py-2" href={item.href}>
                    <Icon size={16} /> {item.label}
                  </Link>
                );
              })}
              {activeMember ? (
                <Link className="btn-primary flex items-center gap-2 py-2" href="/expenses/new">
                  <PlusCircle size={16} /> Add Expense
                </Link>
              ) : null}
            </div>
          </nav>
          {children}
        </div>
      </div>
      <BottomNav isLoggedIn={Boolean(activeMember)} />
    </main>
  );
}
