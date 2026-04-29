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
  const isNameValid = name.trim().length >= 2;
  const isCodeValid = code.trim().length >= 4;
  const isFormValid = isNameValid && isCodeValid;
  const validationMessage = !isNameValid
    ? 'يرجى إدخال اسم لا يقل عن حرفين.'
    : !isCodeValid
      ? 'يرجى إدخال كود دعوة صحيح (4 أحرف على الأقل).'
      : '';

  if (!ready) return null;

  const handleJoin = () => {
    if (!isFormValid) {
      setError(validationMessage);
      return;
    }
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
          <input
            className="input"
            placeholder="اسمك"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setError('');
            }}
          />
          <input
            className="input"
            placeholder="كود الدعوة"
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              setError('');
            }}
          />
          {!isFormValid && <p className="rounded-xl bg-amber-50 p-3 text-amber-800">{validationMessage}</p>}
          {error && <p className="rounded-xl bg-red-50 p-3 text-red-700">{error}</p>}
          <button className="btn-primary disabled:cursor-not-allowed disabled:opacity-60" onClick={handleJoin} disabled={!isFormValid}>
            دخول لوحة العائلة
          </button>
        </div>
      </section>
    </AppShell>
  );
}
