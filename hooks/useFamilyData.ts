'use client';

import { useEffect, useMemo, useState } from 'react';
import { DB_KEY } from '@/lib/constants';
import { generateId, generateInviteCode } from '@/lib/utils';
import { Category, Expense, Family, FamilyDB, Member } from '@/types/family';

const initialDB: FamilyDB = { families: {}, session: {} };

export function useFamilyData() {
  const [db, setDb] = useState<FamilyDB>(initialDB);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem(DB_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as FamilyDB;
      const normalizedFamilies = Object.fromEntries(
        Object.entries(parsed.families).map(([id, family]) => [
          id,
          { ...family, currency: family.currency || 'JOD' },
        ]),
      );
      setDb({ ...parsed, families: normalizedFamilies });
    }
    setReady(true);
  }, []);

  const persist = (next: FamilyDB) => {
    setDb(next);
    localStorage.setItem(DB_KEY, JSON.stringify(next));
  };

  const activeFamily = useMemo(() => {
    const id = db.session.activeFamilyId;
    return id ? db.families[id] : undefined;
  }, [db]);

  const activeMember = useMemo(() => {
    if (!activeFamily || !db.session.activeMemberId) return undefined;
    return activeFamily.members.find((m) => m.id === db.session.activeMemberId);
  }, [db.session.activeMemberId, activeFamily]);

  const createFamily = (payload: {
    adminName: string;
    familyName: string;
    currency: string;
    monthlyBudget: number;
    categories: { name: string; limit: number }[];
  }) => {
    const familyId = generateId('family');
    const adminId = generateId('member');
    const now = new Date().toISOString();

    const members: Member[] = [{ id: adminId, name: payload.adminName, role: 'admin', joinedAt: now }];
    const categories: Category[] = payload.categories.map((c) => ({ id: generateId('cat'), name: c.name, limit: c.limit }));

    const family: Family = {
      id: familyId,
      familyName: payload.familyName,
      currency: payload.currency || 'JOD',
      monthlyBudget: payload.monthlyBudget,
      inviteCode: generateInviteCode(),
      createdAt: now,
      members,
      categories,
      expenses: [],
    };

    const next: FamilyDB = {
      families: { ...db.families, [familyId]: family },
      session: { activeFamilyId: familyId, activeMemberId: adminId },
    };

    persist(next);
    return family;
  };

  const joinFamily = (memberName: string, inviteCode: string) => {
    const normalizedMemberName = memberName.trim();
    const normalizedInviteCode = inviteCode.trim().toUpperCase();

    if (normalizedMemberName.length < 2) {
      return { ok: false as const, message: 'يرجى إدخال اسم لا يقل عن حرفين.' };
    }

    if (normalizedInviteCode.length < 4) {
      return { ok: false as const, message: 'يرجى إدخال كود دعوة صحيح (4 أحرف على الأقل).' };
    }

    const found = Object.values(db.families).find((f) => f.inviteCode.trim().toUpperCase() === normalizedInviteCode);
    if (!found) return { ok: false as const, message: 'كود الدعوة غير صحيح.' };

    const newMember: Member = {
      id: generateId('member'),
      name: normalizedMemberName,
      role: 'member',
      joinedAt: new Date().toISOString(),
    };

    const updatedFamily: Family = { ...found, members: [...found.members, newMember] };
    const next: FamilyDB = {
      families: { ...db.families, [found.id]: updatedFamily },
      session: { activeFamilyId: found.id, activeMemberId: newMember.id },
    };

    persist(next);
    return { ok: true as const, family: updatedFamily };
  };

  const regenerateInviteCode = () => {
    if (!activeFamily) return null;
    const updatedFamily: Family = { ...activeFamily, inviteCode: generateInviteCode() };
    const next: FamilyDB = { ...db, families: { ...db.families, [activeFamily.id]: updatedFamily } };
    persist(next);
    return updatedFamily.inviteCode;
  };

  const leaveFamily = () => {
    persist({ ...db, session: {} });
  };

  const updateFamilyCurrency = (currency: string) => {
    if (!activeFamily) return false;
    const updatedFamily: Family = { ...activeFamily, currency };
    persist({ ...db, families: { ...db.families, [activeFamily.id]: updatedFamily } });
    return true;
  };

  const addExpense = (payload: Omit<Expense, 'id' | 'createdAt' | 'memberId'>) => {
    if (!activeFamily || !db.session.activeMemberId) return false;
    const expense: Expense = {
      ...payload,
      id: generateId('exp'),
      memberId: db.session.activeMemberId,
      createdAt: new Date().toISOString(),
    };

    const updatedFamily: Family = { ...activeFamily, expenses: [expense, ...activeFamily.expenses] };
    const next: FamilyDB = { ...db, families: { ...db.families, [activeFamily.id]: updatedFamily } };
    persist(next);
    return true;
  };

  const deleteExpense = (expenseId: string) => {
    if (!activeFamily) return false;
    const updatedFamily: Family = {
      ...activeFamily,
      expenses: activeFamily.expenses.filter((e) => e.id !== expenseId),
    };
    persist({ ...db, families: { ...db.families, [activeFamily.id]: updatedFamily } });
    return true;
  };

  const getFilteredExpenses = (filters?: { memberId?: string; categoryId?: string }) => {
    if (!activeFamily) return [];
    return activeFamily.expenses.filter((expense) => {
      const memberMatch = filters?.memberId ? expense.memberId === filters.memberId : true;
      const categoryMatch = filters?.categoryId ? expense.categoryId === filters.categoryId : true;
      return memberMatch && categoryMatch;
    });
  };

  return {
    ready,
    db,
    activeFamily,
    activeMember,
    createFamily,
    joinFamily,
    regenerateInviteCode,
    leaveFamily,
    updateFamilyCurrency,
    addExpense,
    deleteExpense,
    getFilteredExpenses,
  };
}
