import Link from 'next/link';
import { BarChart3, Home, PlusCircle, Settings, UsersRound, Wallet } from 'lucide-react';

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-slate-100 p-4 md:p-8">
      <div className="mx-auto w-full max-w-[420px] space-y-4 rounded-[36px] border border-slate-200 bg-white p-4 shadow-2xl">
        <nav className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4">
          <h1 className="text-lg font-bold text-slate-900">FamilyLedger</h1>
          <div className="flex flex-wrap gap-2 text-sm">
            <Link className="btn-secondary flex items-center gap-2 py-2" href="/">
              <Home size={16} /> الرئيسية
            </Link>
            <Link className="btn-secondary flex items-center gap-2 py-2" href="/dashboard">
              <Wallet size={16} /> لوحة التحكم
            </Link>
            <Link className="btn-secondary flex items-center gap-2 py-2" href="/analytics">
              <BarChart3 size={16} /> التحليلات
            </Link>
            <Link className="btn-secondary flex items-center gap-2 py-2" href="/family">
              <UsersRound size={16} /> العائلة
            </Link>
            <Link className="btn-secondary flex items-center gap-2 py-2" href="/settings">
              <Settings size={16} /> الإعدادات
            </Link>
            <Link className="btn-primary flex items-center gap-2 py-2" href="/expenses/new">
              <PlusCircle size={16} /> إضافة مصروف
            </Link>
          </div>
        </nav>
        {children}
      </div>
    </main>
  );
}
