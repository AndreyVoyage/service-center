// apps/web/src/app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'ColdService - Ремонт промышленных холодильников 24/7',
  description: 'Профессиональный ремонт и обслуживание промышленного холодильного оборудования. Выезд мастера в день обращения. Гарантия на все работы.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}