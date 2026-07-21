-- =====================================================================
-- WEBGIS - TCC ÁREAS VERDES DE DOURADOS-MS
-- SEED DATA (Dados de Teste de Praças Reais de Dourados-MS)
-- =====================================================================

INSERT INTO areas_verdes (nome, tipo, bairro, area_m2, area_ha, perimetro, ndvi_med, pugs, ecol, permeab, estetica, lazer, total_func, classe, observacao, geom)
VALUES
(
  'Praça Antônio João', 
  'Praça', 
  'Centro', 
  14500.00, 
  1.4500, 
  480.00, 
  0.645, 
  81.50, 
  1, 1, 1, 1, 4, 
  'Muito Boa', 
  'Praça central principal com concha acústica, alta densidade arbórea e fonte iluminada.',
  ST_GeomFromText('POLYGON((-54.8070 -22.2230, -54.8055 -22.2230, -54.8055 -22.2245, -54.8070 -22.2245, -54.8070 -22.2230))', 4326)
),
(
  'Parque Antenor Martins', 
  'Parque', 
  'Jardim Flórida', 
  185000.00, 
  18.5000, 
  1920.00, 
  0.780, 
  92.30, 
  1, 1, 1, 1, 4, 
  'Muito Boa', 
  'Parque urbano extenso com lago artificial, pista de caminhada e intensa área de preservação.',
  ST_GeomFromText('POLYGON((-54.8370 -22.2270, -54.8330 -22.2270, -54.8330 -22.2310, -54.8370 -22.2310, -54.8370 -22.2270))', 4326)
),
(
  'Praça Paraguaia', 
  'Praça', 
  'Jardim Itália', 
  8200.00, 
  0.8200, 
  360.00, 
  0.510, 
  73.20, 
  1, 1, 1, 0, 3, 
  'Boa', 
  'Praça com boa vegetação, sombreamento adequado e bancos, necessita reforma nos brinquedos.',
  ST_GeomFromText('POLYGON((-54.7995 -22.2150, -54.7975 -22.2150, -54.7975 -22.2165, -54.7995 -22.2165, -54.7995 -22.2150))', 4326)
),
(
  'CEPER BNH 3.º Plano', 
  'CEPER', 
  'BNH 3º Plano', 
  22400.00, 
  2.2400, 
  610.00, 
  0.420, 
  62.00, 
  0, 0, 1, 1, 2, 
  'Regular', 
  'Centro Poliesportivo e Recreativo com quadras e campo, porém permeabilidade do solo abaixo de 70%.',
  ST_GeomFromText('POLYGON((-54.8105 -22.2035, -54.8075 -22.2035, -54.8075 -22.2055, -54.8105 -22.2055, -54.8105 -22.2035))', 4326)
),
(
  'Praça Parque Alvorada', 
  'Praça', 
  'Parque Alvorada', 
  5100.00, 
  0.5100, 
  290.00, 
  0.280, 
  45.00, 
  0, 0, 0, 1, 1, 
  'Ruim', 
  'Área pública predominantemente pavimentada, poucas árvores e alta degradação do mobiliário.',
  ST_GeomFromText('POLYGON((-54.8220 -22.2110, -54.8200 -22.2110, -54.8200 -22.2130, -54.8220 -22.2130, -54.8220 -22.2110))', 4326)
);

-- Inserir fotografias de teste
INSERT INTO fotografias (id_area, url, descricao, autor, data, geom)
VALUES
(1, 'https://images.unsplash.com/photo-1519331379826-f10be5486c6f?w=800', 'Vista aérea da Praça Antônio João', 'TCC Geoprocessamento UFGD', '2026-03-15', ST_SetSRID(ST_MakePoint(-54.8062, -22.2238), 4326)),
(1, 'https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?w=800', 'Área de descanso e arborização', 'TCC Geoprocessamento UFGD', '2026-03-15', ST_SetSRID(ST_MakePoint(-54.8063, -22.2239), 4326)),
(2, 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800', 'Lago do Parque Antenor Martins', 'TCC Geoprocessamento UFGD', '2026-04-10', ST_SetSRID(ST_MakePoint(-54.8350, -22.2290), 4326));

-- Inserir equipamentos de teste
INSERT INTO equipamentos (id_area, tipo, estado, observacao, geom)
VALUES
(1, 'Concha Acústica', 'Bom', 'Palco para eventos culturais municipais', ST_SetSRID(ST_MakePoint(-54.8061, -22.2237), 4326)),
(1, 'Academia da Terceira Idade', 'Bom', 'Aparelhos em bom estado de conservação', ST_SetSRID(ST_MakePoint(-54.8065, -22.2241), 4326)),
(2, 'Pista de Caminhada', 'Bom', 'Pista asfaltada de 2.2km contornando o lago', ST_SetSRID(ST_MakePoint(-54.8340, -22.2280), 4326)),
(2, 'Playground Infantil', 'Regular', 'Brinquedos de madeira necessitando pintura', ST_SetSRID(ST_MakePoint(-54.8355, -22.2295), 4326));
