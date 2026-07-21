'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="w-screen h-screen bg-slate-950 flex flex-col items-center justify-center text-white p-4">
      <h2 className="text-lg font-bold text-red-400 mb-2">Ocorreu um erro na aplicação</h2>
      <p className="text-xs text-slate-400 mb-4">{error?.message || 'Erro desconhecido'}</p>
      <button
        onClick={() => reset()}
        className="px-4 py-2 bg-emerald-500 text-slate-950 text-xs font-bold rounded-lg"
      >
        Tentar Novamente
      </button>
    </div>
  );
}
