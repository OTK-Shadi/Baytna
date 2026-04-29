'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart3, LayoutDashboard, PlusCircle, Settings, UsersRound } from 'lucide-react';
import BottomNav from '@/components/BottomNav';

const desktopNav = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/family', label: 'Family', icon: UsersRound },
  { href: '/analytics', label: 'Budget', icon: BarChart3 },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <main className="min-h-screen bg-slate-100 p-3 pb-24 md:p-6 lg:p-8">
      <div className="mx-auto w-full max-w-7xl space-y-5 rounded-3xl border border-slate-200 bg-white/90 p-4 shadow-xl backdrop-blur md:p-6 lg:p-8">
        <nav className="hidden items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-4 md:flex" aria-label="Primary">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 text-white shadow-md">
              <span className="text-base font-black">FL</span>
            </div>
            <div>
              <h1 className="text-lg font-extrabold tracking-tight text-slate-900 md:text-xl">Family Ledger</h1>
              <p className="text-xs font-medium text-slate-500">Smart family budgeting, all in one place</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-sm">
            {desktopNav.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 font-semibold transition ${
                    active
                      ? 'border-indigo-200 bg-indigo-50 text-indigo-700 shadow-sm'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                  aria-current={active ? 'page' : undefined}
                >
                  <Icon size={16} /> {item.label}
                </Link>
              );
            })}

            <Link className="btn-primary flex items-center gap-2 py-2.5" href="/expenses/new">
              <PlusCircle size={16} /> Add Expense
            </Link>
          </div>
        </nav>
        {children}
      </div>
      <Link
        href="/expenses/new"
        className="fixed bottom-20 right-4 z-50 flex items-center gap-2 rounded-full bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-500 md:hidden"
      >
        <PlusCircle size={18} /> Add Expense
      </Link>
      <BottomNav />
    </main>
  );
}
