import { AlertTriangle } from 'lucide-react';
import { InsightAlert } from '@/types/family';

export default function SmartAlerts({ alerts }: { alerts: InsightAlert[] }) {
  if (!alerts.length) {
    return <div className="card p-4 text-green-700">ممتاز! لا توجد تنبيهات خطرة حاليًا.</div>;
  }

  return (
    <div className="card p-4">
      <h3 className="mb-3 flex items-center gap-2 text-lg font-bold">
        <AlertTriangle className="text-amber-500" size={18} /> Smart Insights
      </h3>
      <p className="mb-3 text-xs text-amber-700">
        الترتيب من الأعلى إلى الأسفل حسب الأهمية، وأول تنبيه هو الأكثر أهمية الآن.
      </p>
      <ul className="space-y-2 text-sm">
        {alerts.map((alert, idx) => (
          <li key={`${alert.priority}-${idx}`} className="rounded-xl bg-amber-50 p-3 text-amber-800">
            {alert.message}
          </li>
        ))}
      </ul>
    </div>
  );
}
