'use client';

import { useEffect, useRef } from 'react';
import { AreaVerdeFeature } from '@/types/gis';

const COLOR_MAP: Record<string, string> = {
  'Muito Boa': '#10b981',
  'Boa':       '#84cc16',
  'Regular':   '#f59e0b',
  'Ruim':      '#ef4444',
};

interface AreaVerdeBottomSheetProps {
  feature: AreaVerdeFeature | null;
  onClose: () => void;
}

export default function AreaVerdeBottomSheet({ feature, onClose }: AreaVerdeBottomSheetProps) {
  const sheetRef    = useRef<HTMLDivElement>(null);
  const handleRef   = useRef<HTMLDivElement>(null);
  const overlayRef  = useRef<HTMLDivElement>(null);

  // Fecha ao pressionar Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  // Drag-to-close: acompanha o dedo e fecha ao soltar com delta suficiente
  useEffect(() => {
    const sheet   = sheetRef.current;
    const handle  = handleRef.current;
    const overlay = overlayRef.current;
    if (!sheet || !handle || !overlay || !feature) return;

    let startY      = 0;
    let currentDelta = 0;
    let dragging    = false;

    const onTouchStart = (e: TouchEvent) => {
      startY       = e.touches[0].clientY;
      currentDelta = 0;
      dragging     = true;
      // Remove transição enquanto o dedo está em contato (movimento fluido)
      sheet.style.transition = 'none';
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!dragging) return;
      const delta = e.touches[0].clientY - startY;
      if (delta <= 0) return; // não permite arrastar para cima

      e.preventDefault(); // impede o scroll enquanto arrasta o handle
      currentDelta = delta;

      // Move o painel com o dedo com resistência leve (sqrt para suavizar)
      const resistance = Math.sqrt(delta) * 2.5;
      const translate  = Math.min(delta, delta * 0.85 + resistance * 0.15);
      sheet.style.transform = `translateY(${translate}px)`;

      // Escurece o overlay proporcionalmente
      const opacity = Math.max(0, 0.45 - (delta / 400) * 0.45);
      overlay.style.background = `rgba(0,0,0,${opacity.toFixed(2)})`;
    };

    const onTouchEnd = () => {
      if (!dragging) return;
      dragging = false;

      sheet.style.transition = 'transform 0.3s cubic-bezier(0.32, 0.72, 0, 1)';
      overlay.style.transition = 'background 0.3s ease';

      if (currentDelta > 110) {
        // Passa do limiar → fecha com animação
        sheet.style.transform = 'translateY(100%)';
        overlay.style.background = 'rgba(0,0,0,0)';
        setTimeout(onClose, 290);
      } else {
        // Abaixo do limiar → snap de volta
        sheet.style.transform = 'translateY(0)';
        overlay.style.background = 'rgba(0,0,0,0.45)';
      }

      currentDelta = 0;
    };

    // Eventos apenas no handle (para não bloquear scroll do conteúdo)
    handle.addEventListener('touchstart',  onTouchStart, { passive: true });
    handle.addEventListener('touchmove',   onTouchMove,  { passive: false });
    handle.addEventListener('touchend',    onTouchEnd,   { passive: true });
    handle.addEventListener('touchcancel', onTouchEnd,   { passive: true });

    return () => {
      handle.removeEventListener('touchstart',  onTouchStart);
      handle.removeEventListener('touchmove',   onTouchMove);
      handle.removeEventListener('touchend',    onTouchEnd);
      handle.removeEventListener('touchcancel', onTouchEnd);
    };
  }, [feature, onClose]);

  if (!feature) return null;

  const p           = feature.properties;
  const classeColor = COLOR_MAP[p.classe] || '#3b82f6';
  const rawUrl      = p.foto_url;
  const cleanUrl    = rawUrl ? rawUrl.replace('/fotos-campo/files/', '/fotos-campo/').replace(/^files\//, '') : undefined;
  const imageUrl    = cleanUrl ? (cleanUrl.startsWith('http') ? cleanUrl : `https://hhouklrgffoyovnhsmcb.supabase.co/storage/v1/object/public/fotos-campo/${cleanUrl.replace(/^\//, '')}`) : undefined;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[9999] flex items-end md:items-center md:justify-center p-0 md:p-4 transition-opacity duration-200"
      style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Painel deslizante no mobile / Modal centralizado no desktop */}
      <div
        ref={sheetRef}
        className="w-full md:max-w-xl md:rounded-2xl rounded-t-2xl overflow-hidden flex flex-col"
        style={{
          background:   'rgba(15, 23, 42, 0.98)',
          border:       '1px solid rgba(255,255,255,0.15)',
          boxShadow:    '0 25px 50px -12px rgba(0,0,0,0.85)',
          maxHeight:    '85dvh',
          animation:    'slideUp 0.28s cubic-bezier(0.32, 0.72, 0, 1)',
          willChange:   'transform',
        }}
      >
        {/* Handle de arraste (mobile apenas) */}
        <div
          ref={handleRef}
          className="flex md:hidden justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing select-none"
          style={{ touchAction: 'none' }}
        >
          <div
            className="w-10 h-1.5 rounded-full"
            style={{ background: 'rgba(148,163,184,0.5)' }}
          />
        </div>

        {/* Conteúdo com scroll independente */}
        <div className="overflow-y-auto" style={{ maxHeight: 'calc(85dvh - 20px)' }}>

          {/* Foto da área (se disponível) em Alta Resolução */}
          {imageUrl && (
            <div className="overflow-hidden relative bg-slate-900 group">
              <img
                src={imageUrl}
                alt={p.nome}
                loading="lazy"
                className="w-full object-cover h-52 md:h-72 transition-transform duration-300 group-hover:scale-105"
                onError={(e) => {
                  (e.currentTarget.parentElement as HTMLElement).style.display = 'none';
                }}
              />
              <div
                className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold shadow-lg text-white"
                style={{
                  background: classeColor,
                  boxShadow: `0 4px 14px ${classeColor}55`,
                }}
              >
                <span>Qualidade {p.classe}</span>
              </div>

              <a
                href={imageUrl}
                target="_blank"
                rel="noreferrer"
                className="absolute top-3 right-3 bg-slate-900/80 hover:bg-slate-900 text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg border border-slate-700 backdrop-blur-md flex items-center gap-1 transition-colors shadow-md"
                title="Abrir imagem em tamanho original"
              >
                🔍 Ampliar Foto
              </a>
            </div>
          )}

          <div className="p-4 md:p-6">
            {/* Header: Nome + Badge + Fechar */}
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="flex-1">
                <div
                  className="w-10 h-1 rounded-full mb-2"
                  style={{ background: classeColor }}
                />
                <h2 className="text-lg md:text-xl font-extrabold text-white leading-tight">{p.nome}</h2>
                <p className="text-xs md:text-sm text-slate-400 mt-1">📍 {p.bairro} • {p.tipo}</p>
              </div>

              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-slate-400 hover:text-white transition-colors bg-slate-800 border border-slate-700 hover:bg-slate-700"
                aria-label="Fechar"
              >
                ✕
              </button>
            </div>

            {/* Dados principais em Grid de Métricas */}
            <div className="grid grid-cols-2 gap-3 mb-4 text-xs md:text-sm">
              <div className="bg-slate-950/60 border border-slate-800 p-3 rounded-xl">
                <span className="text-[10px] uppercase font-bold text-slate-500 block mb-0.5">Área Mapeada</span>
                <span className="font-bold text-white text-sm md:text-base">{p.area_m2.toLocaleString('pt-BR')} m²</span>
                <span className="text-xs text-slate-400 block font-medium">({p.area_ha} ha)</span>
              </div>

              <div className="bg-slate-950/60 border border-slate-800 p-3 rounded-xl">
                <span className="text-[10px] uppercase font-bold text-slate-500 block mb-0.5">Perímetro</span>
                <span className="font-bold text-white text-sm md:text-base">{p.perimetro.toLocaleString('pt-BR')} m</span>
              </div>

              <div className="bg-slate-950/60 border border-slate-800 p-3 rounded-xl">
                <span className="text-[10px] uppercase font-bold text-slate-500 block mb-0.5">NDVI Médio (Vigor)</span>
                <span className="font-bold text-emerald-400 text-sm md:text-base">{p.ndvi_med.toFixed(3)}</span>
              </div>

              <div className="bg-slate-950/60 border border-slate-800 p-3 rounded-xl">
                <span className="text-[10px] uppercase font-bold text-slate-500 block mb-0.5">PUGS (% Solo Verde)</span>
                <span className="font-bold text-teal-300 text-sm md:text-base">{p.pugs.toFixed(1)}%</span>
              </div>
            </div>

            {/* Avaliação das 4 funções */}
            <div
              className="rounded-xl p-4 mb-4"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <span className="text-xs font-bold text-slate-300 block mb-3 uppercase tracking-wider">AVALIAÇÃO MULTICRITÉRIO DAS 4 FUNÇÕES:</span>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Função Ecológica (NDVI)',      val: p.ecol },
                  { label: 'Permeabilidade Solo (≥70%)', val: p.permeab },
                  { label: 'Função Estética (Paisagismo)', val: p.estetica },
                  { label: 'Função de Lazer (Infra)',     val: p.lazer },
                ].map(({ label, val }) => (
                  <div key={label} className="flex items-center gap-2 text-xs md:text-sm">
                    <span
                      className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                      style={{
                        background: val ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.15)',
                        color:      val ? '#10b981'              : '#ef4444',
                        border:     `1px solid ${val ? 'rgba(16,185,129,0.4)' : 'rgba(239,68,68,0.3)'}`,
                      }}
                    >
                      {val ? '✓' : '✗'}
                    </span>
                    <span className={val ? 'text-slate-200 font-medium' : 'text-slate-500 line-through'}>
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Observação */}
            {p.observacao && (
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 block mb-1">Observações de Campo:</span>
                <p
                  className="text-xs md:text-sm text-slate-300 italic rounded-xl p-3.5"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
                >
                  {p.observacao}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0.4; }
          to   { transform: translateY(0);    opacity: 1;   }
        }
      `}</style>
    </div>
  );
}

