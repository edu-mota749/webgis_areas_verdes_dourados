import { AreaVerdeGeoJSON, Fotografia, Equipamento, DashboardStats } from '@/types/gis';

export const MOCK_AREAS_VERDES: AreaVerdeGeoJSON = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      id: 1,
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-54.8070, -22.2230],
            [-54.8055, -22.2230],
            [-54.8055, -22.2245],
            [-54.8070, -22.2245],
            [-54.8070, -22.2230]
          ]
        ]
      },
      properties: {
        id: 1,
        nome: 'Praça Antônio João',
        tipo: 'Praça',
        bairro: 'Centro',
        area_m2: 14500.00,
        area_ha: 1.45,
        perimetro: 480.00,
        ndvi_med: 0.645,
        pugs: 81.50,
        ecol: 1,
        permeab: 1,
        estetica: 1,
        lazer: 1,
        total_func: 4,
        classe: 'Muito Boa',
        observacao: 'Praça central principal com concha acústica, alta densidade arbórea e fonte iluminada.'
      }
    },
    {
      type: 'Feature',
      id: 2,
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-54.8370, -22.2270],
            [-54.8330, -22.2270],
            [-54.8330, -22.2310],
            [-54.8370, -22.2310],
            [-54.8370, -22.2270]
          ]
        ]
      },
      properties: {
        id: 2,
        nome: 'Parque Antenor Martins',
        tipo: 'Parque',
        bairro: 'Jardim Flórida',
        area_m2: 185000.00,
        area_ha: 18.50,
        perimetro: 1920.00,
        ndvi_med: 0.780,
        pugs: 92.30,
        ecol: 1,
        permeab: 1,
        estetica: 1,
        lazer: 1,
        total_func: 4,
        classe: 'Muito Boa',
        observacao: 'Parque urbano extenso com lago artificial, pista de caminhada e intensa área de preservação.'
      }
    },
    {
      type: 'Feature',
      id: 3,
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-54.7995, -22.2150],
            [-54.7975, -22.2150],
            [-54.7975, -22.2165],
            [-54.7995, -22.2165],
            [-54.7995, -22.2150]
          ]
        ]
      },
      properties: {
        id: 3,
        nome: 'Praça Paraguaia',
        tipo: 'Praça',
        bairro: 'Jardim Itália',
        area_m2: 8200.00,
        area_ha: 0.82,
        perimetro: 360.00,
        ndvi_med: 0.510,
        pugs: 73.20,
        ecol: 1,
        permeab: 1,
        estetica: 1,
        lazer: 0,
        total_func: 3,
        classe: 'Boa',
        observacao: 'Praça com boa vegetação, sombreamento adequado e bancos, necessita reforma nos brinquedos.'
      }
    },
    {
      type: 'Feature',
      id: 4,
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-54.8105, -22.2035],
            [-54.8075, -22.2035],
            [-54.8075, -22.2055],
            [-54.8105, -22.2055],
            [-54.8105, -22.2035]
          ]
        ]
      },
      properties: {
        id: 4,
        nome: 'CEPER BNH 3.º Plano',
        tipo: 'CEPER',
        bairro: 'BNH 3º Plano',
        area_m2: 22400.00,
        area_ha: 2.24,
        perimetro: 610.00,
        ndvi_med: 0.420,
        pugs: 62.00,
        ecol: 0,
        permeab: 0,
        estetica: 1,
        lazer: 1,
        total_func: 2,
        classe: 'Regular',
        observacao: 'Centro Poliesportivo e Recreativo com quadras e campo, porém permeabilidade do solo abaixo de 70%.'
      }
    },
    {
      type: 'Feature',
      id: 5,
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-54.8220, -22.2110],
            [-54.8200, -22.2110],
            [-54.8200, -22.2130],
            [-54.8220, -22.2130],
            [-54.8220, -22.2110]
          ]
        ]
      },
      properties: {
        id: 5,
        nome: 'Praça Parque Alvorada',
        tipo: 'Praça',
        bairro: 'Parque Alvorada',
        area_m2: 5100.00,
        area_ha: 0.51,
        perimetro: 290.00,
        ndvi_med: 0.280,
        pugs: 45.00,
        ecol: 0,
        permeab: 0,
        estetica: 0,
        lazer: 1,
        total_func: 1,
        classe: 'Ruim',
        observacao: 'Área pública predominantemente pavimentada, poucas árvores e alta degradação do mobiliário.'
      }
    }
  ]
};

export const MOCK_FOTOGRAFIAS: Fotografia[] = [
  {
    id: 1,
    id_area: 1,
    url: 'https://images.unsplash.com/photo-1519331379826-f10be5486c6f?w=800',
    descricao: 'Vista aérea da Praça Antônio João',
    autor: 'TCC Geoprocessamento UFGD',
    data: '2026-03-15',
    lat: -22.2238,
    lng: -54.8062
  },
  {
    id: 2,
    id_area: 1,
    url: 'https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?w=800',
    descricao: 'Área de descanso e arborização',
    autor: 'TCC Geoprocessamento UFGD',
    data: '2026-03-15',
    lat: -22.2239,
    lng: -54.8063
  },
  {
    id: 3,
    id_area: 2,
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
    descricao: 'Lago do Parque Antenor Martins',
    autor: 'TCC Geoprocessamento UFGD',
    data: '2026-04-10',
    lat: -22.2290,
    lng: -54.8350
  }
];

export const MOCK_EQUIPAMENTOS: Equipamento[] = [
  { id: 1, id_area: 1, tipo: 'Concha Acústica', estado: 'Bom', observacao: 'Palco para eventos culturais', lat: -22.2237, lng: -54.8061 },
  { id: 2, id_area: 1, tipo: 'Academia da Terceira Idade', estado: 'Bom', observacao: 'Aparelhos novos', lat: -22.2241, lng: -54.8065 },
  { id: 3, id_area: 2, tipo: 'Pista de Caminhada', estado: 'Bom', observacao: 'Pista de 2.2km contornando o lago', lat: -22.2280, lng: -54.8340 },
  { id: 4, id_area: 2, tipo: 'Playground Infantil', estado: 'Regular', observacao: 'Mobiliário em madeira', lat: -22.2295, lng: -54.8355 }
];

export const MOCK_DASHBOARD_STATS: DashboardStats = {
  totalPracas: 5,
  areaTotalHa: 23.52,
  ndviMedio: 0.527,
  pugsMedio: 70.80,
  porClasse: {
    muitoBoa: 2,
    boa: 1,
    regular: 1,
    ruim: 1
  },
  topMaiores: [
    { nome: 'Parque Antenor Martins', bairro: 'Jardim Flórida', area_ha: 18.50, classe: 'Muito Boa' },
    { nome: 'CEPER BNH 3.º Plano', bairro: 'BNH 3º Plano', area_ha: 2.24, classe: 'Regular' },
    { nome: 'Praça Antônio João', bairro: 'Centro', area_ha: 1.45, classe: 'Muito Boa' },
    { nome: 'Praça Paraguaia', bairro: 'Jardim Itália', area_ha: 0.82, classe: 'Boa' },
    { nome: 'Praça Parque Alvorada', bairro: 'Parque Alvorada', area_ha: 0.51, classe: 'Ruim' }
  ]
};
