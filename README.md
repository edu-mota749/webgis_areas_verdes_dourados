# WebGIS — Áreas Verdes de Dourados-MS

WebGIS para inventário, caracterização e análise das praças urbanas de
Dourados-MS, desenvolvido como Trabalho de Conclusão de Curso (TCC) na
Universidade Federal da Grande Dourados (UFGD / FACET — Bacharelado em
Sistemas de Informação).

O sistema permite visualizar o mapeamento das áreas verdes no mapa interativo,
consultar os atributos ecológicos e de infraestrutura de cada praça, analisar
estatísticas agregadas no painel analítico e explorar a metodologia de
avaliação multicritério adotada no estudo.

## Funcionalidades

- **Mapa interativo** (Leaflet) com as praças, parques e CEPERs de Dourados-MS,
  coloridos pela classificação de qualidade (Muito Boa, Boa, Regular, Ruim).
- **Camadas vetoriais** controláveis: polígonos das áreas verdes, pontos de
  fotografias de campo e pontos de equipamentos de lazer/esporte.
- **Barra de pesquisa** com autocompletar por nome da praça ou bairro, com zoom
  automático à geometria selecionada.
- **Painel de camadas** para alternar entre os mapas base (Google Satellite e
  OpenStreetMap) e controlar a visibilidade e a legenda de cada camada.
- **Popup de detalhes** (desktop) e **Bottom Sheet** (mobile) com todos os
  atributos da praça: NDVI médio, PUGS, avaliação das quatro funções (ecológica,
  permeabilidade, estética e lazer), classe final e galeria de fotografias.
- **Dashboard analítico** com estatísticas agregadas: total de praças, área
  total e média, distribuição por classe de qualidade e por bairro.
- **Exportação** da camada de áreas verdes em GeoJSON.
- **Barra cartográfica inferior** com as coordenadas dinâmicas do cursor e o
  total de feições carregadas.
- **Fallback offline** com dados mock embutidos: o mapa funciona mesmo sem
  conexão com o banco de dados.

## Metodologia de Avaliação

Cada praça é avaliada em quatro critérios e recebe uma classificação final:

| Critério | Descrição |
|----------|-----------|
| **Ecológica (NDVI)** | Vigor da vegetação calculado por sensoriamento remoto (NIR e RED) |
| **Permeabilidade (PUGS)** | % de área permeável/vegetada — mínimo de 70% (PUGS ≥ 70) |
| **Estética** | Qualidade paisagística e visual aferida em visitas de campo |
| **Lazer** | Presença de infraestrutura (playground, academia, quadras, bancos) |

A soma dos critérios atendidos (0–4) determina a classe final:

| Pontuação | Classe |
|-----------|--------|
| 4 | Muito Boa |
| 3 | Boa |
| 2 | Regular |
| 0–1 | Ruim |

## Arquitetura

| Camada | Stack |
|--------|-------|
| Frontend | Next.js 14, React 18, TypeScript, Tailwind CSS, Leaflet / React-Leaflet, Recharts |
| Banco de dados | Supabase (PostgreSQL + PostGIS) |
| Processamento espacial | QGIS, PostGIS (EPSG:31981 → EPSG:4326) |

O frontend consome a API do Supabase diretamente via `@supabase/supabase-js`
para buscar as camadas GeoJSON (`areas_verdes`, `fotografias` e `equipamentos`).
Caso a API esteja indisponível, o sistema usa dados mock embutidos em
`src/lib/mockData.ts`.

```
src/
  app/
    api/          # Route Handlers do Next.js (areas, fotografias, equipamentos)
    page.tsx      # Página principal — orquestração das abas e estado global
    layout.tsx    # Layout raiz (metadados, fonte)
  components/
    MapComponent.tsx         # Mapa Leaflet com todas as camadas vetoriais
    TopSearchBar.tsx         # Barra de pesquisa, filtros e navegação entre abas
    SidebarLayers.tsx        # Painel flutuante de camadas e legenda
    DashboardView.tsx        # Dashboard analítico (Recharts)
    AreaVerdeBottomSheet.tsx # Bottom Sheet de detalhes (mobile)
    AboutView.tsx            # Aba "Sobre" com metodologia e créditos do TCC
    BottomCartoBar.tsx       # Barra inferior com coordenadas e total de feições
  lib/
    supabase.ts   # Cliente Supabase
    mockData.ts   # Dados mock para fallback offline
  types/
    gis.ts        # Tipos TypeScript (AreaVerdeFeature, Fotografia, Equipamento…)
database/
  schema.sql                # Schema completo do Supabase (PostGIS)
  seed_dourados.sql         # Seed com os dados das praças
  update_geometrias.sql     # Scripts de atualização de geometrias
```

## Pré-requisitos

- [Node.js](https://nodejs.org/) 20+
- Conta no [Supabase](https://supabase.com/) com o schema aplicado (opcional —
  o sistema funciona offline com dados mock)

## Como rodar

### 1. Clonar e instalar dependências

```powershell
git clone https://github.com/<seu-usuario>/webgis_areas_verdes_dourados.git
cd webgis_areas_verdes_dourados
npm install
```

### 2. Configurar variáveis de ambiente

Copie o arquivo de exemplo e preencha com suas credenciais do Supabase:

```powershell
cp .env.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=https://sua-url-do-supabase.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anonima-publica
```

> **Nota:** sem as variáveis, o sistema utiliza os dados mock embutidos
> automaticamente — nenhum erro é lançado.

### 3. Configurar o banco de dados (opcional)

Execute os scripts na ordem no SQL Editor do Supabase:

```
database/schema.sql            # Cria as tabelas e índices espaciais
database/seed_dourados.sql     # Insere os dados das praças
database/update_geometrias.sql # Atualiza as geometrias dos polígonos
```

### 4. Iniciar o servidor de desenvolvimento

```powershell
npm run dev
```

O frontend fica disponível em `http://localhost:3000`.

### Lint

```powershell
npm run lint
```

## Autores

- **Eduardo Mota Araújo**
- **Luis Felipe Lima dos Santos**

Orientador: **Prof. Rodrigo Porfírio da Silva Sacchi**

Universidade Federal da Grande Dourados — UFGD / FACET
Bacharelado em Sistemas de Informação

## Licença

Uso acadêmico interno — TCC UFGD.
