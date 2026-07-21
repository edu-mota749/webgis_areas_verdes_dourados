'use client';

import { Search, Filter, BarChart3, Map as MapIcon, Info, Download } from 'lucide-react';

interface TopSearchBarProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedType: string;
  setSelectedType: (t: string) => void;
  activeTab: 'mapa' | 'dashboard' | 'sobre';
  setActiveTab: (t: 'mapa' | 'dashboard' | 'sobre') => void;
  onExportGeoJSON: () => void;
}

export default function TopSearchBar({
  searchQuery,
  setSearchQuery,
  selectedType,
  setSelectedType,
  activeTab,
  setActiveTab,
  onExportGeoJSON,
}: TopSearchBarProps) {
  return (
    <header className="absolute top-3 left-3 right-3 z-30 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
      {/* LADO ESQUERDO: Título UFGD + Barra de Pesquisa (Visível apenas na aba Mapa) */}
      <div className="flex flex-wrap items-center gap-2 pointer-events-auto">
        {/* Badge UFGD */}
        <div className="bg-slate-900/95 backdrop-blur-md border border-white/15 px-3.5 py-2 rounded-xl flex items-center gap-2.5 shadow-2xl">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center font-bold text-emerald-400 text-xs">
            UFGD
          </div>
          <div>
            <h1 className="text-xs font-bold text-white tracking-wide leading-none uppercase">
              WebGIS Áreas Verdes
            </h1>
            <span className="text-[10px] text-slate-400 font-medium">Dourados-MS • TCC</span>
          </div>
        </div>

        {/* PESQUISA E FILTRO POR TIPO (Exibidos apenas no Mapa) */}
        {activeTab === 'mapa' && (
          <>
            {/* Input de Pesquisa Flutuante */}
            <div className="bg-slate-900/95 backdrop-blur-md border border-white/15 rounded-xl px-3 py-1.5 flex items-center gap-2 shadow-2xl w-60 md:w-72">
              <Search className="w-4 h-4 text-emerald-400 shrink-0" />
              <input
                type="text"
                placeholder="Pesquisar por nome ou bairro..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent text-xs text-white placeholder-slate-400 focus:outline-none w-full"
              />
            </div>

            {/* Filtro por Tipo */}
            <div className="bg-slate-900/95 backdrop-blur-md border border-white/15 rounded-xl px-2.5 py-1.5 flex items-center gap-1.5 shadow-2xl">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="bg-transparent text-xs text-slate-200 focus:outline-none cursor-pointer"
              >
                <option value="Todos" className="bg-slate-900 text-white">Todos os Tipos</option>
                <option value="Praça" className="bg-slate-900 text-white">Praça</option>
                <option value="Parque" className="bg-slate-900 text-white">Parque</option>
                <option value="CEPER" className="bg-slate-900 text-white">CEPER</option>
              </select>
            </div>
          </>
        )}
      </div>

      {/* LADO DIREITO: Botões de NAVEGAÇÃO e EXPORTAÇÃO */}
      <div className="flex items-center gap-2 pointer-events-auto">
        <div className="bg-slate-900/95 backdrop-blur-md border border-white/15 p-1 rounded-xl flex items-center gap-1 shadow-2xl">
          <button
            onClick={() => setActiveTab('mapa')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'mapa'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <MapIcon className="w-3.5 h-3.5" />
            Mapa
          </button>
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'dashboard'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            Dashboard TCC
          </button>
          <button
            onClick={() => setActiveTab('sobre')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'sobre'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Info className="w-3.5 h-3.5" />
            Sobre
          </button>
        </div>

        {/* Botão Exportar GeoJSON */}
        {activeTab === 'mapa' && (
          <button
            onClick={onExportGeoJSON}
            className="bg-slate-900/95 backdrop-blur-md border border-white/15 text-slate-200 hover:text-emerald-400 hover:border-emerald-500/50 px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-2xl transition-all"
            title="Baixar dados espaciais em formato GeoJSON"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">GeoJSON</span>
          </button>
        )}
      </div>
    </header>
  );
}
