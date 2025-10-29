// src/app/layout.tsx
import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'UrlCurt',
  description: 'Transforme links longos em URLs curtas com segurança, praticidade e estatísticas em tempo real.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="bg-gray-50 antialiased">
        {children}
      </body>
    </html>
  );
}



