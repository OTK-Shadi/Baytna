'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart3, LayoutDashboard, PlusCircle, Settings, UsersRound } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import { useFamilyData } from '@/hooks/useFamilyData';

const desktopNav = [
  { href: '/dashboard', label: 'لوحة التحكم', icon: LayoutDashboard },
  { href: '/family', label: 'العائلة', icon: UsersRound },
  { href: '/analytics', label: 'التحليلات', icon: BarChart3 },
  { href: '/settings', label: 'الإعدادات', icon: Settings },
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { activeMember } = useFamilyData();
  const currentUserLabel = activeMember ? `مسجل الدخول: ${activeMember.name}` : 'غير مسجل الدخول';

  return (
    <main className="min-h-screen bg-slate-100 p-3 pb-24 md:p-6 lg:p-8" dir="rtl">
      <div className="mx-auto w-full rounded-3xl border border-slate-200 bg-white/90 p-4 shadow-xl backdrop-blur md:p-6 lg:p-8">
        <div className="mx-auto w-full max-w-7xl space-y-4 px-0 md:px-6 lg:px-8">
          <header className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 md:hidden">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 overflow-hidden rounded-full border border-indigo-100 bg-indigo-50">
                <Image src="/images/baytna-logo.png" alt="شعار بيتنا" width={40} height={40} className="h-full w-full object-cover" priority />
              </div>
              <div>
                <h1 className="text-sm font-extrabold text-slate-900">بيتنا</h1>
                <p className="text-[11px] text-slate-500">إدارة المصروف العائلي</p>
              </div>
            </div>
            <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">{currentUserLabel}</span>
          </header>

          <nav className="hidden flex-wrap items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 md:flex md:justify-between">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 overflow-hidden rounded-full border border-indigo-100 bg-indigo-50">
                <Image src="/images/baytna-logo.png" alt="شعار بيتنا" width={48} height={48} className="h-full w-full object-cover" />
              </div>
              <div>
                <h1 className="text-lg font-extrabold text-slate-900 md:text-xl">بيتنا</h1>
                <p className="text-xs text-slate-500">مساحة العائلة المالية</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-sm md:me-auto">
              {desktopNav.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <Link
                    key={item.href}
                    className={`btn-secondary flex items-center gap-2 py-2 ${active ? 'border-indigo-200 bg-indigo-50 text-indigo-700' : ''}`}
                    href={item.href}
                  >
                    <Icon size={16} /> {item.label}
                  </Link>
                );
              })}
              {activeMember ? (
                <Link className="btn-primary flex items-center gap-2 py-2" href="/expenses/new">
                  <PlusCircle size={16} /> إضافة مصروف
                </Link>
              ) : null}
            </div>
            <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">{currentUserLabel}</span>
          </nav>
          {children}
        </div>
      </div>
      <BottomNav isLoggedIn={Boolean(activeMember)} />
    </main>
  );
}
