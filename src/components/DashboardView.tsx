'use client';

import { DashboardStats } from '@/types/gis';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Trees, ShieldCheck, Sun, Layers, CheckCircle2, Award, Activity, PieChart as PieIcon } from 'lucide-react';

interface DashboardViewProps {
  stats: DashboardStats;
}

const PIE_COLORS = ['#10b981', '#84cc16', '#f59e0b', '#ef4444'];
const CONFORMIDADE_COLORS = ['#10b981', '#ef4444'];

export default function DashboardView({ stats }: DashboardViewProps) {
  // 1. Pizza - Qualidade Geral
  const pieData = [
    { name: 'Muito Boa', value: stats.porClasse.muitoBoa },
    { name: 'Boa', value: stats.porClasse.boa },
    { name: 'Regular', value: stats.porClasse.regular },
    { name: 'Ruim', value: stats.porClasse.ruim },
  ];

  // 2. Barras - 4 Funções Multicritério
  const funcoesData = [
    { funcao: 'Permeabilidade (≥70%)', quantidade: stats.funcoesAtendidas?.permeab || 0, fill: '#10b981' },
    { funcao: 'Estética (Paisagismo)', quantidade: stats.funcoesAtendidas?.estetica || 0, fill: '#0ea5e9' },
    { funcao: 'Lazer (Infraestrutura)', quantidade: stats.funcoesAtendidas?.lazer || 0, fill: '#f59e0b' },
    { funcao: 'Ecológica (Vigor NDVI)', quantidade: stats.funcoesAtendidas?.ecol || 0, fill: '#84cc16' },
  ];

  // 3. Faixas Radiométricas de NDVI
  const ndviFaixasData = stats.faixasNdvi || [
    { faixa: 'Baixa/esparsa (< 0,300)', quantidade: 0, fill: '#f59e0b' },
    { faixa: 'Moderada (0,300–0,500)', quantidade: 0, fill: '#84cc16' },
    { faixa: 'Densa (> 0,500)', quantidade: 0, fill: '#10b981' },
  ];

  // 4. Conformidade de Permeabilidade
  const conformidadeData = stats.conformidadePermeab || [
    { status: 'Conforme (≥70%)', quantidade: 0 },
    { status: 'Não Conforme (<70%)', quantidade: 0 },
  ];

  return (
    <div className="w-full h-full bg-slate-950 p-4 md:p-6 overflow-y-auto pt-24 md:pt-28 pb-16">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* CABEÇALHO DO DASHBOARD */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
              <Trees className="w-6 h-6 text-emerald-400 shrink-0" />
              Dashboard Analítico de Inteligência Geográfica
            </h2>
            <p className="text-xs md:text-sm text-slate-400 mt-1">
              Caracterização e Avaliação Multicritério dos Espaços Públicos de Lazer de Dourados-MS
            </p>
          </div>
          <div className="bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl text-xs text-emerald-400 font-semibold self-start md:self-auto shrink-0 shadow-md flex items-center gap-2">
            <Award className="w-4 h-4 text-emerald-400" />
            <span>4 Critérios: Ecológica • Permeabilidade ≥70% • Estética • Lazer</span>
          </div>
        </div>

        {/* 4 CARTÕES KPI SUPERIORES */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl shadow-xl flex items-center gap-3">
            <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
              <Trees className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-400 block">Total de Áreas Mapeadas</span>
              <span className="text-2xl font-black text-white">{stats.totalPracas}</span>
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl shadow-xl flex items-center gap-3">
            <div className="p-3 bg-teal-500/20 text-teal-400 rounded-xl border border-teal-500/30">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-400 block">Área Total Mapeada</span>
              <span className="text-2xl font-black text-white">{stats.areaTotalHa.toFixed(2)} <span className="text-xs font-normal text-slate-400">ha</span></span>
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl shadow-xl flex items-center gap-3">
            <div className="p-3 bg-lime-500/20 text-lime-400 rounded-xl border border-lime-500/30">
              <Sun className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-400 block">NDVI Médio Municipal</span>
              <span className="text-2xl font-black text-white">{stats.ndviMedio.toFixed(3)}</span>
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl shadow-xl flex items-center gap-3">
            <div className="p-3 bg-cyan-500/20 text-cyan-400 rounded-xl border border-cyan-500/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-400 block">Taxa PUGS Média</span>
              <span className="text-2xl font-black text-white">{stats.pugsMedio.toFixed(1)}%</span>
            </div>
          </div>
        </div>

        {/* PAINEL DE GRÁFICOS - SEÇÃO 1: AVALIAÇÃO MULTICRITÉRIO DO TCC */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Gráfico 1: Pizza de Distribuição por Classe de Qualidade */}
          <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-xl">
            <div className="flex items-center gap-2 mb-1">
              <PieIcon className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">
                Distribuição por Nível de Qualidade das Áreas
              </h3>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Classificação final multicritério (Muito Boa = 4 func, Boa = 3, Regular = 2, Ruim = ≤1)
            </p>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart margin={{ top: 25, right: 20, bottom: 10, left: 20 }}>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="46%"
                    innerRadius={42}
                    outerRadius={70}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    labelLine={true}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                    itemStyle={{ color: '#f8fafc' }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    align="center"
                    iconSize={10}
                    wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Gráfico 2: Atendimento das 4 Funções Multicritério */}
          <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-xl">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle2 className="w-4 h-4 text-teal-400" />
              <h3 className="text-sm font-bold text-white">
                Taxa de Atendimento das 4 Funções Urbanísticas
              </h3>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Quantidade de áreas que cumprem cada função avaliada na metodologia do TCC
            </p>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={funcoesData} layout="vertical" margin={{ top: 10, right: 20, left: 40, bottom: 10 }}>
                  <XAxis type="number" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <YAxis dataKey="funcao" type="category" tick={{ fill: '#94a3b8', fontSize: 10 }} width={120} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                    itemStyle={{ color: '#38bdf8' }}
                  />
                  <Bar dataKey="quantidade" radius={[0, 6, 6, 0]} name="Praças Atendidas">
                    {funcoesData.map((entry, index) => (
                      <Cell key={`cell-func-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* PAINEL DE GRÁFICOS - SEÇÃO 2: ANÁLISE RADIOMÉTRICA & AMBIENTAL */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Gráfico 3: Métricas Médias (NDVI e PUGS %) por Classe */}
          <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-xl">
            <div className="flex items-center gap-2 mb-1">
              <Activity className="w-4 h-4 text-lime-400" />
              <h3 className="text-sm font-bold text-white">
                NDVI e Cobertura Vegetal (PUGS %) por Classe
              </h3>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Correlação entre o vigor vegetal espectral e a porcentagem de área vegetada por classe
            </p>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.metricasPorClasse || []} margin={{ top: 15, right: 15, left: -10, bottom: 15 }}>
                  <XAxis dataKey="classe" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <YAxis yAxisId="left" orientation="left" stroke="#84cc16" tick={{ fill: '#84cc16', fontSize: 11 }} domain={[0, 1]} />
                  <YAxis yAxisId="right" orientation="right" stroke="#10b981" tick={{ fill: '#10b981', fontSize: 11 }} domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                  />
                  <Legend verticalAlign="top" wrapperStyle={{ fontSize: '11px', paddingBottom: '10px' }} />
                  <Bar yAxisId="left" dataKey="ndviMedio" name="NDVI Médio" fill="#84cc16" radius={[4, 4, 0, 0]} />
                  <Bar yAxisId="right" dataKey="pugsMedio" name="PUGS Médio (%)" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Gráfico 4: Distribuição por Faixas de NDVI (Vigor Vegetal) */}
          <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-xl">
            <div className="flex items-center gap-2 mb-1">
              <Sun className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold text-white">
                Classificação Radiométrica por Faixa de NDVI
              </h3>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Distribuição do vigor da biomassa (Baixa/esparsa: &lt; 0,300, Moderada: 0,300–0,500, Densa: &gt; 0,500)
            </p>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ndviFaixasData} margin={{ top: 15, right: 15, left: -10, bottom: 15 }}>
                  <XAxis dataKey="faixa" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                    itemStyle={{ color: '#f59e0b' }}
                  />
                  <Bar dataKey="quantidade" name="Quantidade de Praças" radius={[6, 6, 0, 0]}>
                    {ndviFaixasData.map((entry, index) => (
                      <Cell key={`cell-ndvi-${index}`} fill={(entry as any).fill || '#f59e0b'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* PAINEL DE GRÁFICOS - SEÇÃO 3: PERMEABILIDADE E RANKING */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Gráfico 5: Conformidade da Permeabilidade (PUGS >= 70%) */}
          <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-xl">
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck className="w-4 h-4 text-teal-400" />
              <h3 className="text-sm font-bold text-white">
                Conformidade da Taxa de Permeabilidade Solo (≥70%)
              </h3>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Atendimento ao parâmetro mínimo de solo permeável (Cavalheiro et al. 1999)
            </p>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart margin={{ top: 25, right: 20, bottom: 10, left: 20 }}>
                  <Pie
                    data={conformidadeData}
                    cx="50%"
                    cy="46%"
                    innerRadius={45}
                    outerRadius={75}
                    paddingAngle={5}
                    dataKey="quantidade"
                    nameKey="status"
                    label={({ status, percent }) => `${status.split(' ')[0]}: ${(percent * 100).toFixed(0)}%`}
                    labelLine={true}
                  >
                    {conformidadeData.map((entry, index) => (
                      <Cell key={`cell-conf-${index}`} fill={CONFORMIDADE_COLORS[index % CONFORMIDADE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                    itemStyle={{ color: '#f8fafc' }}
                  />
                  <Legend verticalAlign="bottom" align="center" iconSize={10} wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Gráfico 6: Ranking das Maiores Praças por Área (ha) */}
          <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-xl">
            <div className="flex items-center gap-2 mb-1">
              <Trees className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">
                Maiores Unidades de Áreas Verdes Mapeadas (ha)
              </h3>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Ranking de extensão territorial em hectares no município de Dourados-MS
            </p>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.topMaiores} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                  <XAxis
                    dataKey="nome"
                    tick={{ fill: '#94a3b8', fontSize: 10 }}
                    angle={-20}
                    textAnchor="end"
                  />
                  <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                    itemStyle={{ color: '#34d399' }}
                  />
                  <Bar dataKey="area_ha" fill="#10b981" radius={[6, 6, 0, 0]} name="Área (ha)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
