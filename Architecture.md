# Architecture | Data Model and Local Storage

The app relies entirely on one `localStorage` key:

- **Key:** `family_db`

## JSON schema

```json
{
  "families": {
    "family_id": {
      "id": "family_id",
      "familyName": "Al-Noor Family",
      "monthlyBudget": 12000,
      "inviteCode": "AB12CD",
      "createdAt": "2026-04-28T10:00:00.000Z",
      "members": [
        {
          "id": "member_1",
          "name": "Sara",
          "role": "admin",
          "joinedAt": "2026-04-28T10:00:00.000Z"
        },
        {
          "id": "member_2",
          "name": "Ahmed",
          "role": "member",
          "joinedAt": "2026-04-28T11:00:00.000Z"
        }
      ],
      "categories": [
        {
          "id": "cat_food",
          "name": "Food",
          "limit": 3000
        },
        {
          "id": "cat_rent",
          "name": "Rent",
          "limit": 5000
        }
      ],
      "expenses": [
        {
          "id": "exp_1",
          "title": "Supermarket",
          "amount": 220,
          "categoryId": "cat_food",
          "note": "Weekly shopping",
          "proof": "IMAGE_ATTACHED",
          "memberId": "member_1",
          "createdAt": "2026-04-28T12:00:00.000Z"
        }
      ]
    }
  },
  "session": {
    "activeFamilyId": "family_id",
    "activeMemberId": "member_1"
  }
}
```

## Design principles

1. **Single or multiple families:** supports expansion using `families` as a map.
2. **Simple local session:** `session` tracks active family and active member.
3. **No backend dependency:** all CRUD runs in a unified hook.
4. **Hackathon demo-friendly:** clear and traceable data model.

## CRUD operations in `useFamilyData`

- Create new family + admin.
- Join family through `inviteCode`.
- Add/delete expense.
- Fetch expenses with filters (member/category).
- Update active session.
- Reset all local data from settings.

## Smart insights

Metrics are computed in real time from stored data:

- **Total spent** = sum of all expenses.
- **Remaining** = `monthlyBudget - totalSpent`.
- **Discipline score:**
  - Planned spend by today = `(monthlyBudget / daysInMonth) * daysPassedInMonth`.
  - Discipline ratio = `totalSpent / plannedSpendByToday`.
  - Discipline score = `max(0, 100 - max(disciplineRatio - 1, 0) * 100)`.
- **Depletion prediction:**
  - Predicted spendable days left = `remaining / burnRate`.
  - Predicted depletion date = `today + predictedDaysLeft`.
  - If earlier than month-end, alert that budget may run out early.
- **Category overrun:**
  - Triggered when category spend exceeds its category limit.

### Smart alerts rules

Alerts are generated and sorted by ascending `priority` (smaller first):

1. **Monthly budget exceeded** (`priority: 1`, `tone: danger`, `emoji: 🚨`)
   - Condition: `totalSpent > monthlyBudget`.
2. **High spending pace at mid-month** (`priority: 2`, `tone: warning`, `emoji: ⚠️`)
   - Condition: month progress `>= 50%` and spending `>= 55%` of budget.
3. **Reached 80% or more of budget** (`priority: 3`, `tone: warning`, `emoji: 🟠`)
   - Condition: `totalSpent >= 80%` of `monthlyBudget`.
4. **Single category consuming large budget share** (`priority: 4`, `tone: warning`, `emoji: 🟠`)
   - Condition: top category share `>= 40%` of total budget.
5. **Category limit exceeded** (`priority: 5`, `tone: danger`, `emoji: ⛔`)
   - Condition: `categorySpent > categoryLimit`.
6. **Weekly average + monthly estimate summary** (`priority: 6`, dynamic tone)
   - Tone depends on estimated monthly spending vs budget.
7. **No expenses logged today** (`priority: 7`, `tone: success`, `emoji: ✅`)
   - Condition: no expense added on current date.

## Route-to-data mapping

- `/dashboard`: reads summary metrics, insights, and alerts.
- `/expenses/new`: writes a new expense into `expenses`.
- `/expenses`: reads full expenses list with filters.
- `/analytics`: aggregates expenses by time and category.
- `/family`: reads `members` list.
- `/settings`: clears `family_db` entirely.

## Performance notes and limitations

- `localStorage` is suitable for MVP, not for large-scale production.
- High-resolution image uploads are not persisted; only short text/placeholders in `proof`.

## Dashboard UI notes

- **Quick Summary** intentionally shows 3 fixed lines:
  1. Remaining budget
  2. Total spending so far
  3. Budget usage percentage
- If `monthlyBudget` is invalid (`<= 0` or non-numeric), the usage line displays fallback text instead of a numeric percentage.
- This display simplification does **not** change calculation logic in `buildInsights`; only presentation changes.
