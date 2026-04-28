export type Role = 'admin' | 'member';

export interface Member {
  id: string;
  name: string;
  role: Role;
  joinedAt: string;
}

export interface Category {
  id: string;
  name: string;
  limit: number;
}

export interface Expense {
  id: string;
  title: string;
  amount: number;
  categoryId: string;
  note?: string;
  proof?: string;
  memberId: string;
  createdAt: string;
}

export interface Family {
  id: string;
  familyName: string;
  monthlyBudget: number;
  inviteCode: string;
  createdAt: string;
  members: Member[];
  categories: Category[];
  expenses: Expense[];
}

export interface FamilyDB {
  families: Record<string, Family>;
  session: {
    activeFamilyId?: string;
    activeMemberId?: string;
  };
}
