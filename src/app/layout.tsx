import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'WebGIS - Praças Urbanas de Dourados-MS | TCC UFGD',
  description: 'Sistema de Informação Geográfica Web para caracterização e avaliação multicritério de praças urbanas em Dourados-MS.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark">
      <body className="antialiased select-none bg-slate-950 text-slate-100">{children}</body>
    </html>
  );
}

