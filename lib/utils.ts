import { Expense, Family, Member } from '@/types/family';

export const formatCurrency = (value: number, currency = 'JOD') =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(value);

export const daysPassedInMonth = (date = new Date()) => date.getDate();

export const daysInCurrentMonth = (date = new Date()) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

export const getTotalSpent = (expenses: Expense[]) => expenses.reduce((sum, expense) => sum + expense.amount, 0);

export const getTopSpender = (members: Member[], expenses: Expense[]) => {
  const spendMap = expenses.reduce<Record<string, number>>((acc, exp) => {
    acc[exp.memberId] = (acc[exp.memberId] || 0) + exp.amount;
    return acc;
  }, {});

  const sorted = members
    .map((m) => ({ member: m, total: spendMap[m.id] || 0 }))
    .sort((a, b) => b.total - a.total);

  return sorted[0] || null;
};

export const buildInsights = (family: Family) => {
  const totalSpent = getTotalSpent(family.expenses);
  const remaining = family.monthlyBudget - totalSpent;
  const passedDays = Math.max(daysPassedInMonth(), 1);
  const totalDays = Math.max(daysInCurrentMonth(), 1);
  const daysLeftInMonth = Math.max(totalDays - passedDays, 0);
  const dailyBurnRate = totalSpent / passedDays;
  const predictedDaysLeft = dailyBurnRate > 0 ? remaining / dailyBurnRate : Infinity;
  const plannedSpendByToday = (family.monthlyBudget / totalDays) * passedDays;
  const disciplineRatio = plannedSpendByToday > 0 ? totalSpent / plannedSpendByToday : 0;
  const disciplineScore = Math.max(0, 100 - Math.max(disciplineRatio - 1, 0) * 100);
  const projectedDepletionDate =
    dailyBurnRate > 0 && remaining > 0
      ? new Date(new Date().getFullYear(), new Date().getMonth(), Math.ceil(daysPassedInMonth() + predictedDaysLeft))
      : null;

  const categorySpend = family.categories.map((cat) => {
    const spent = family.expenses.filter((e) => e.categoryId === cat.id).reduce((s, e) => s + e.amount, 0);
    return { ...cat, spent };
  });

  const alerts: string[] = [];

  categorySpend.forEach((cat) => {
    const usage = cat.limit > 0 ? (cat.spent / cat.limit) * 100 : 0;
    if (usage >= 90 && usage < 100) {
      alerts.push(`تنبيه: فئة "${cat.name}" وصلت إلى ${usage.toFixed(0)}% من الحد.`);
    }
    if (usage >= 100) {
      alerts.push(`تجاوز: فئة "${cat.name}" تخطت الحد المحدد.`);
    }
  });

  if (dailyBurnRate > 0 && predictedDaysLeft < daysLeftInMonth) {
    alerts.push(`معدل الصرف الحالي مرتفع، الميزانية قد تنفد خلال ${Math.max(Math.floor(predictedDaysLeft), 0)} أيام.`);
  }

  return {
    totalSpent,
    remaining,
    dailyBurnRate,
    predictedDaysLeft,
    daysLeftInMonth,
    plannedSpendByToday,
    disciplineRatio,
    disciplineScore,
    projectedDepletionDate,
    categorySpend,
    alerts,
  };
};

export const generateId = (prefix: string) => `${prefix}_${Math.random().toString(36).slice(2, 10)}`;

export const generateInviteCode = () => Math.random().toString(36).slice(2, 8).toUpperCase();
