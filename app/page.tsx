import Link from 'next/link';
import { ArrowLeft, UserPlus, UsersRound } from 'lucide-react';

export default function HomePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 p-6">
      <section className="w-full max-w-[420px] rounded-[36px] border border-slate-200 bg-white p-8 text-center shadow-2xl">
        <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-indigo-50 text-5xl">💰</div>
        <h1 className="text-4xl font-extrabold leading-tight text-slate-900">Family<br />Budgeting</h1>
        <p className="mt-3 text-slate-600">
          Track shared expenses, get smart insights, and keep your family&apos;s finances on track — together.
        </p>

        <div className="mt-8 space-y-3 text-start">
          <Link href="/admin/onboarding" className="btn-primary flex w-full items-center justify-center gap-2">
            <UsersRound size={18} /> Create a Family <ArrowLeft size={16} />
          </Link>

          <Link href="/join" className="btn-secondary flex w-full items-center justify-center gap-2">
            <UserPlus size={18} /> Join a Family <ArrowLeft size={16} />
          </Link>
        </div>
      </section>
    </main>
  );
}
