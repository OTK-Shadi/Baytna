import { AlertTriangle } from 'lucide-react';

export default function SmartAlerts({ alerts }: { alerts: string[] }) {
  if (!alerts.length) {
    return <div className="card p-4 text-green-700">ممتاز! لا توجد تنبيهات خطرة حاليًا.</div>;
  }

  return (
    <div className="card p-4">
      <h3 className="mb-3 flex items-center gap-2 text-lg font-bold">
        <AlertTriangle className="text-amber-500" size={18} /> تنبيهات ذكية
      </h3>
      <ul className="space-y-2 text-sm">
        {alerts.map((alert, idx) => (
          <li key={idx} className="rounded-xl bg-amber-50 p-3 text-amber-800">
            {alert}
          </li>
        ))}
      </ul>
    </div>
  );
}
