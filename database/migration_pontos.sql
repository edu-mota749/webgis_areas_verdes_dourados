-- =====================================================================
-- MIGRAÇÃO: Novos campos nas tabelas de pontos
-- Executar no Supabase SQL Editor (seguro para rodar mais de uma vez)
-- =====================================================================

-- Equipamentos (Lazer): adicionar autor e data
ALTER TABLE equipamentos
  ADD COLUMN IF NOT EXISTS autor VARCHAR(100),
  ADD COLUMN IF NOT EXISTS data  DATE;

-- Fotografias (Estética): adicionar tipo
ALTER TABLE fotografias
  ADD COLUMN IF NOT EXISTS tipo VARCHAR(50);

-- =====================================================================
-- Verificação: confirmar que os campos foram adicionados
-- =====================================================================
SELECT column_name, data_type, character_maximum_length
FROM information_schema.columns
WHERE table_name IN ('equipamentos', 'fotografias')
  AND column_name IN ('autor', 'data', 'tipo')
ORDER BY table_name, column_name;
