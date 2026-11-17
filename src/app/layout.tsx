import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '@/context/AppContext';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'E-Penjurian Wonogiri Innovation Award & KRENOVA 2026',
  description: 'Sistem Penjurian Presentasi Inovasi Daerah Wonogiri Innovation Award & Krenova 2026',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased flex flex-col font-sans">
        <AppProvider>
          <Navbar />
          <main className="flex-1 pb-16">{children}</main>
          <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500 no-print">
            <div className="max-w-7xl mx-auto px-4">
              <p className="font-semibold text-slate-700">
                Bidang Riset dan Inovasi Daerah — Bapperida Kabupaten Wonogiri
              </p>
              <p className="mt-1">
                Aplikasi Penjurian Presentasi Wonogiri Innovation Award & Krenova Tahun 2026
              </p>
            </div>
          </footer>
        </AppProvider>
      </body>
    </html>
  );
}
