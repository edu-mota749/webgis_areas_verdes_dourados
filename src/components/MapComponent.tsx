'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import { AreaVerdeGeoJSON, AreaVerdeFeature, Fotografia, Equipamento } from '@/types/gis';

interface MapComponentProps {
  geoJsonData: AreaVerdeGeoJSON;
  fotografias: Fotografia[];
  equipamentos: Equipamento[];
  selectedType: string;
  selectedClasses: Record<string, boolean>;
  searchQuery: string;
  activeBasemap: 'google' | 'osm';
  visibleLayers: {
    pracas: boolean;
    fotografias: boolean;
    equipamentos: boolean;
  };
  onMouseMoveCoords: (lat: number, lng: number) => void;
  onSelectFeature: (feature: AreaVerdeFeature) => void;
}

const COLOR_MAP: Record<string, string> = {
  'Muito Boa': '#10b981', // Verde esmeralda
  'Boa': '#84cc16',       // Verde claro
  'Regular': '#f59e0b',   // Amarelo / Laranja
  'Ruim': '#ef4444',      // Vermelho
};

export default function MapComponent({
  geoJsonData,
  fotografias,
  equipamentos,
  selectedType,
  selectedClasses,
  searchQuery,
  activeBasemap,
  visibleLayers,
  onMouseMoveCoords,
  onSelectFeature,
}: MapComponentProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  const googleTileRef = useRef<L.TileLayer | null>(null);
  const osmTileRef = useRef<L.TileLayer | null>(null);
  const geoJsonLayerRef = useRef<L.GeoJSON | null>(null);
  const photoLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const equipLayerGroupRef = useRef<L.LayerGroup | null>(null);

  const mouseCoordsCallbackRef = useRef(onMouseMoveCoords);
  useEffect(() => {
    mouseCoordsCallbackRef.current = onMouseMoveCoords;
  }, [onMouseMoveCoords]);

  // 1. Inicializar Mapa Leaflet (Uma única vez)
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [-22.2238, -54.8062],
      zoom: 14,
      zoomControl: false,
    });

    // Camada Google Hybrid (Satélite + Vias)
    const googleHybridTile = L.tileLayer(
      'https://{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
      {
        maxZoom: 20,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
        attribution: '&copy; Google Maps Satélite Híbrido',
      }
    );

    // Camada OpenStreetMap
    const osmTile = L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors',
      }
    );

    googleHybridTile.addTo(map);
    googleTileRef.current = googleHybridTile;
    osmTileRef.current = osmTile;

    L.control.zoom({ position: 'topright' }).addTo(map);

    photoLayerGroupRef.current = L.layerGroup().addTo(map);
    equipLayerGroupRef.current = L.layerGroup().addTo(map);

    let rafId: number | null = null;
    map.on('mousemove', (e: L.LeafletMouseEvent) => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        mouseCoordsCallbackRef.current(e.latlng.lat, e.latlng.lng);
        rafId = null;
      });
    });

    mapInstanceRef.current = map;

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // 2. Alternar Camada Base (Google Hybrid vs OSM)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !googleTileRef.current || !osmTileRef.current) return;

    if (activeBasemap === 'google') {
      if (!map.hasLayer(googleTileRef.current)) {
        googleTileRef.current.addTo(map);
      }
      if (map.hasLayer(osmTileRef.current)) {
        map.removeLayer(osmTileRef.current);
      }
    } else {
      if (!map.hasLayer(osmTileRef.current)) {
        osmTileRef.current.addTo(map);
      }
      if (map.hasLayer(googleTileRef.current)) {
        map.removeLayer(googleTileRef.current);
      }
    }
  }, [activeBasemap]);

  // 3. Renderizar Polígonos com Filtros por Busca, Tipo e Caixinhas da Legenda
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (geoJsonLayerRef.current) {
      map.removeLayer(geoJsonLayerRef.current);
      geoJsonLayerRef.current = null;
    }

    if (!visibleLayers.pracas) return;

    const filteredFeatures = geoJsonData.features.filter((f) => {
      const p = f.properties;
      const matchSearch =
        p.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.bairro.toLowerCase().includes(searchQuery.toLowerCase());
      const matchType = selectedType === 'Todos' || p.tipo === selectedType;
      const matchClasse = selectedClasses[p.classe] !== false; // Se a caixinha estiver desmarcada, ignora
      return matchSearch && matchType && matchClasse;
    });

    const filteredGeoJSON: AreaVerdeGeoJSON = {
      type: 'FeatureCollection',
      features: filteredFeatures,
    };

    const geoJsonLayer = L.geoJSON(filteredGeoJSON as any, {
      style: (feature: any) => {
        const classe = feature?.properties?.classe || 'Ruim';
        const color = COLOR_MAP[classe] || '#3b82f6';
        return {
          color: color,
          weight: 2.5,
          opacity: 0.95,
          fillColor: color,
          fillOpacity: 0.35,
        };
      },
      onEachFeature: (feature: any, layer: L.Layer) => {
        const p: AreaVerdeFeature['properties'] = feature.properties;
        const classeColor = COLOR_MAP[p.classe] || '#3b82f6';

        // 1. TOOLTIP AO PASSSAR O MOUSE (HOVER)
        const hoverTooltipHTML = `
          <div class="px-2 py-1 flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full inline-block" style="background-color:${classeColor}"></span>
            <div>
              <strong class="text-white text-xs block leading-none">${p.nome}</strong>
              <span class="text-[10px] text-slate-300">${p.bairro} • ${p.area_ha} ha • PUGS ${p.pugs}%</span>
            </div>
          </div>
        `;

        layer.bindTooltip(hoverTooltipHTML, {
          sticky: true,
          direction: 'top',
          className: 'leaflet-hover-tooltip',
          offset: [0, -10],
        });

        // 2. POPUP COMPLETO AO CLICAR
        const popupHTML = `
          <div class="p-2 min-w-[280px]">
            <div class="flex items-center justify-between gap-2 border-b border-slate-700 pb-2 mb-2">
              <h3 class="text-base font-bold text-white leading-tight">${p.nome}</h3>
              <span class="px-2 py-0.5 text-xs font-semibold rounded-full text-white" style="background-color: ${classeColor}">
                ${p.classe}
              </span>
            </div>
            
            <div class="text-xs text-slate-300 space-y-1 mb-3">
              <p>📍 <strong>Bairro:</strong> ${p.bairro} (${p.tipo})</p>
              <p>📐 <strong>Área:</strong> ${p.area_m2.toLocaleString('pt-BR')} m² (${p.area_ha} ha)</p>
              <p>🔄 <strong>Perímetro:</strong> ${p.perimetro.toLocaleString('pt-BR')} m</p>
              <p>🌿 <strong>NDVI Médio:</strong> <span class="font-bold text-emerald-400">${p.ndvi_med.toFixed(3)}</span></p>
              <p>💧 <strong>PUGS (% Verde):</strong> <span class="font-bold text-teal-300">${p.pugs.toFixed(1)}%</span></p>
            </div>

            <div class="border-t border-slate-700 pt-2 mb-2">
              <span class="text-[11px] font-semibold text-slate-400 block mb-1">AVALIAÇÃO DAS 4 FUNÇÕES:</span>
              <div class="grid grid-cols-2 gap-1 text-[11px]">
                <div class="${p.ecol ? 'text-emerald-400 font-medium' : 'text-slate-500 line-through'}">🌱 Ecológica ${p.ecol ? '✓' : '✗'}</div>
                <div class="${p.permeab ? 'text-emerald-400 font-medium' : 'text-slate-500 line-through'}">💧 Permeabilidade ${p.permeab ? '✓' : '✗'}</div>
                <div class="${p.estetica ? 'text-emerald-400 font-medium' : 'text-slate-500 line-through'}">🌸 Estética ${p.estetica ? '✓' : '✗'}</div>
                <div class="${p.lazer ? 'text-emerald-400 font-medium' : 'text-slate-500 line-through'}">⚽ Lazer ${p.lazer ? '✓' : '✗'}</div>
              </div>
            </div>

            ${p.observacao ? `<p class="text-[11px] text-slate-400 italic bg-slate-800/80 p-1.5 rounded border border-slate-700">${p.observacao}</p>` : ''}
          </div>
        `;

        layer.bindPopup(popupHTML);

        layer.on('mouseover', (e: any) => {
          const l = e.target;
          l.setStyle({
            weight: 4,
            fillOpacity: 0.65,
            color: '#ffffff',
          });
          l.bringToFront();
        });

        layer.on('mouseout', (e: any) => {
          geoJsonLayer.resetStyle(e.target);
        });

        layer.on('click', () => {
          onSelectFeature(feature);
        });
      },
    }).addTo(map);

    geoJsonLayerRef.current = geoJsonLayer;
  }, [geoJsonData, selectedType, selectedClasses, searchQuery, visibleLayers.pracas, onSelectFeature]);

  // 4. Renderizar Marcadores de Fotografias e Equipamentos
  useEffect(() => {
    if (!photoLayerGroupRef.current || !equipLayerGroupRef.current) return;

    photoLayerGroupRef.current.clearLayers();
    equipLayerGroupRef.current.clearLayers();

    if (visibleLayers.fotografias) {
      fotografias.forEach((foto) => {
        if (foto.lat && foto.lng) {
          const photoIcon = L.divIcon({
            className: 'custom-gis-photo-pin',
            html: `
              <div class="relative group cursor-pointer">
                <div class="absolute -inset-1 bg-cyan-500 rounded-full blur-xs opacity-75 animate-pulse"></div>
                <div style="background: linear-gradient(135deg, #0ea5e9, #0284c7); color: white; padding: 6px; border-radius: 12px; border: 2.5px solid #0f172a; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.7); width: 34px; height: 34px; display: flex; align-items: center; justify-content: center; font-size: 16px;">
                  📷
                </div>
                <div style="width: 0; height: 0; border-left: 6px solid transparent; border-right: 6px solid transparent; border-top: 8px solid #0f172a; margin: -2px auto 0 auto;"></div>
              </div>
            `,
            iconSize: [34, 40],
            iconAnchor: [17, 40],
          });

          const marker = L.marker([foto.lat, foto.lng], { icon: photoIcon });
          marker.bindPopup(`
            <div class="p-1 max-w-[240px]">
              <img src="${foto.url}" alt="${foto.descricao}" class="w-full h-32 object-cover rounded-md mb-2 border border-slate-700 shadow-md" />
              <p class="text-xs font-semibold text-white">${foto.descricao}</p>
              <p class="text-[10px] text-slate-400">Autor: ${foto.autor} (${foto.data})</p>
            </div>
          `);
          photoLayerGroupRef.current?.addLayer(marker);
        }
      });
    }

    if (visibleLayers.equipamentos) {
      equipamentos.forEach((eq) => {
        if (eq.lat && eq.lng) {
          const equipIcon = L.divIcon({
            className: 'custom-gis-equip-pin',
            html: `
              <div class="relative group cursor-pointer">
                <div class="absolute -inset-1 bg-amber-500 rounded-full blur-xs opacity-75 animate-pulse"></div>
                <div style="background: linear-gradient(135deg, #f59e0b, #d97706); color: white; padding: 6px; border-radius: 12px; border: 2.5px solid #0f172a; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.7); width: 34px; height: 34px; display: flex; align-items: center; justify-content: center; font-size: 16px;">
                  🎠
                </div>
                <div style="width: 0; height: 0; border-left: 6px solid transparent; border-right: 6px solid transparent; border-top: 8px solid #0f172a; margin: -2px auto 0 auto;"></div>
              </div>
            `,
            iconSize: [34, 40],
            iconAnchor: [17, 40],
          });

          const marker = L.marker([eq.lat, eq.lng], { icon: equipIcon });
          marker.bindPopup(`
            <div class="p-1">
              <span class="text-xs font-bold text-amber-400 block">${eq.tipo}</span>
              <span class="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded border border-slate-700">Estado: ${eq.estado}</span>
              ${eq.observacao ? `<p class="text-[11px] text-slate-300 mt-1">${eq.observacao}</p>` : ''}
            </div>
          `);
          equipLayerGroupRef.current?.addLayer(marker);
        }
      });
    }
  }, [fotografias, equipamentos, visibleLayers.fotografias, visibleLayers.equipamentos]);

  return <div ref={mapContainerRef} className="w-full h-full absolute inset-0 z-0 bg-slate-950" />;
}
