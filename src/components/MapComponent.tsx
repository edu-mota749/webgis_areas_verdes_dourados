'use client';

import { useEffect, useRef, useMemo } from 'react';
import L from 'leaflet';
import { AreaVerdeGeoJSON, AreaVerdeFeature, Fotografia, Equipamento } from '@/types/gis';

// ─── Utilitário: formatar data BR ────────────────────────────────────────────
function formatDate(dateStr?: string): string {
  if (!dateStr) return '—';
  try {
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  } catch {
    return dateStr;
  }
}

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
  onSelectFotografia?: (foto: Fotografia) => void;
  onSelectEquipamento?: (eq: Equipamento) => void;
  targetZoomFeature?: AreaVerdeFeature | null;
  targetZoomBairro?: string | null;
  onClearZoomTarget?: () => void;
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
  onSelectFotografia,
  onSelectEquipamento,
  targetZoomFeature,
  targetZoomBairro,
  onClearZoomTarget,
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

  // 1. Inicializar Mapa Leaflet
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const isMobile = window.innerWidth < 768;

    const map = L.map(mapContainerRef.current, {
      center: [-22.2238, -54.8062],
      zoom: isMobile ? 13 : 14,
      zoomControl: false,
      // tap:false desativa o handler sintético L.Map.Tap (causa double-fire no Android).
      // O @types/leaflet não expõe essa opção, então usamos cast para any.
      tap: false,
    } as any);

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

    // Posicionar o botão de Zoom no canto INFERIOR DIREITO (acima da barra inferior) para nunca colidir com botões do topo!
    L.control.zoom({ position: 'bottomright' }).addTo(map);

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

  // 2. Alternar Camada Base
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

  // 3. Renderizar Polígonos das Praças
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
      const matchClasse = selectedClasses[p.classe] !== false;
      return matchSearch && matchType && matchClasse;
    });

    const filteredGeoJSON: AreaVerdeGeoJSON = {
      type: 'FeatureCollection',
      features: filteredFeatures,
    };

    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

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

        if (!isMobile) {
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
        }

        layer.on('mouseover', (e: any) => {
          if (!isMobile) {
            const l = e.target;
            l.setStyle({
              weight: 4,
              fillOpacity: 0.65,
              color: '#ffffff',
            });
            l.bringToFront();
          }
        });

        layer.on('mouseout', (e: any) => {
          if (!isMobile) {
            geoJsonLayer.resetStyle(e.target);
          }
        });

        (layer as any).featureId = p.id;

        layer.on('click', (e: any) => {
          L.DomEvent.stop(e);
          // Dispara a seleção da feature para abrir a ficha (Bottom Sheet no Mobile / Modal no Desktop)
          onSelectFeature(feature);
        });
      },
    }).addTo(map);

    geoJsonLayerRef.current = geoJsonLayer;
  }, [geoJsonData, selectedType, selectedClasses, searchQuery, visibleLayers.pracas, onSelectFeature]);

  // Efeito para dar ZOOM Suave e abrir POPUP na geometria ou bairro selecionado no filtro
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (targetZoomFeature) {
      const targetFeatureId = targetZoomFeature.properties.id;
      const bounds = L.geoJSON(targetZoomFeature as any).getBounds();
      if (bounds.isValid()) {
        // Garantir dimensões atualizadas antes da animação de voo (especialmente no mobile)
        map.invalidateSize();
        map.flyToBounds(bounds, { maxZoom: 17, padding: [60, 60], duration: 1.0 });

        // Abrir popup com precisão somente ao FINAL da animação de voo, sem interromper nem deslocar o mapa
        const openTargetPopup = () => {
          if (geoJsonLayerRef.current) {
            geoJsonLayerRef.current.eachLayer((layer: any) => {
              if (layer.featureId === targetFeatureId) {
                layer.openPopup();
              }
            });
          }
        };

        map.once('moveend', openTargetPopup);
      }
      if (onClearZoomTarget) onClearZoomTarget();
    } else if (targetZoomBairro) {
      const bairroFeatures = geoJsonData.features.filter(
        (f) => f.properties.bairro.toLowerCase() === targetZoomBairro.toLowerCase()
      );
      if (bairroFeatures.length > 0) {
        const bounds = L.geoJSON({ type: 'FeatureCollection', features: bairroFeatures } as any).getBounds();
        if (bounds.isValid()) {
          map.invalidateSize();
          map.flyToBounds(bounds, { padding: [50, 50], duration: 1.0 });
        }
      }
      if (onClearZoomTarget) onClearZoomTarget();
    }
  }, [targetZoomFeature, targetZoomBairro, geoJsonData, onClearZoomTarget]);

  // Mapeia o conjunto de IDs das áreas verdes ativas após a aplicação dos filtros
  const visibleAreaIds = useMemo(() => {
    const ids = new Set<number>();
    if (!visibleLayers.pracas) return ids;
    geoJsonData.features.forEach((f) => {
      const p = f.properties;
      const matchSearch =
        p.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.bairro.toLowerCase().includes(searchQuery.toLowerCase());
      const matchType = selectedType === 'Todos' || p.tipo === selectedType;
      const matchClasse = selectedClasses[p.classe] !== false;
      if (matchSearch && matchType && matchClasse) {
        ids.add(p.id);
      }
    });
    return ids;
  }, [geoJsonData, searchQuery, selectedType, selectedClasses, visibleLayers.pracas]);

  // 4. Renderizar Marcadores de Fotografias e Equipamentos
  useEffect(() => {
    if (!photoLayerGroupRef.current || !equipLayerGroupRef.current) return;

    photoLayerGroupRef.current.clearLayers();
    equipLayerGroupRef.current.clearLayers();

    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

    if (visibleLayers.fotografias) {
      fotografias.forEach((foto) => {
        // Se o ponto está vinculado a uma praça (id_area != null), ele só aparece se a praça estiver visível
        if (foto.id_area !== null && foto.id_area !== undefined && !visibleAreaIds.has(foto.id_area)) {
          return;
        }

        if (foto.lat && foto.lng) {
          const photoIcon = L.divIcon({
            className: 'custom-gis-photo-pin',
            html: `
              <div class="relative group cursor-pointer">
                <div class="absolute -inset-1 bg-cyan-500 rounded-full blur-xs opacity-75 animate-pulse"></div>
                <div style="background: linear-gradient(135deg, #0ea5e9, #0284c7); color: white; padding: 6px; border-radius: 12px; border: 2.5px solid #0f172a; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.7); width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; font-size: 15px;">
                  📷
                </div>
                <div style="width: 0; height: 0; border-left: 5px solid transparent; border-right: 5px solid transparent; border-top: 7px solid #0f172a; margin: -2px auto 0 auto;"></div>
              </div>
            `,
            iconSize: [32, 38],
            iconAnchor: [16, 38],
          });

          const titulo = foto.tipo || 'Fotografia';
          const cleanUrl = foto.url ? foto.url.replace('/fotos-campo/files/', '/fotos-campo/').replace(/^files\//, '') : undefined;
          const fullImgUrl = cleanUrl ? (cleanUrl.startsWith('http') ? cleanUrl : `https://hhouklrgffoyovnhsmcb.supabase.co/storage/v1/object/public/fotos-campo/${cleanUrl.replace(/^\//, '')}`) : undefined;
          const marker = L.marker([foto.lat, foto.lng], { icon: photoIcon });

          if (!isMobile) {
            // Desktop: Hover exibe apenas o título/tipo do ponto em tooltip limpo
            marker.bindTooltip(`
              <div class="px-2 py-1 flex items-center gap-1.5 font-sans">
                <span class="text-xs">📷</span>
                <span class="text-white text-xs font-bold">${titulo}</span>
              </div>
            `, {
              sticky: true,
              direction: 'top',
              className: 'leaflet-hover-tooltip',
              offset: [0, -10],
            });
          }

          // Clique (tanto mobile quanto desktop) dispara o formulário/modal centralizado com imagem expandida
          marker.on('click', () => {
            onSelectFotografia?.({ ...foto, url: fullImgUrl || foto.url });
          });

          photoLayerGroupRef.current?.addLayer(marker);
        }
      });
    }

    if (visibleLayers.equipamentos) {
      equipamentos.forEach((eq) => {
        // Se o equipamento está vinculado a uma praça (id_area != null), ele só aparece se a praça estiver visível
        if (eq.id_area !== null && eq.id_area !== undefined && !visibleAreaIds.has(eq.id_area)) {
          return;
        }

        if (eq.lat && eq.lng) {
          const equipIcon = L.divIcon({
            className: 'custom-gis-equip-pin',
            html: `
              <div class="relative group cursor-pointer">
                <div class="absolute -inset-1 bg-amber-500 rounded-full blur-xs opacity-75 animate-pulse"></div>
                <div style="background: linear-gradient(135deg, #f59e0b, #d97706); color: white; padding: 6px; border-radius: 12px; border: 2.5px solid #0f172a; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.7); width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; font-size: 15px;">
                  🏋️
                </div>
                <div style="width: 0; height: 0; border-left: 5px solid transparent; border-right: 5px solid transparent; border-top: 7px solid #0f172a; margin: -2px auto 0 auto;"></div>
              </div>
            `,
            iconSize: [32, 38],
            iconAnchor: [16, 38],
          });

          const cleanUrl = eq.url ? eq.url.replace('/fotos-campo/files/', '/fotos-campo/').replace(/^files\//, '') : undefined;
          const fullImgUrl = cleanUrl ? (cleanUrl.startsWith('http') ? cleanUrl : `https://hhouklrgffoyovnhsmcb.supabase.co/storage/v1/object/public/fotos-campo/${cleanUrl.replace(/^\//, '')}`) : undefined;
          const marker = L.marker([eq.lat, eq.lng], { icon: equipIcon });

          if (!isMobile) {
            // Desktop: Hover exibe apenas o título/tipo do equipamento em tooltip limpo
            marker.bindTooltip(`
              <div class="px-2 py-1 flex items-center gap-1.5 font-sans">
                <span class="text-xs">🏋️</span>
                <span class="text-white text-xs font-bold">${eq.tipo}</span>
              </div>
            `, {
              sticky: true,
              direction: 'top',
              className: 'leaflet-hover-tooltip',
              offset: [0, -10],
            });
          }

          // Clique (tanto mobile quanto desktop) dispara o formulário/modal centralizado com imagem expandida
          marker.on('click', () => {
            onSelectEquipamento?.({ ...eq, url: fullImgUrl || eq.url });
          });

          equipLayerGroupRef.current?.addLayer(marker);
        }
      });
    }
  }, [fotografias, equipamentos, visibleLayers.fotografias, visibleLayers.equipamentos, visibleAreaIds, onSelectFotografia, onSelectEquipamento]);

  return <div ref={mapContainerRef} className="w-full h-full absolute inset-0 z-0 bg-slate-950" />;
}

