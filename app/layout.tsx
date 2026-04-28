import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ذكاء مصروف العائلة',
  description: 'تطبيق هاكاثون لإدارة الميزانية العائلية بشكل ذكي',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar">
      <body>{children}</body>
    </html>
  );
}
