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
import { Trees, ShieldCheck, Sun, Layers } from 'lucide-react';

interface DashboardViewProps {
  stats: DashboardStats;
}

const PIE_COLORS = ['#10b981', '#84cc16', '#f59e0b', '#ef4444'];

export default function DashboardView({ stats }: DashboardViewProps) {
  const pieData = [
    { name: 'Muito Boa', value: stats.porClasse.muitoBoa },
    { name: 'Boa', value: stats.porClasse.boa },
    { name: 'Regular', value: stats.porClasse.regular },
    { name: 'Ruim', value: stats.porClasse.ruim },
  ];

  return (
    <div className="w-full h-full bg-slate-950 p-4 md:p-6 overflow-y-auto pt-24 md:pt-28 pb-16">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* CABEÇALHO DO DASHBOARD (Sem sobreposição!) */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
              <Trees className="w-6 h-6 text-emerald-400 shrink-0" />
              Dashboard Analítico de Inteligência Geográfica
            </h2>
            <p className="text-xs md:text-sm text-slate-400 mt-1">
              Caracterização e Avaliação Multicritério das Praças Urbanas de Dourados-MS (TCC UFGD)
            </p>
          </div>
          <div className="bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl text-xs text-emerald-400 font-semibold self-start md:self-auto shrink-0 shadow-md">
            4 Critérios: Ecológica • Permeabilidade ≥70% • Estética • Lazer
          </div>
        </div>

        {/* 4 CARTOES KPI SUPERIORES */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1 */}
          <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl shadow-xl flex items-center gap-3">
            <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
              <Trees className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-400 block">Total de Praças Mapeadas</span>
              <span className="text-2xl font-black text-white">{stats.totalPracas}</span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl shadow-xl flex items-center gap-3">
            <div className="p-3 bg-teal-500/20 text-teal-400 rounded-xl border border-teal-500/30">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-400 block">Área Verde Total</span>
              <span className="text-2xl font-black text-white">{stats.areaTotalHa.toFixed(2)} <span className="text-xs font-normal text-slate-400">ha</span></span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl shadow-xl flex items-center gap-3">
            <div className="p-3 bg-lime-500/20 text-lime-400 rounded-xl border border-lime-500/30">
              <Sun className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-400 block">NDVI Médio Municipal</span>
              <span className="text-2xl font-black text-white">{stats.ndviMedio.toFixed(3)}</span>
            </div>
          </div>

          {/* Card 4 */}
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

        {/* GRÁFICOS ANALÍTICOS (RECHARTS) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Gráfico 1: Pizza de Distribuição por Classe */}
          <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-xl">
            <h3 className="text-sm font-bold text-white mb-1">
              Distribuição por Nível de Qualidade das Praças
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Classificação baseada no somatório das 4 funções urbanísticas
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
                    label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
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

          {/* Gráfico 2: Maiores Praças por Área (ha) */}
          <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-xl">
            <h3 className="text-sm font-bold text-white mb-1">
              Maiores Unidades de Áreas Verdes Mapeadas (ha)
            </h3>
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
