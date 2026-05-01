import { Expense, Family, InsightAlert, Member } from '@/types/family';

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

const sortAndTrimAlerts = (alerts: InsightAlert[], maxAlerts = 5) =>
  alerts
    .sort((a, b) => a.priority - b.priority || a.message.localeCompare(b.message))
    .slice(0, maxAlerts);

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

  const alerts: InsightAlert[] = [];
  const budget = Math.max(family.monthlyBudget, 0);

  if (budget > 0 && totalSpent > budget) {
    alerts.push({
      priority: 1,
      tone: 'danger',
      emoji: '🚨',
      message: `تجاوزت الميزانية الشهرية بمقدار ${formatCurrency(totalSpent - budget, family.currency)}.`,
    });
  }

  if (budget > 0) {
    const monthProgress = passedDays / totalDays;
    const spendRatio = totalSpent / budget;
    if (monthProgress >= 0.5 && spendRatio >= 0.55) {
      alerts.push({
        priority: 2,
        tone: 'warning',
        emoji: '⚠️',
        message: `منتصف الشهر وصل والإنفاق بلغ ${(spendRatio * 100).toFixed(0)}% من الميزانية.`,
      });
    }
  }

  const topCategoryByBudget =
    budget > 0
      ? categorySpend
          .map((cat) => ({ ...cat, share: cat.spent / budget }))
          .sort((a, b) => b.share - a.share)[0]
      : null;

  if (budget > 0 && totalSpent >= budget * 0.8) {
    alerts.push({
      priority: 3,
      tone: 'warning',
      emoji: '🟠',
      message: `وصل الإنفاق إلى ${(totalSpent / budget * 100).toFixed(0)}% من الميزانية الشهرية.`,
    });
  }

  if (topCategoryByBudget && topCategoryByBudget.share >= 0.4) {
    alerts.push({
      priority: 4,
      tone: 'warning',
      emoji: '🟠',
      message: `فئة "${topCategoryByBudget.name}" تستهلك ${(topCategoryByBudget.share * 100).toFixed(0)}% من الميزانية.`,
    });
  }

  categorySpend.forEach((cat) => {
    if (cat.limit > 0 && cat.spent > cat.limit) {
      alerts.push({
        priority: 5,
        tone: 'danger',
        emoji: '⛔',
        message: `فئة "${cat.name}" تجاوزت الحد بمقدار ${formatCurrency(cat.spent - cat.limit, family.currency)}.`,
      });
    }
  });

  const last30Days = 30;
  const now = new Date();
  const startWindow = new Date(now);
  startWindow.setDate(now.getDate() - last30Days + 1);
  const monthlyWindowTotal = family.expenses
    .filter((expense) => {
      const expenseDate = new Date(expense.createdAt);
      return expenseDate >= startWindow && expenseDate <= now;
    })
    .reduce((sum, expense) => sum + expense.amount, 0);
  const avgSpendPerWeek = monthlyWindowTotal / 4;
  const projectedMonthlySpend = avgSpendPerWeek * 4;
  const warningThreshold = budget + budget * 0.15;
  const weeklyTone =
    budget <= 0
      ? 'warning'
      : projectedMonthlySpend <= budget
        ? 'success'
        : projectedMonthlySpend <= warningThreshold
          ? 'warning'
          : 'danger';
  const weeklyEmoji = weeklyTone === 'success' ? '✅' : weeklyTone === 'warning' ? '⚠️' : '🚨';

  alerts.push({
    priority: 6,
    tone: weeklyTone,
    emoji: weeklyEmoji,
    message: `متوسط الصرف الأسبوعي (آخر 30 يوم): ${formatCurrency(avgSpendPerWeek, family.currency)}. التقدير الشهري: ${formatCurrency(projectedMonthlySpend, family.currency)}.`,
  });

  const todayKey = now.toISOString().slice(0, 10);
  const hasExpenseToday = family.expenses.some((expense) => expense.createdAt.slice(0, 10) === todayKey);
  if (!hasExpenseToday) {
    alerts.push({
      priority: 7,
      tone: 'success',
      emoji: '✅',
      message: 'لا توجد مصروفات مسجلة اليوم حتى الآن.',
    });
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
    avgSpendPerWeek,
    alerts: sortAndTrimAlerts(alerts),
  };
};

export const generateId = (prefix: string) => `${prefix}_${Math.random().toString(36).slice(2, 10)}`;

export const generateInviteCode = () => Math.random().toString(36).slice(2, 8).toUpperCase();
