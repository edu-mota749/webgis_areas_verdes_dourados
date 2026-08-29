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
  foto_url?: string;  // Imagem ilustrativa / foto de campo da praça
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
  id_area: number | null;
  tipo?: string;       // Paisagismo, Pavimentação da Calçada, Fauna Urbana, Poluição Visual, Lago, Esculturas, Outros
  url: string;
  descricao?: string;
  autor?: string;
  data?: string;
  lat?: number;
  lng?: number;
}

export interface Equipamento {
  id: number;
  id_area: number | null;
  tipo: string;          // Bancos de Praça, Mesas de Convivência, Áreas de Sombra, Pistas de Caminhada, Quadras Esportivas, Pistas de Skate, Playgrounds, Academias, Outros
  estado?: 'Bom' | 'Regular' | 'Ruim';
  observacao?: string;
  url?: string;          // Foto registrada do equipamento em campo
  autor?: string;        // Responsável pelo levantamento
  data?: string;         // Data do levantamento em campo
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
  funcoesAtendidas: {
    ecol: number;
    permeab: number;
    estetica: number;
    lazer: number;
  };
  metricasPorClasse: {
    classe: string;
    ndviMedio: number;
    pugsMedio: number;
  }[];
  porTipo: {
    tipo: string;
    quantidade: number;
  }[];
  faixasNdvi: {
    faixa: string;
    quantidade: number;
  }[];
  conformidadePermeab: {
    status: string;
    quantidade: number;
  }[];
}

