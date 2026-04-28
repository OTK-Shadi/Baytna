import Link from 'next/link';
import { Home, PlusCircle, Wallet } from 'lucide-react';

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-gradient-to-b from-sky-50 to-white p-4 md:p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <nav className="card flex flex-wrap items-center justify-between gap-3 p-4">
          <h1 className="text-xl font-bold text-navy">FamilySpend Intelligence</h1>
          <div className="flex gap-2 text-sm">
            <Link className="btn-secondary flex items-center gap-2 py-2" href="/">
              <Home size={16} /> الرئيسية
            </Link>
            <Link className="btn-secondary flex items-center gap-2 py-2" href="/dashboard">
              <Wallet size={16} /> لوحة التحكم
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
