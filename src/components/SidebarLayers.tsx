'use client';

import { useState } from 'react';
import { Layers, ChevronRight, ChevronDown, Image, Sparkles, MapPin, Camera, Dices } from 'lucide-react';

interface SidebarLayersProps {
  activeBasemap: 'google' | 'osm';
  setActiveBasemap: (b: 'google' | 'osm') => void;
  visibleLayers: {
    pracas: boolean;
    fotografias: boolean;
    equipamentos: boolean;
  };
  setVisibleLayers: React.Dispatch<
    React.SetStateAction<{
      pracas: boolean;
      fotografias: boolean;
      equipamentos: boolean;
    }>
  >;
  selectedClasses: Record<string, boolean>;
  setSelectedClasses: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
}

export default function SidebarLayers({
  activeBasemap,
  setActiveBasemap,
  visibleLayers,
  setVisibleLayers,
  selectedClasses,
  setSelectedClasses,
}: SidebarLayersProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [openGroups, setOpenGroups] = useState({
    raster: true,
    urbanismo: true,
    campo: true,
  });

  const toggleGroup = (group: 'raster' | 'urbanismo' | 'campo') => {
    setOpenGroups((prev) => ({ ...prev, [group]: !prev[group] }));
  };

  const handleToggleClass = (classe: string) => {
    setSelectedClasses((prev) => ({
      ...prev,
      [classe]: !prev[classe],
    }));
  };

  return (
    <aside className="absolute top-20 left-3 z-10 pointer-events-auto">
      {/* Botão para Expandir/Recolher o Painel estilo GeoPortal */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-slate-900/90 backdrop-blur-md border border-white/15 text-white p-2.5 rounded-xl shadow-2xl flex items-center gap-2 hover:bg-slate-800 hover:border-emerald-500/50 transition-all group"
          title="Abrir Gerenciador de Camadas"
        >
          <Layers className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-bold tracking-wide pr-1">Camadas</span>
        </button>
      )}

      {/* Painel Flutuante Lateral Estilo GeoPortal */}
      {isOpen && (
        <div className="bg-slate-900/95 backdrop-blur-md border border-white/15 rounded-2xl p-3.5 shadow-2xl w-64 md:w-72 max-h-[calc(100vh-140px)] overflow-y-auto">
          {/* Cabeçalho do Painel */}
          <div className="flex items-center justify-between border-b border-slate-700/80 pb-2 mb-3">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              <h2 className="text-xs font-bold text-white uppercase tracking-wider">
                Gerenciador de Camadas
              </h2>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white text-xs bg-slate-800/80 p-1 rounded-md border border-slate-700"
            >
              ✕
            </button>
          </div>

          <div className="space-y-3">
            {/* GRUPO 1: CAMADAS RASTER / MAPA BASE */}
            <div className="border border-slate-800 rounded-xl bg-slate-950/40 p-2">
              <button
                onClick={() => toggleGroup('raster')}
                className="w-full flex items-center justify-between text-xs font-semibold text-slate-300 hover:text-emerald-400 transition-colors mb-1"
              >
                <div className="flex items-center gap-1.5">
                  <Image className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Mapa Base</span>
                </div>
                {openGroups.raster ? (
                  <ChevronDown className="w-3.5 h-3.5" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5" />
                )}
              </button>

              {openGroups.raster && (
                <div className="mt-2 space-y-1.5 pl-2 text-xs">
                  <label className="flex items-center gap-2 text-slate-300 cursor-pointer hover:text-white">
                    <input
                      type="radio"
                      name="basemap"
                      checked={activeBasemap === 'google'}
                      onChange={() => setActiveBasemap('google')}
                      className="accent-emerald-500 cursor-pointer"
                    />
                    <span>Google Satélite Híbrido (QGIS)</span>
                  </label>
                  <label className="flex items-center gap-2 text-slate-300 cursor-pointer hover:text-white">
                    <input
                      type="radio"
                      name="basemap"
                      checked={activeBasemap === 'osm'}
                      onChange={() => setActiveBasemap('osm')}
                      className="accent-emerald-500 cursor-pointer"
                    />
                    <span>OpenStreetMap Vetorial</span>
                  </label>
                </div>
              )}
            </div>

            {/* GRUPO 2: PLANEJAMENTO URBANO / ÁREAS VERDES E FILTRO DE CLASSES */}
            <div className="border border-slate-800 rounded-xl bg-slate-950/40 p-2">
              <button
                onClick={() => toggleGroup('urbanismo')}
                className="w-full flex items-center justify-between text-xs font-semibold text-slate-300 hover:text-emerald-400 transition-colors mb-1"
              >
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Planejamento Urbano</span>
                </div>
                {openGroups.urbanismo ? (
                  <ChevronDown className="w-3.5 h-3.5" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5" />
                )}
              </button>

              {openGroups.urbanismo && (
                <div className="mt-2 space-y-2 pl-2 text-xs">
                  <label className="flex items-center gap-2 text-slate-200 font-semibold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={visibleLayers.pracas}
                      onChange={(e) =>
                        setVisibleLayers((prev) => ({
                          ...prev,
                          pracas: e.target.checked,
                        }))
                      }
                      className="accent-emerald-500 rounded cursor-pointer"
                    />
                    <span>Praças & Áreas Verdes</span>
                  </label>

                  {/* LEGENDA DE QUALIDADE COM CAIXINHAS DE SELEÇÃO INTERATIVAS */}
                  <div className="bg-slate-900/90 p-2.5 rounded-xl border border-slate-800 text-[11px] space-y-1.5 mt-1">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">
                      Filtro de Qualidade das Praças:
                    </span>

                    {/* Muito Boa */}
                    <label className="flex items-center gap-2 text-slate-300 cursor-pointer hover:text-white transition-colors">
                      <input
                        type="checkbox"
                        checked={!!selectedClasses['Muito Boa']}
                        onChange={() => handleToggleClass('Muito Boa')}
                        className="accent-emerald-500 rounded cursor-pointer"
                      />
                      <span className="w-3 h-3 rounded-sm bg-emerald-500 inline-block border border-white/20 shrink-0"></span>
                      <span>Muito Boa <strong className="text-slate-400 font-normal">(4/4 funções)</strong></span>
                    </label>

                    {/* Boa */}
                    <label className="flex items-center gap-2 text-slate-300 cursor-pointer hover:text-white transition-colors">
                      <input
                        type="checkbox"
                        checked={!!selectedClasses['Boa']}
                        onChange={() => handleToggleClass('Boa')}
                        className="accent-lime-500 rounded cursor-pointer"
                      />
                      <span className="w-3 h-3 rounded-sm bg-lime-500 inline-block border border-white/20 shrink-0"></span>
                      <span>Boa <strong className="text-slate-400 font-normal">(3/4 funções)</strong></span>
                    </label>

                    {/* Regular */}
                    <label className="flex items-center gap-2 text-slate-300 cursor-pointer hover:text-white transition-colors">
                      <input
                        type="checkbox"
                        checked={!!selectedClasses['Regular']}
                        onChange={() => handleToggleClass('Regular')}
                        className="accent-amber-500 rounded cursor-pointer"
                      />
                      <span className="w-3 h-3 rounded-sm bg-amber-500 inline-block border border-white/20 shrink-0"></span>
                      <span>Regular <strong className="text-slate-400 font-normal">(2/4 funções)</strong></span>
                    </label>

                    {/* Ruim */}
                    <label className="flex items-center gap-2 text-slate-300 cursor-pointer hover:text-white transition-colors">
                      <input
                        type="checkbox"
                        checked={!!selectedClasses['Ruim']}
                        onChange={() => handleToggleClass('Ruim')}
                        className="accent-red-500 rounded cursor-pointer"
                      />
                      <span className="w-3 h-3 rounded-sm bg-red-500 inline-block border border-white/20 shrink-0"></span>
                      <span>Ruim <strong className="text-slate-400 font-normal">(1/4 ou 0)</strong></span>
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* GRUPO 3: MAPEAMENTOS EM CAMPO */}
            <div className="border border-slate-800 rounded-xl bg-slate-950/40 p-2">
              <button
                onClick={() => toggleGroup('campo')}
                className="w-full flex items-center justify-between text-xs font-semibold text-slate-300 hover:text-emerald-400 transition-colors mb-1"
              >
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Levantamento de Campo</span>
                </div>
                {openGroups.campo ? (
                  <ChevronDown className="w-3.5 h-3.5" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5" />
                )}
              </button>

              {openGroups.campo && (
                <div className="mt-2 space-y-1.5 pl-2 text-xs">
                  <label className="flex items-center gap-2 text-slate-300 cursor-pointer hover:text-white">
                    <input
                      type="checkbox"
                      checked={visibleLayers.fotografias}
                      onChange={(e) =>
                        setVisibleLayers((prev) => ({
                          ...prev,
                          fotografias: e.target.checked,
                        }))
                      }
                      className="accent-emerald-500 rounded cursor-pointer"
                    />
                    <Camera className="w-3 h-3 text-sky-400" />
                    <span>Fotografias Registradas</span>
                  </label>
                  <label className="flex items-center gap-2 text-slate-300 cursor-pointer hover:text-white">
                    <input
                      type="checkbox"
                      checked={visibleLayers.equipamentos}
                      onChange={(e) =>
                        setVisibleLayers((prev) => ({
                          ...prev,
                          equipamentos: e.target.checked,
                        }))
                      }
                      className="accent-emerald-500 rounded cursor-pointer"
                    />
                    <Dices className="w-3 h-3 text-amber-400" />
                    <span>Equipamentos Urbanos</span>
                  </label>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
