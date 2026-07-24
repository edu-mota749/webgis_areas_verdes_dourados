-- =====================================================================
-- WEBGIS - TCC ÁREAS VERDES DE DOURADOS-MS
-- DATABASE SCHEMA (Supabase + PostGIS)
-- PROJEÇÃO / COORDENADAS: EPSG:4326 (WGS 84 / SIRGAS 2000)
-- =====================================================================

-- 1. Ativar a extensão PostGIS
CREATE EXTENSION IF NOT EXISTS postgis;

-- 2. Tabela principal: Areas_Verdes (Polígonos)
CREATE TABLE IF NOT EXISTS areas_verdes (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    tipo VARCHAR(30) NOT NULL DEFAULT 'Praça', -- Praça, Parque, CEPER
    bairro VARCHAR(100) NOT NULL,
    area_m2 NUMERIC(12,2),      -- Área em m² (calculada em UTM 21S)
    area_ha NUMERIC(10,4),      -- Área em hectares (ha)
    perimetro NUMERIC(10,2),   -- Perímetro em metros
    ndvi_med NUMERIC(4,3),      -- Média do índice NDVI (-1 a +1)
    pugs NUMERIC(5,2),          -- % de Área Verde Urbana (área permeável/vegetada)
    ecol INT DEFAULT 0,         -- Função Ecológica: 1=Atende, 0=Não atende
    permeab INT DEFAULT 0,      -- Permeabilidade: 1= >=70%, 0= <70%
    estetica INT DEFAULT 0,     -- Função Estética: 1=Atende, 0=Não atende
    lazer INT DEFAULT 0,        -- Função Lazer: 1=Atende, 0=Não atende
    total_func INT DEFAULT 0,   -- Soma das quatro funções (0 a 4)
    classe VARCHAR(30),         -- Muito Boa, Boa, Regular, Ruim
    observacao TEXT,
    foto_url TEXT,              -- URL da imagem principal da praça (Supabase Storage)
    geom GEOMETRY(Polygon, 4326), -- Polígono espacial em lat/long
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índice espacial GIST para alta performance no mapa web
CREATE INDEX IF NOT EXISTS idx_areas_verdes_geom ON areas_verdes USING GIST (geom);

-- 3. Tabela: Fotografias (Pontos e Links para o Supabase Storage)
CREATE TABLE IF NOT EXISTS fotografias (
    id SERIAL PRIMARY KEY,
    id_area INT REFERENCES areas_verdes(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    descricao VARCHAR(255),
    autor VARCHAR(100),
    data DATE,
    geom GEOMETRY(Point, 4326),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Tabela: Equipamentos (Pontos de Infraestrutura de Lazer/Esporte)
CREATE TABLE IF NOT EXISTS equipamentos (
    id SERIAL PRIMARY KEY,
    id_area INT REFERENCES areas_verdes(id) ON DELETE CASCADE,
    tipo VARCHAR(50) NOT NULL,  -- Playground, Academia, Quadra, Pista de Caminhada, etc.
    estado VARCHAR(30),         -- Bom, Regular, Ruim
    observacao TEXT,
    url TEXT,                   -- URL da foto do equipamento em campo (Supabase Storage)
    geom GEOMETRY(Point, 4326),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Configurar Permissões Públicas de Leitura (Desativar RLS para Consulta Pública do WebGIS)
ALTER TABLE areas_verdes DISABLE ROW LEVEL SECURITY;
ALTER TABLE fotografias DISABLE ROW LEVEL SECURITY;
ALTER TABLE equipamentos DISABLE ROW LEVEL SECURITY;

GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon, authenticated;

-- =====================================================================
-- FUNÇÃO AUXILIAR: Retorna GeoJSON completo da camada de praças
-- =====================================================================
CREATE OR REPLACE FUNCTION get_areas_verdes_geojson()
RETURNS jsonb AS $$
BEGIN
  RETURN (
    SELECT jsonb_build_object(
      'type', 'FeatureCollection',
      'features', COALESCE(jsonb_agg(
        jsonb_build_object(
          'type', 'Feature',
          'id', id,
          'geometry', ST_AsGeoJSON(geom)::jsonb,
          'properties', jsonb_build_object(
            'id', id,
            'nome', nome,
            'tipo', tipo,
            'bairro', bairro,
            'area_m2', area_m2,
            'area_ha', area_ha,
            'perimetro', perimetro,
            'ndvi_med', ndvi_med,
            'pugs', pugs,
            'ecol', ecol,
            'permeab', permeab,
            'estetica', estetica,
            'lazer', lazer,
            'total_func', total_func,
            'classe', classe,
            'observacao', observacao,
            'foto_url', foto_url
          )
        )
      ), '[]'::jsonb)
    )
    FROM areas_verdes
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
