import Link from 'next/link';
import { ArrowLeft, UserPlus, UsersRound } from 'lucide-react';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-sky-100 to-white p-6">
      <section className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">
        <div className="card p-8 md:col-span-2">
          <h1 className="text-3xl font-extrabold text-navy">ذكاء مصروف العائلة</h1>
          <p className="mt-3 text-sky-900">
            منصة عربية أنيقة لإدارة ميزانية الأسرة، مراقبة الإنفاق، والحصول على تنبيهات ذكية قبل نفاد الميزانية.
          </p>
        </div>

        <Link href="/admin/onboarding" className="card group p-8 transition hover:-translate-y-1">
          <UsersRound className="text-sky-600" size={36} />
          <h2 className="mt-4 text-2xl font-bold">إنشاء عائلة (مدير)</h2>
          <p className="mt-2 text-sky-900">ابدأ إعداد الميزانية والفئات وأنشئ كود دعوة خاص بالعائلة.</p>
          <span className="mt-6 inline-flex items-center gap-2 text-sky-700">ابدأ الآن <ArrowLeft size={16} /></span>
        </Link>

        <Link href="/join" className="card group p-8 transition hover:-translate-y-1">
          <UserPlus className="text-sky-600" size={36} />
          <h2 className="mt-4 text-2xl font-bold">الانضمام إلى عائلة (عضو)</h2>
          <p className="mt-2 text-sky-900">أدخل اسمك وكود الدعوة للوصول إلى لوحة العائلة المشتركة.</p>
          <span className="mt-6 inline-flex items-center gap-2 text-sky-700">انضم الآن <ArrowLeft size={16} /></span>
        </Link>
      </section>
    </main>
  );
}
