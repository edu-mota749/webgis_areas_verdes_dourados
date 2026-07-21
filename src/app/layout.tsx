import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'WebGIS - Praças Urbanas de Dourados-MS | TCC UFGD',
  description: 'Sistema de Informação Geográfica Web para caracterização e avaliação multicritério de praças urbanas em Dourados-MS.',
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
