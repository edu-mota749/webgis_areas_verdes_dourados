'use client';

import { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import TopSearchBar from '@/components/TopSearchBar';
import SidebarLayers from '@/components/SidebarLayers';
import BottomCartoBar from '@/components/BottomCartoBar';
import DashboardView from '@/components/DashboardView';
import AboutView from '@/components/AboutView';
import { AreaVerdeGeoJSON, AreaVerdeFeature, Fotografia, Equipamento, DashboardStats } from '@/types/gis';
import { MOCK_AREAS_VERDES, MOCK_FOTOGRAFIAS, MOCK_EQUIPAMENTOS, MOCK_DASHBOARD_STATS } from '@/lib/mockData';

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
  const [stats, setStats] = useState<DashboardStats>(MOCK_DASHBOARD_STATS);

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

        const resDash = await fetch('/api/dashboard');
        if (resDash.ok) {
          const dashData = await resDash.json();
          setStats(dashData);
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
    <main className="w-screen h-screen relative overflow-hidden bg-slate-950 font-sans">
      {/* BARRA SUPERIOR DE PESQUISA E NAVEGAÇÃO FLUTUANTE */}
      <TopSearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedType={selectedType}
        setSelectedType={setSelectedType}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onExportGeoJSON={handleExportGeoJSON}
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
            onSelectFeature={(feature) => console.log('Praça selecionada:', feature.properties.nome)}
          />

          {/* BARRA INFERIOR CARTOGRÁFICA */}
          <BottomCartoBar coords={mouseCoords} totalFeaturesCount={geoJsonData.features.length} />
        </>
      )}

      {/* ABA 2: DASHBOARD ANALÍTICO DE INTELIGÊNCIA GEOGRÁFICA */}
      {activeTab === 'dashboard' && <DashboardView stats={stats} />}

      {/* ABA 3: SOBRE O TCC E METODOLOGIA */}
      {activeTab === 'sobre' && <AboutView />}
    </main>
  );
}
