'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, Filter, BarChart3, Map as MapIcon, Info, Download, SlidersHorizontal, X, Layers } from 'lucide-react';
import { AreaVerdeGeoJSON, AreaVerdeFeature } from '@/types/gis';

interface TopSearchBarProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedType: string;
  setSelectedType: (t: string) => void;
  activeTab: 'mapa' | 'dashboard' | 'sobre';
  setActiveTab: (t: 'mapa' | 'dashboard' | 'sobre') => void;
  onExportGeoJSON: () => void;
  geoJsonData?: AreaVerdeGeoJSON;
  onSelectSuggestion?: (feature?: AreaVerdeFeature, bairroName?: string) => void;
  isLayersOpen?: boolean;
  onToggleLayers?: (open: boolean) => void;
}

interface SuggestionItem {
  text: string;
  subtext: string;
  badge: string;
  feature?: AreaVerdeFeature;
  bairro?: string;
}

export default function TopSearchBar({
  searchQuery,
  setSearchQuery,
  selectedType,
  setSelectedType,
  activeTab,
  setActiveTab,
  onExportGeoJSON,
  geoJsonData,
  onSelectSuggestion,
  isLayersOpen,
  onToggleLayers,
}: TopSearchBarProps) {
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Fechar dropdown de sugestões ao clicar fora
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Calcular sugestões de autocompletar baseadas no searchQuery
  const getSuggestions = (): SuggestionItem[] => {
    if (!searchQuery || !searchQuery.trim() || !geoJsonData) return [];

    const q = searchQuery.toLowerCase().trim();
    const suggestions: SuggestionItem[] = [];
    const addedTexts = new Set<string>();

    // 1. Sugestões por Nome de Praça / Parque / CEPER
    for (const f of geoJsonData.features) {
      const p = f.properties;
      if (p.nome.toLowerCase().includes(q) && !addedTexts.has(p.nome)) {
        addedTexts.add(p.nome);
        suggestions.push({
          text: p.nome,
          subtext: `${p.bairro} • ${p.area_ha} ha`,
          badge: p.tipo,
          feature: f,
        });
      }
    }

    // 2. Sugestões por Bairro (sem duplicatas)
    for (const f of geoJsonData.features) {
      const p = f.properties;
      if (p.bairro.toLowerCase().includes(q) && !addedTexts.has(`Bairro: ${p.bairro}`)) {
        addedTexts.add(`Bairro: ${p.bairro}`);
        suggestions.push({
          text: p.bairro,
          subtext: 'Bairro de Dourados-MS',
          badge: 'Bairro',
          bairro: p.bairro,
        });
      }
    }

    return suggestions.slice(0, 6);
  };

  const suggestions = getSuggestions();

  const handleSelectSuggestion = (item: SuggestionItem) => {
    setSearchQuery(item.text);
    setShowSuggestions(false);
    setMobileSearchOpen(false);
    if (onSelectSuggestion) {
      onSelectSuggestion(item.feature, item.bairro);
    }
  };

  return (
    <header className="absolute top-2 left-2 right-2 md:top-3 md:left-3 md:right-3 z-30 pointer-events-none">
      <div className="flex items-center justify-between gap-2">
        {/* LADO ESQUERDO: BARRA DE CONTROLE UNIFICADA */}
        <div className="bg-slate-900/95 backdrop-blur-md border border-white/15 p-1.5 md:p-2 rounded-2xl flex items-center gap-2 md:gap-3 shadow-2xl pointer-events-auto">
          {/* 1. BRAND LOGO + TÍTULO */}
          <div className="flex items-center gap-2 shrink-0">
            {!logoError ? (
              <div className="w-8 h-8 md:w-9 md:h-9 rounded-xl overflow-hidden border border-emerald-500/40 shrink-0 bg-slate-950/90 flex items-center justify-center p-0.5 shadow-md">
                <img
                  src="/logo.png"
                  alt="Logo UFGD"
                  onError={() => setLogoError(true)}
                  className="w-full h-full object-contain"
                />
              </div>
            ) : (
              <div className="w-8 h-8 md:w-9 md:h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center font-bold text-emerald-400 text-xs shrink-0 shadow-md">
                UFGD
              </div>
            )}
            <div className="leading-tight">
              <h1 className="text-[11px] md:text-xs font-bold text-white tracking-wide uppercase leading-none">
                WebGIS Áreas Verdes
              </h1>
              <span className="text-[9px] md:text-[10px] text-slate-400 font-medium">Dourados-MS</span>
            </div>
          </div>

          {/* 2. BOTÃO INTEGRADO DE CAMADAS */}
          {activeTab === 'mapa' && (
            <>
              <div className="w-px h-5 md:h-6 bg-slate-800 shrink-0" />
              <button
                onClick={() => onToggleLayers && onToggleLayers(!isLayersOpen)}
                className={`px-2 py-1 md:px-2.5 md:py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shrink-0 ${
                  isLayersOpen
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/80 border border-transparent'
                }`}
                title="Gerenciador de Camadas"
              >
                <Layers className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-[11px] md:text-xs">Camadas</span>
              </button>
            </>
          )}

          {/* 3. FILTROS E PESQUISA INTEGRADOS NO DESKTOP */}
          {activeTab === 'mapa' && (
            <div className="hidden md:flex items-center gap-2 relative" ref={searchContainerRef}>
              <div className="w-px h-5 md:h-6 bg-slate-800 shrink-0" />

              {/* UNIFIED INPUT BOX: SELETOR TIPO | PESQUISA INPUT */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-xl px-2.5 py-1 flex items-center gap-2 shadow-inner w-72 lg:w-80">
                {/* Seletor Tipo */}
                <div className="flex items-center gap-1 shrink-0">
                  <Filter className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="bg-transparent text-xs font-semibold text-slate-200 focus:outline-none cursor-pointer pr-1"
                  >
                    <option value="Todos" className="bg-slate-900 text-white">Todos os Tipos</option>
                    <option value="Praça" className="bg-slate-900 text-white">Praça</option>
                    <option value="Parque" className="bg-slate-900 text-white">Parque</option>
                    <option value="CEPER" className="bg-slate-900 text-white">CEPER</option>
                  </select>
                </div>

                <div className="w-px h-4 bg-slate-800 shrink-0" />

                {/* Input Pesquisa */}
                <div className="flex items-center gap-1.5 w-full">
                  <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <input
                    type="text"
                    placeholder="Pesquisar nome ou bairro..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setShowSuggestions(true);
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    className="bg-transparent text-xs text-white placeholder-slate-400 focus:outline-none w-full truncate"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="text-slate-400 hover:text-white shrink-0 p-0.5"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* DROPDOWN DE AUTOCOMPLETAR (DESKTOP) */}
              {showSuggestions && suggestions.length > 0 && searchQuery.trim() && (
                <div className="absolute top-full right-0 mt-2 bg-slate-900/95 backdrop-blur-md border border-white/15 rounded-xl overflow-hidden shadow-2xl z-50 divide-y divide-slate-800/80 w-72 lg:w-80">
                  {suggestions.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelectSuggestion(item)}
                      className="w-full px-3 py-2 text-left hover:bg-emerald-500/10 transition-colors flex items-center justify-between gap-2"
                    >
                      <div className="truncate">
                        <div className="text-xs font-semibold text-white truncate">{item.text}</div>
                        <div className="text-[10px] text-slate-400 truncate">{item.subtext}</div>
                      </div>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30 shrink-0">
                        {item.badge}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* LADO DIREITO: NAVEGAÇÃO DE ABAS */}
        <div className="flex items-center gap-1.5 pointer-events-auto">
          {/* Botão de Busca Mobile */}
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

          {/* Seletor Tipo */}
          <div className="flex items-center justify-between bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-emerald-400" />
              <span>Tipo de Unidade:</span>
            </span>
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

          {/* Campo Pesquisa com Autocompletar */}
          <div className="relative">
            <div className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 flex items-center gap-2">
              <Search className="w-4 h-4 text-emerald-400 shrink-0" />
              <input
                type="text"
                placeholder="Pesquisar por nome ou bairro..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                className="bg-transparent text-xs text-white placeholder-slate-400 focus:outline-none w-full"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="text-slate-400 hover:text-white shrink-0 p-0.5">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Dropdown Mobile */}
            {showSuggestions && suggestions.length > 0 && searchQuery.trim() && (
              <div className="mt-1 bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-2xl divide-y divide-slate-800 max-h-48 overflow-y-auto">
                {suggestions.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectSuggestion(item)}
                    className="w-full px-3 py-2 text-left hover:bg-slate-800/80 transition-colors flex items-center justify-between gap-2"
                  >
                    <div className="truncate">
                      <div className="text-xs font-semibold text-white truncate">{item.text}</div>
                      <div className="text-[10px] text-slate-400 truncate">{item.subtext}</div>
                    </div>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30 shrink-0">
                      {item.badge}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

