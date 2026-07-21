'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="pt-BR">
      <body className="bg-slate-950 text-white flex flex-col items-center justify-center h-screen">
        <h2 className="text-lg font-bold text-red-400 mb-2">Erro do Sistema WebGIS</h2>
        <p className="text-xs text-slate-400 mb-4">{error?.message || 'Falha geral ao carregar'}</p>
        <button
          onClick={() => reset()}
          className="px-4 py-2 bg-emerald-500 text-slate-950 text-xs font-bold rounded-lg font-sans"
        >
          Recarregar Aplicação
        </button>
      </body>
    </html>
  );
}
