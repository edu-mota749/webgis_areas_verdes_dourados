'use client';

import { useState } from 'react';
import { BookOpen, GraduationCap, MapPin } from 'lucide-react';

export default function AboutView() {
  const [logoError, setLogoError] = useState(false);

  return (
    <div className="w-full h-full bg-slate-950 p-4 md:p-6 overflow-y-auto pt-24 md:pt-28 pb-16">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Cartão Institucional com a Logo Oficial da UFGD */}
        <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {!logoError ? (
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-slate-950 border border-emerald-500/30 p-2 flex items-center justify-center shrink-0 shadow-lg">
                <img
                  src="/logo.png"
                  alt="Logo UFGD"
                  onError={() => setLogoError(true)}
                  className="w-full h-full object-contain"
                />
              </div>
            ) : (
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center font-black text-emerald-400 text-xl shrink-0 shadow-lg">
                UFGD
              </div>
            )}
            <div>
              <h3 className="text-base md:text-lg font-bold text-white leading-tight">
                Universidade Federal da Grande Dourados
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                FACET — Faculdade de Ciências Exatas e Tecnologia
              </p>
              <span className="inline-block mt-1.5 px-2.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 text-[10px] font-semibold border border-emerald-500/30">
                Bacharelado em Sistemas de Informação
              </span>
            </div>
          </div>
        </div>

        {/* Banner do TCC */}
        <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold tracking-widest uppercase">
            <GraduationCap className="w-5 h-5" />
            Trabalho de Conclusão de Curso • TCC UFGD
          </div>

          <h1 className="text-xl md:text-2xl font-black text-white leading-tight">
            Caracterização de praças urbanas por meio de técnicas de sensoriamento remoto e geoprocessamento em Dourados-MS
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 text-xs text-slate-300 border-t border-slate-800">
            <div>
              <span className="text-slate-500 font-semibold block">Autores:</span>
              <strong className="text-white">Eduardo Mota Araújo</strong>
              <br />
              <strong className="text-white">Luis Felipe Lima dos Santos</strong>
            </div>
            <div>
              <span className="text-slate-500 font-semibold block">Orientador:</span>
              <strong className="text-white">Prof.ª Rodrido Porfirio da Silva Sacchi</strong>
            </div>
            <div>
              <span className="text-slate-500 font-semibold block">Instituição:</span>
              <strong className="text-white">UFGD / FACET</strong>
            </div>
          </div>
        </div>

        {/* Resumo da Metodologia */}
        <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
            <BookOpen className="w-4 h-4 text-emerald-400" />
            Metodologia e Avaliação Multicritério
          </h2>

          <p className="text-xs text-slate-300 leading-relaxed">
            O crescimento urbano acelerado em Dourados-MS exige ferramentas tecnológicas e escaláveis para o monitoramento contínuo de suas praças públicas. A metodologia baseia-se na extração espacial e vetorização das praças em ambiente SIG (software QGIS) e PostGIS, utilizando imagens de satélite de alta resolução e cálculo do índice espectral <strong>NDVI (Normalized Difference Vegetation Index)</strong>.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 space-y-1">
              <span className="text-xs font-bold text-emerald-400">1. Função Ecológica (NDVI)</span>
              <p className="text-[11px] text-slate-400">Mensura a biomassa e o vigor da vegetação no interior da praça através do infravermelho próximo (NIR) e vermelho (RED).</p>
            </div>

            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 space-y-1">
              <span className="text-xs font-bold text-teal-400">2. Taxa de Permeabilidade (PUGS)</span>
              <p className="text-[11px] text-slate-400">Avalia se a praça atende ao parâmetro mínimo de 70% de superfície permeável e solo não impermeabilizado.</p>
            </div>

            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 space-y-1">
              <span className="text-xs font-bold text-lime-400">3. Função Estética</span>
              <p className="text-[11px] text-slate-400">Aferida de forma complementar em visitas a campo, considerando qualidade paisagística e visual.</p>
            </div>

            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 space-y-1">
              <span className="text-xs font-bold text-cyan-400">4. Função de Lazer</span>
              <p className="text-[11px] text-slate-400">Verifica a presença de infraestrutura (playground, academia, quadras, bancos e passeios públicos).</p>
            </div>
          </div>
        </div>

        {/* Projeção Cartográfica */}
        <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-3 text-xs text-slate-300">
          <h2 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
            <MapPin className="w-4 h-4 text-emerald-400" />
            Parâmetros de Geoprocessamento & CRS
          </h2>
          <p>
            Os dados espaciais são vetorizados e processados no QGIS utilizando o Sistema de Referência de Coordenadas <strong>SIRGAS 2000 / UTM Zone 21S (EPSG:31981)</strong> para cálculo exato de áreas em metros quadrados e hectares. No WebGIS, os dados são disponibilizados no padrão EPSG:4326 (WGS84).
          </p>
        </div>
      </div>
    </div>
  );
}
