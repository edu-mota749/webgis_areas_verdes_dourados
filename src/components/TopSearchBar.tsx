'use client';

import { useState } from 'react';
import { Search, Filter, BarChart3, Map as MapIcon, Info, Download, SlidersHorizontal, X } from 'lucide-react';

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
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  return (
    <header className="absolute top-2 left-2 right-2 md:top-3 md:left-3 md:right-3 z-30 pointer-events-none">
      <div className="flex items-center justify-between gap-2">
        {/* LADO ESQUERDO: LOGO E TÍTULO COMPACTO */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="bg-slate-900/95 backdrop-blur-md border border-white/15 px-2.5 py-1.5 md:px-3.5 md:py-2 rounded-xl flex items-center gap-2 shadow-2xl">
            <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center font-bold text-emerald-400 text-xs shrink-0">
              UFGD
            </div>
            <div>
              <h1 className="text-[11px] md:text-xs font-bold text-white tracking-wide leading-none uppercase">
                WebGIS Áreas Verdes
              </h1>
              <span className="text-[9px] md:text-[10px] text-slate-400 font-medium">Dourados-MS</span>
            </div>
          </div>

          {/* BUSCA E FILTROS EM DESKTOP (md:flex) */}
          {activeTab === 'mapa' && (
            <div className="hidden md:flex items-center gap-2">
              <div className="bg-slate-900/95 backdrop-blur-md border border-white/15 rounded-xl px-3 py-1.5 flex items-center gap-2 shadow-2xl w-60">
                <Search className="w-4 h-4 text-emerald-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Pesquisar nome ou bairro..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent text-xs text-white placeholder-slate-400 focus:outline-none w-full"
                />
              </div>

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
            </div>
          )}
        </div>

        {/* LADO DIREITO: NAVEGAÇÃO COMPACTA */}
        <div className="flex items-center gap-1.5 pointer-events-auto">
          {/* Botão de Busca Mobile (Apenas no celular quando na aba Mapa) */}
          {activeTab === 'mapa' && (
            <button
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
              className="md:hidden bg-slate-900/95 backdrop-blur-md border border-white/15 text-emerald-400 p-2 rounded-xl shadow-2xl"
              title="Abrir Busca e Filtros"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          )}

          {/* Abas de Navegação */}
          <div className="bg-slate-900/95 backdrop-blur-md border border-white/15 p-1 rounded-xl flex items-center gap-1 shadow-2xl">
            <button
              onClick={() => setActiveTab('mapa')}
              className={`px-2.5 py-1 md:px-3 md:py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                activeTab === 'mapa'
                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <MapIcon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Mapa</span>
            </button>
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-2.5 py-1 md:px-3 md:py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Dashboard</span>
            </button>
            <button
              onClick={() => setActiveTab('sobre')}
              className={`px-2.5 py-1 md:px-3 md:py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                activeTab === 'sobre'
                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Info className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sobre</span>
            </button>
          </div>

          {/* Botão Exportar GeoJSON em Desktop */}
          {activeTab === 'mapa' && (
            <button
              onClick={onExportGeoJSON}
              className="hidden lg:flex bg-slate-900/95 backdrop-blur-md border border-white/15 text-slate-200 hover:text-emerald-400 px-3 py-2 rounded-xl text-xs font-semibold items-center gap-1.5 shadow-2xl transition-all"
              title="Baixar GeoJSON"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
            </button>
          )}
        </div>
      </div>

      {/* DRAWER FLUTUANTE DE PESQUISA MOBILE */}
      {mobileSearchOpen && activeTab === 'mapa' && (
        <div className="mt-2 bg-slate-900/95 backdrop-blur-md border border-white/15 p-3 rounded-2xl shadow-2xl space-y-2 pointer-events-auto md:hidden">
          <div className="flex items-center justify-between pb-1 border-b border-slate-800">
            <span className="text-xs font-bold text-white uppercase tracking-wider">Filtros de Pesquisa</span>
            <button onClick={() => setMobileSearchOpen(false)} className="text-slate-400 p-0.5">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 flex items-center gap-2">
            <Search className="w-4 h-4 text-emerald-400 shrink-0" />
            <input
              type="text"
              placeholder="Pesquisar por nome ou bairro..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-xs text-white placeholder-slate-400 focus:outline-none w-full"
            />
          </div>
          <div className="flex items-center justify-between bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs">
            <span className="text-slate-400">Tipo de Unidade:</span>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer"
            >
              <option value="Todos" className="bg-slate-900">Todos os Tipos</option>
              <option value="Praça" className="bg-slate-900">Praça</option>
              <option value="Parque" className="bg-slate-900">Parque</option>
              <option value="CEPER" className="bg-slate-900">CEPER</option>
            </select>
          </div>
        </div>
      )}
    </header>
  );
}
