export type QualidadeClasse = 'Muito Boa' | 'Boa' | 'Regular' | 'Ruim';

export interface AreaVerdeProperties {
  id: number;
  nome: string;
  tipo: 'Praça' | 'Parque' | 'CEPER';
  bairro: string;
  area_m2: number;
  area_ha: number;
  perimetro: number;
  ndvi_med: number;
  pugs: number;
  ecol: number;      // 1 ou 0
  permeab: number;   // 1 ou 0
  estetica: number;  // 1 ou 0
  lazer: number;     // 1 ou 0
  total_func: number; // 0 a 4
  classe: QualidadeClasse;
  observacao?: string;
}

export interface AreaVerdeFeature {
  type: 'Feature';
  id: number;
  geometry: {
    type: 'Polygon';
    coordinates: number[][][];
  };
  properties: AreaVerdeProperties;
}

export interface AreaVerdeGeoJSON {
  type: 'FeatureCollection';
  features: AreaVerdeFeature[];
}

export interface Fotografia {
  id: number;
  id_area: number;
  url: string;
  descricao: string;
  autor: string;
  data: string;
  lat?: number;
  lng?: number;
}

export interface Equipamento {
  id: number;
  id_area: number;
  tipo: string;
  estado: 'Bom' | 'Regular' | 'Ruim';
  observacao?: string;
  lat?: number;
  lng?: number;
}

export interface DashboardStats {
  totalPracas: number;
  areaTotalHa: number;
  ndviMedio: number;
  pugsMedio: number;
  porClasse: {
    muitoBoa: number;
    boa: number;
    regular: number;
    ruim: number;
  };
  topMaiores: {
    nome: string;
    bairro: string;
    area_ha: number;
    classe: QualidadeClasse;
  }[];
}
