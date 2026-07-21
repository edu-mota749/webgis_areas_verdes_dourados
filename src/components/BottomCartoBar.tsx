'use client';

import { Compass, Globe, Scale } from 'lucide-react';

interface BottomCartoBarProps {
  coords: { lat: number; lng: number };
  totalFeaturesCount: number;
}

export default function BottomCartoBar({ coords, totalFeaturesCount }: BottomCartoBarProps) {
  return (
    <footer className="absolute bottom-3 left-3 right-3 z-10 flex flex-wrap items-center justify-between gap-2 pointer-events-none text-xs">
      {/* LADO ESQUERDO: Escala e Coordenadas Geográficas (Inspirado no screenshot do usuário) */}
      <div className="flex items-center gap-2 pointer-events-auto">
        {/* Box Coordenadas */}
        <div className="bg-slate-900/90 backdrop-blur-md border border-white/15 px-3 py-1.5 rounded-xl text-slate-200 flex items-center gap-2 shadow-2xl">
          <Compass className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span className="font-mono text-[11px]">
            Grau decimal: <strong className="text-white">{coords.lng.toFixed(6)}</strong>,{' '}
            <strong className="text-white">{coords.lat.toFixed(6)}</strong>
          </span>
        </div>

        {/* Box Projeção Cartográfica */}
        <div className="hidden sm:flex bg-slate-900/90 backdrop-blur-md border border-white/15 px-3 py-1.5 rounded-xl text-slate-300 items-center gap-1.5 shadow-2xl">
          <Globe className="w-3.5 h-3.5 text-teal-400" />
          <span className="text-[11px]">
            CRS: <strong className="text-teal-300">SIRGAS 2000 / UTM 21S (EPSG:31981)</strong>
          </span>
        </div>
      </div>

      {/* LADO DIREITO: Contagem de Praças e Escala */}
      <div className="flex items-center gap-2 pointer-events-auto">
        <div className="bg-slate-900/90 backdrop-blur-md border border-white/15 px-3 py-1.5 rounded-xl text-slate-300 flex items-center gap-1.5 shadow-2xl">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-[11px]">
            Exibindo <strong className="text-white">{totalFeaturesCount}</strong> unidades em Dourados-MS
          </span>
        </div>
      </div>
    </footer>
  );
}
