# Architecture | هيكلية البيانات والتخزين المحلي

يعتمد التطبيق بالكامل على مفتاح واحد داخل `localStorage`:

- **Key:** `family_db`

## مخطط JSON المعتمد

```json
{
  "families": {
    "family_id": {
      "id": "family_id",
      "familyName": "عائلة النور",
      "monthlyBudget": 12000,
      "inviteCode": "AB12CD",
      "createdAt": "2026-04-28T10:00:00.000Z",
      "members": [
        {
          "id": "member_1",
          "name": "سارة",
          "role": "admin",
          "joinedAt": "2026-04-28T10:00:00.000Z"
        },
        {
          "id": "member_2",
          "name": "أحمد",
          "role": "member",
          "joinedAt": "2026-04-28T11:00:00.000Z"
        }
      ],
      "categories": [
        {
          "id": "cat_food",
          "name": "الطعام",
          "limit": 3000
        },
        {
          "id": "cat_rent",
          "name": "الإيجار",
          "limit": 5000
        }
      ],
      "expenses": [
        {
          "id": "exp_1",
          "title": "سوبرماركت",
          "amount": 220,
          "categoryId": "cat_food",
          "note": "شراء أسبوعي",
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

## فلسفة البنية

1. **عائلة واحدة أو عدة عائلات**: التخزين يدعم التوسع عبر `families` كـ map.
2. **جلسة محلية بسيطة**: `session` تحدد العضو والعائلة النشطة.
3. **عدم الاعتماد على خادم**: كل العمليات CRUD تتم داخل Hook موحد.
4. **سهولة العرض في الهاكاثون**: بيانات واضحة وقابلة للتتبع السريع.

## عمليات CRUD داخل `useFamilyData`

- إنشاء عائلة جديدة + مدير.
- الانضمام لعائلة عبر `inviteCode`.
- إضافة/حذف مصروف.
- استرجاع المصروفات مع خيارات تصفية (حسب العضو/الفئة).
- تحديث الجلسة النشطة.

## الذكاء المالي (Smart Insights)

يتم احتساب المؤشرات لحظيًا من البيانات:

- **إجمالي الصرف** = مجموع جميع المصروفات.
- **المتبقي** = `monthlyBudget - totalSpent`.
- **مؤشر الانضباط**:
  - الصرف المتوقع حتى اليوم = `(monthlyBudget / daysInMonth) * daysPassedInMonth`.
  - نسبة الانضباط = `totalSpent / plannedSpendByToday`.
  - درجة الانضباط = `max(0, 100 - max(disciplineRatio - 1, 0) * 100)`.
- **توقع النفاد**:
  - الأيام المتبقية القابلة للصرف = `remaining / burnRate`.
  - تاريخ النفاد المتوقع = `today + predictedDaysLeft`.
  - إن كانت أقل من الأيام المتبقية لنهاية الشهر => تنبيه "قد تنفد الميزانية مبكرًا".
- **تجاوز الفئات**:
  - عند تجاوز مجموع فئة ما لحدها المحدد.

## ملاحظات الأداء والقيود

- `localStorage` مناسب لـ MVP لكن ليس للإنتاج واسع النطاق.
- لا يتم حفظ صور عالية الدقة؛ فقط نص قصير/placeholder في حقل `proof`.
