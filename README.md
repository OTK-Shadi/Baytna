# Baytna 💙
### FamilySpend Intelligence — Hackathon MVP

> **Project in one sentence:**
> A smart family budgeting app that helps all household members track spending together, see what remains, and avoid budget surprises before month-end.

---

## Why this project matters

In many families, spending is tracked in a fragmented way across different people, with no single real-time view.

**Baytna** solves this by offering:
- One shared monthly budget.
- Fast expense logging by each member.
- Smart alerts before things become risky.
- A clean, Arabic-first dashboard experience.

## Problem statement

- No unified visibility into household spending.
- Budget overruns are often discovered too late.
- Hard to identify which category is consuming the most (food, entertainment, transport, etc.).

## Our solution

**Baytna** provides a simple and fast workflow:
1. Admin creates a family and sets the monthly budget and categories.
2. Admin receives an invite code and shares it.
3. Members join and add expenses in seconds.
4. The app analyzes spending in real time and shows smart alerts.

---

## Core features

- ✅ Clear onboarding for admin and members.
- ✅ Invite code-based family joining.
- ✅ Add expense (title, amount, category, optional note, optional proof).
- ✅ Smart dashboard showing:
  - Remaining budget
  - Usage percentage
  - Top spenders
  - Category spending distribution
- ✅ Smart alerts (budget overrun, high spending pace, category limit exceedance, etc.).
- ✅ Extra analytics in the Analytics page.
- ✅ Fully local storage without backend (great for hackathon demos).

## 1-minute user journey

### 1) Admin
- Enters name, family name, and monthly budget.
- Selects categories and their limits.
- Gets an invite code.

### 2) Member
- Enters name + invite code.
- Joins the family instantly.

### 3) Daily use
- Any member adds a new expense.
- Dashboard updates immediately.
- Alerts and lightweight recommendations appear.

---

## App routes

- `/` Home page.
- `/admin/onboarding` Admin setup.
- `/join` Member join page.
- `/dashboard` Main dashboard.
- `/expenses/new` Add new expense.
- `/expenses` View all expenses.
- `/analytics` Analytics page.
- `/family` Family members view.
- `/settings` Settings and local data reset.

## Financial intelligence in the app

The app calculates automatically:
- Total spending.
- Remaining budget.
- Current budget usage percentage.
- Warning signals for high spending pace or limit breaches.
- Early prediction for possible budget depletion before month-end.
- Smart chart-based analytics that show where money went by month-end, top-spending categories, and weekly spending trend.

---

## Tech stack

- **Next.js (App Router)**
- **TypeScript**
- **Tailwind CSS**
- **Recharts**
- **Lucide React**
- **localStorage** (primary key: `family_db`)

## Why this technical approach?

- Fast setup with minimal overhead.
- Excellent fit for hackathon demo constraints.
- Smooth user experience with a clean interface.

---

## Run locally

```bash
npm install
npm run dev
```

Then open:

```text
http://localhost:3000
```

## Recommended commands before final demo

```bash
npm run lint
npm run build
npm run start
```

---

## Notes for judges

- This version is a **hackathon MVP** focused on idea clarity, value, and smooth UX.
- Storage is local via `localStorage` for easy offline/quick demos.
- The proof field does not upload real files in this MVP (text/placeholder only).
- UX content is designed for Arabic-speaking users.

## Post-hackathon roadmap

- Cloud sync and account-based access.
- Smarter behavior-based spending alerts.
- Monthly saving goals with automatic recommendations.
- Multi-currency support and PDF reports.

---

## Tagline

**"Baytna helps families spend wisely before the budget runs out."**
