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

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[9999] flex items-end"
      style={{ background: 'rgba(0,0,0,0.45)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Painel deslizante */}
      <div
        ref={sheetRef}
        className="w-full rounded-t-2xl overflow-hidden"
        style={{
          background:   'rgba(15, 23, 42, 0.97)',
          border:       '1px solid rgba(255,255,255,0.12)',
          borderBottom: 'none',
          boxShadow:    '0 -20px 40px rgba(0,0,0,0.7)',
          maxHeight:    '82dvh',
          animation:    'slideUp 0.28s cubic-bezier(0.32, 0.72, 0, 1)',
          willChange:   'transform',
        }}
      >
        {/* Handle de arraste — toque e arraste para fechar */}
        <div
          ref={handleRef}
          className="flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing select-none"
          style={{ touchAction: 'none' }} // necessário para touchmove funcionar sem scroll
        >
          <div
            className="w-10 h-1.5 rounded-full"
            style={{ background: 'rgba(148,163,184,0.5)' }}
          />
        </div>

        {/* Conteúdo com scroll independente */}
        <div className="overflow-y-auto" style={{ maxHeight: 'calc(82dvh - 32px)' }}>

          {/* Foto da área (se disponível) */}
          {p.foto_url && (
            <div className="overflow-hidden" style={{ maxHeight: '180px' }}>
              <img
                src={p.foto_url}
                alt={p.nome}
                loading="lazy"
                className="w-full object-cover"
                style={{ maxHeight: '180px' }}
                onError={(e) => {
                  (e.currentTarget.parentElement as HTMLElement).style.display = 'none';
                }}
              />
            </div>
          )}

          <div className="px-4 pt-3 pb-6">
            {/* Header: Nome + Badge + Fechar */}
            <div className="flex items-start justify-between gap-3 mb-3">
              <h2 className="text-base font-bold text-white leading-tight flex-1">{p.nome}</h2>
              <div className="flex items-center gap-2 shrink-0">
                <span
                  className="px-2.5 py-1 text-xs font-bold rounded-full text-white"
                  style={{ background: classeColor }}
                >
                  {p.classe}
                </span>
                <button
                  onClick={onClose}
                  className="w-7 h-7 rounded-full flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                  style={{ background: 'rgba(255,255,255,0.08)' }}
                  aria-label="Fechar"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Dados principais */}
            <div className="space-y-1.5 text-sm text-slate-300 mb-4">
              <p>📍 <strong className="text-slate-100">Bairro:</strong> {p.bairro} ({p.tipo})</p>
              <p><strong className="text-slate-100">Área:</strong> {p.area_m2.toLocaleString('pt-BR')} m² ({p.area_ha} ha)</p>
              <p><strong className="text-slate-100">Perímetro:</strong> {p.perimetro.toLocaleString('pt-BR')} m</p>
              <p>
                <strong className="text-slate-100">NDVI Médio:</strong>{' '}
                <span className="font-bold text-emerald-400">{p.ndvi_med.toFixed(3)}</span>
              </p>
              <p>
                <strong className="text-slate-100">PUGS (% Verde):</strong>{' '}
                <span className="font-bold text-teal-300">{p.pugs.toFixed(1)}%</span>
              </p>
            </div>

            {/* Avaliação das 4 funções */}
            <div
              className="rounded-xl p-3 mb-3"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <span className="text-xs font-semibold text-slate-400 block mb-2">AVALIAÇÃO DAS 4 FUNÇÕES</span>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'Ecológica',      val: p.ecol },
                  { label: 'Permeabilidade', val: p.permeab },
                  { label: 'Estética',       val: p.estetica },
                  { label: 'Lazer',          val: p.lazer },
                ].map(({ label, val }) => (
                  <div key={label} className="flex items-center gap-1.5 text-xs">
                    <span
                      className="w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0"
                      style={{
                        background: val ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.15)',
                        color:      val ? '#10b981'              : '#ef4444',
                        border:     `1px solid ${val ? 'rgba(16,185,129,0.4)' : 'rgba(239,68,68,0.3)'}`,
                      }}
                    >
                      {val ? '✓' : '✗'}
                    </span>
                    <span className={val ? 'text-slate-200' : 'text-slate-500 line-through'}>
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Observação */}
            {p.observacao && (
              <p
                className="text-xs text-slate-400 italic rounded-lg p-3"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                {p.observacao}
              </p>
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
