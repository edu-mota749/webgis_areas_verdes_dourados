'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import dynamic from 'next/dynamic';
import TopSearchBar from '@/components/TopSearchBar';
import SidebarLayers from '@/components/SidebarLayers';
import BottomCartoBar from '@/components/BottomCartoBar';
import DashboardView from '@/components/DashboardView';
import AboutView from '@/components/AboutView';
import AreaVerdeBottomSheet from '@/components/AreaVerdeBottomSheet';
import PontoBottomSheet, { PontoSelecionado } from '@/components/PontoBottomSheet';
import { AreaVerdeGeoJSON, AreaVerdeFeature, Fotografia, Equipamento, DashboardStats } from '@/types/gis';
import { MOCK_AREAS_VERDES, MOCK_FOTOGRAFIAS, MOCK_EQUIPAMENTOS, calculateStatsFromGeoJSON } from '@/lib/mockData';

const MapComponent = dynamic(() => import('@/components/MapComponent'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-slate-950 flex items-center justify-center text-slate-400 text-xs font-semibold">
      <div className="flex flex-col items-center gap-2">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        Carregando motor gráfico do WebGIS Dourados-MS...
      </div>
    </div>
  ),
});

export default function WebGISPage() {
  const [activeTab, setActiveTab] = useState<'mapa' | 'dashboard' | 'sobre'>('mapa');
  const [geoJsonData, setGeoJsonData] = useState<AreaVerdeGeoJSON>(MOCK_AREAS_VERDES);
  const [fotografias, setFotografias] = useState<Fotografia[]>(MOCK_FOTOGRAFIAS);
  const [equipamentos, setEquipamentos] = useState<Equipamento[]>(MOCK_EQUIPAMENTOS);

  // Cálculo 100% dinâmico do Dashboard baseado nas áreas ativas (Supabase ou GeoJSON)
  const stats = useMemo(() => calculateStatsFromGeoJSON(geoJsonData), [geoJsonData]);

  // Filtros da Busca
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('Todos');

  // Filtro de Classes por Caixinha na Legenda
  const [selectedClasses, setSelectedClasses] = useState<Record<string, boolean>>({
    'Muito Boa': true,
    'Boa': true,
    'Regular': true,
    'Ruim': true,
  });

  // Coordenadas dinâmicas do mouse
  const [mouseCoords, setMouseCoords] = useState({ lat: -22.2238, lng: -54.8062 });

  // Mapa Base Ativo ('google' ou 'osm')
  const [activeBasemap, setActiveBasemap] = useState<'google' | 'osm'>('google');

  // Visibilidade das Camadas Vetoriais
  const [visibleLayers, setVisibleLayers] = useState({
    pracas: true,
    fotografias: true,
    equipamentos: true,
  });

  // Estado de abertura do painel de camadas (Desktop inicia aberto)
  const [isLayersOpen, setIsLayersOpen] = useState(false);
  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth >= 768) {
      setIsLayersOpen(true);
    }
  }, []);

  // Estado para o Bottom Sheet mobile — Praças
  const [mobileSelectedFeature, setMobileSelectedFeature] = useState<AreaVerdeFeature | null>(null);

  // Estado para o Bottom Sheet mobile — Pontos (Fotografias e Equipamentos)
  const [pontoSelecionado, setPontoSelecionado] = useState<PontoSelecionado>(null);

  // Estado para dar ZOOM na geometria ou bairro selecionado
  const [targetZoomFeature, setTargetZoomFeature] = useState<AreaVerdeFeature | null>(null);
  const [targetZoomBairro, setTargetZoomBairro] = useState<string | null>(null);

  const handleSelectSuggestion = (feature?: AreaVerdeFeature, bairroName?: string) => {
    if (feature) {
      setTargetZoomFeature(feature);
      setTargetZoomBairro(null);
    } else if (bairroName) {
      setTargetZoomBairro(bairroName);
      setTargetZoomFeature(null);
    }
  };

  const handleClearZoomTarget = useCallback(() => {
    setTargetZoomFeature(null);
    setTargetZoomBairro(null);
  }, []);

  const handleMouseMoveCoords = useCallback((lat: number, lng: number) => {
    setMouseCoords({ lat, lng });
  }, []);

  // Carregar dados das APIs
  useEffect(() => {
    async function fetchData() {
      try {
        const resGeo = await fetch('/api/areas');
        if (resGeo.ok) {
          const data = await resGeo.json();
          setGeoJsonData(data);
        }

        const resFoto = await fetch('/api/fotografias');
        if (resFoto.ok) {
          const dataFoto = await resFoto.json();
          setFotografias(dataFoto);
        }

        const resEquip = await fetch('/api/equipamentos');
        if (resEquip.ok) {
          const dataEquip = await resEquip.json();
          setEquipamentos(dataEquip);
        }
      } catch (err) {
        console.warn('Usando dados de fallback offline:', err);
      }
    }
    fetchData();
  }, []);

  const handleExportGeoJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(geoJsonData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'pracas_dourados_ms.geojson');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <main className="w-full h-full h-[100dvh] relative overflow-hidden bg-slate-950 font-sans">
      {/* BARRA SUPERIOR DE PESQUISA E NAVEGAÇÃO FLUTUANTE UNIFICADA */}
      <TopSearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedType={selectedType}
        setSelectedType={setSelectedType}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onExportGeoJSON={handleExportGeoJSON}
        geoJsonData={geoJsonData}
        onSelectSuggestion={handleSelectSuggestion}
        isLayersOpen={isLayersOpen}
        onToggleLayers={setIsLayersOpen}
      />

      {/* ABA 1: MAPA WEBGIS INTERATIVO */}
      {activeTab === 'mapa' && (
        <>
          {/* GERENCIADOR DE CAMADAS LATERAL FLUTUANTE */}
          <SidebarLayers
            activeBasemap={activeBasemap}
            setActiveBasemap={setActiveBasemap}
            visibleLayers={visibleLayers}
            setVisibleLayers={setVisibleLayers}
            selectedClasses={selectedClasses}
            setSelectedClasses={setSelectedClasses}
            isOpen={isLayersOpen}
            setIsOpen={setIsLayersOpen}
          />

          {/* COMPONENTE DO MAPA LEAFLET */}
          <MapComponent
            geoJsonData={geoJsonData}
            fotografias={fotografias}
            equipamentos={equipamentos}
            selectedType={selectedType}
            selectedClasses={selectedClasses}
            searchQuery={searchQuery}
            activeBasemap={activeBasemap}
            visibleLayers={visibleLayers}
            onMouseMoveCoords={handleMouseMoveCoords}
            onSelectFeature={(feature) => {
              // No mobile abre o BottomSheet React; no desktop o popup Leaflet já abre
              const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
              if (isMobile) setMobileSelectedFeature(feature);
            }}
            onSelectFotografia={(foto) =>
              setPontoSelecionado({ kind: 'fotografia', data: foto })
            }
            onSelectEquipamento={(eq) =>
              setPontoSelecionado({ kind: 'equipamento', data: eq })
            }
            targetZoomFeature={targetZoomFeature}
            targetZoomBairro={targetZoomBairro}
            onClearZoomTarget={handleClearZoomTarget}
          />

          {/* BARRA INFERIOR CARTOGRÁFICA */}
          <BottomCartoBar coords={mouseCoords} totalFeaturesCount={geoJsonData.features.length} />

          {/* BOTTOM SHEET DE DETALHES — Praças — Mobile apenas */}
          <AreaVerdeBottomSheet
            feature={mobileSelectedFeature}
            onClose={() => setMobileSelectedFeature(null)}
          />

          {/* BOTTOM SHEET DE DETALHES — Pontos (Fotos/Equipamentos) — Mobile apenas */}
          <PontoBottomSheet
            ponto={pontoSelecionado}
            onClose={() => setPontoSelecionado(null)}
          />
        </>
      )}

      {/* ABA 2: DASHBOARD ANALÍTICO DE INTELIGÊNCIA GEOGRÁFICA */}
      {activeTab === 'dashboard' && <DashboardView stats={stats} />}

      {/* ABA 3: SOBRE O TCC E METODOLOGIA */}
      {activeTab === 'sobre' && <AboutView />}
    </main>
  );
}
