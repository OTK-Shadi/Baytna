'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AppShell from '@/components/AppShell';
import { useFamilyData } from '@/hooks/useFamilyData';

export default function JoinPage() {
  const { ready, joinFamily } = useFamilyData();
  const router = useRouter();
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  if (!ready) return null;

  const handleJoin = () => {
    const result = joinFamily(name, code);
    if (!result.ok) {
      setError(result.message);
      return;
    }
    router.push('/dashboard');
  };

  return (
    <AppShell>
      <section className="card mx-auto max-w-2xl p-6 md:p-8">
        <h2 className="text-2xl font-bold">الانضمام إلى العائلة</h2>
        <div className="mt-5 space-y-3">
          <input className="input" placeholder="اسمك" value={name} onChange={(e) => setName(e.target.value)} />
          <input className="input" placeholder="كود الدعوة" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} />
          {error && <p className="rounded-xl bg-red-50 p-3 text-red-700">{error}</p>}
          <button className="btn-primary" onClick={handleJoin}>
            دخول لوحة العائلة
          </button>
        </div>
      </section>
    </AppShell>
  );
}
