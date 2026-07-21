'use client';

import { Compass, Globe } from 'lucide-react';

interface BottomCartoBarProps {
  coords: { lat: number; lng: number };
  totalFeaturesCount: number;
}

export default function BottomCartoBar({ coords, totalFeaturesCount }: BottomCartoBarProps) {
  return (
    /* Barra fixa no rodapé com altura constante de 36px */
    <footer
      id="bottom-carto-bar"
      className="absolute bottom-0 left-0 right-0 z-10 h-9 flex items-center justify-between px-3
                 bg-slate-900/95 backdrop-blur-md border-t border-white/10"
    >
      {/* LADO ESQUERDO: Contador + Coordenadas em linha */}
      <div className="flex items-center gap-3 text-[11px]">
        {/* Contador de praças */}
        <span className="flex items-center gap-1.5 text-slate-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
          <strong className="text-white">{totalFeaturesCount}</strong>
          <span className="hidden sm:inline">praças em Dourados-MS</span>
          <span className="sm:hidden">praças</span>
        </span>

        <span className="text-slate-700">|</span>

        {/* Coordenadas */}
        <span className="flex items-center gap-1 text-slate-300 font-mono">
          <Compass className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>
            <strong className="text-white">{coords.lng.toFixed(5)}</strong>
            <span className="text-slate-500">,</span>
            <strong className="text-white"> {coords.lat.toFixed(5)}</strong>
          </span>
        </span>
      </div>

      {/* LADO DIREITO: CRS — sempre visível, abreviado no mobile */}
      <div className="flex items-center gap-1.5 text-[10px] text-slate-300">
        <Globe className="w-3.5 h-3.5 text-teal-400 shrink-0" />
        <span className="hidden md:inline">
          CRS: <strong className="text-teal-300">SIRGAS 2000 / UTM 21S (EPSG:31981)</strong>
        </span>
        <span className="md:hidden">
          <strong className="text-teal-300">EPSG:31981</strong>
        </span>
      </div>
    </footer>
  );
}
