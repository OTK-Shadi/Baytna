import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, UserPlus, UsersRound } from 'lucide-react';

export default function HomePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 p-6" dir="rtl">
      <section className="w-full max-w-[420px] rounded-[36px] border border-slate-200 bg-white p-8 text-center shadow-2xl">
        <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-indigo-50">
          <Image src="/images/baytna-logo.png" alt="شعار Baytna - بيتنا" width={96} height={96} className="h-full w-full object-cover" priority />
        </div>
        <h1 className="text-4xl font-extrabold leading-tight text-slate-900">
          Baytna - بيتنا
        </h1>
        <p className="mt-3 text-slate-600">
          نظّموا المصاريف المشتركة، احصلوا على تحليلات ذكية، وابقوا ميزانية العائلة تحت السيطرة — معًا.
        </p>

        <div className="mt-8 space-y-3 text-right">
          <Link href="/admin/onboarding" className="btn-primary flex w-full items-center justify-center gap-2">
            <ArrowLeft size={16} /> إنشاء عائلة <UsersRound size={18} />
          </Link>

          <Link href="/join" className="btn-secondary flex w-full items-center justify-center gap-2">
            <ArrowLeft size={16} /> الانضمام إلى عائلة <UserPlus size={18} />
          </Link>
        </div>
      </section>
    </main>
  );
}
