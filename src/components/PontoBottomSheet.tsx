'use client';

import { useEffect, useRef } from 'react';
import { Fotografia, Equipamento } from '@/types/gis';

// ─── Paleta por tipo de ponto ────────────────────────────────────────────────
const FOTO_COLOR = '#0ea5e9';   // Azul — Estética / Fotografias
const EQUIP_COLOR = '#f59e0b';  // Âmbar — Lazer / Equipamentos

const ESTADO_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  'Bom':     { bg: 'rgba(16,185,129,0.15)',  text: '#10b981', border: 'rgba(16,185,129,0.4)' },
  'Regular': { bg: 'rgba(245,158,11,0.15)',  text: '#f59e0b', border: 'rgba(245,158,11,0.4)' },
  'Ruim':    { bg: 'rgba(239,68,68,0.15)',   text: '#ef4444', border: 'rgba(239,68,68,0.3)'  },
};

// ─── Tipos discriminados ──────────────────────────────────────────────────────
type PontoFoto = { kind: 'fotografia'; data: Fotografia };
type PontoEquip = { kind: 'equipamento'; data: Equipamento };
export type PontoSelecionado = PontoFoto | PontoEquip | null;

interface PontoBottomSheetProps {
  ponto: PontoSelecionado;
  onClose: () => void;
}

// ─── Utilitário: formatar data BR ─────────────────────────────────────────────
function formatDate(dateStr?: string): string {
  if (!dateStr) return '—';
  try {
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  } catch {
    return dateStr;
  }
}

// ─── Chip de metadado ─────────────────────────────────────────────────────────
function MetaChip({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">{label}</span>
      <span className="text-xs font-medium" style={{ color: color || '#cbd5e1' }}>{value || '—'}</span>
    </div>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────
export default function PontoBottomSheet({ ponto, onClose }: PontoBottomSheetProps) {
  const sheetRef   = useRef<HTMLDivElement>(null);
  const handleRef  = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Fecha ao pressionar Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  // Drag-to-close
  useEffect(() => {
    const sheet   = sheetRef.current;
    const handle  = handleRef.current;
    const overlay = overlayRef.current;
    if (!sheet || !handle || !overlay || !ponto) return;

    let startY = 0, currentDelta = 0, dragging = false;

    const onTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY;
      currentDelta = 0;
      dragging = true;
      sheet.style.transition = 'none';
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!dragging) return;
      const delta = e.touches[0].clientY - startY;
      if (delta <= 0) return;
      e.preventDefault();
      currentDelta = delta;
      const translate = Math.min(delta, delta * 0.85 + Math.sqrt(delta) * 2.5 * 0.15);
      sheet.style.transform = `translateY(${translate}px)`;
      const opacity = Math.max(0, 0.45 - (delta / 400) * 0.45);
      overlay.style.background = `rgba(0,0,0,${opacity.toFixed(2)})`;
    };

    const onTouchEnd = () => {
      if (!dragging) return;
      dragging = false;
      sheet.style.transition = 'transform 0.3s cubic-bezier(0.32, 0.72, 0, 1)';
      overlay.style.transition = 'background 0.3s ease';
      if (currentDelta > 110) {
        sheet.style.transform = 'translateY(100%)';
        overlay.style.background = 'rgba(0,0,0,0)';
        setTimeout(onClose, 290);
      } else {
        sheet.style.transform = 'translateY(0)';
        overlay.style.background = 'rgba(0,0,0,0.45)';
      }
      currentDelta = 0;
    };

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
  }, [ponto, onClose]);

  if (!ponto) return null;

  const isFoto  = ponto.kind === 'fotografia';
  const accentColor = isFoto ? FOTO_COLOR : EQUIP_COLOR;

  // Campos comuns derivados
  const tipo      = ponto.data.tipo   || (isFoto ? 'Fotografia' : 'Equipamento');
  const imageUrl  = ponto.data.url;
  const autor     = ponto.data.autor;
  const dataStr   = formatDate(ponto.data.data);

  // Campos exclusivos
  const descricao  = isFoto ? (ponto.data as Fotografia).descricao : undefined;
  const estado     = !isFoto ? (ponto.data as Equipamento).estado : undefined;
  const observacao = !isFoto ? (ponto.data as Equipamento).observacao : undefined;
  const estadoStyle = estado ? (ESTADO_COLORS[estado] || ESTADO_COLORS['Regular']) : null;

  // Ícone e label da categoria
  const categoryIcon  = isFoto ? '📷' : '🏋️';
  const categoryLabel = isFoto ? 'Estética' : 'Lazer';

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
        {/* Handle de arraste */}
        <div
          ref={handleRef}
          className="flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing select-none"
          style={{ touchAction: 'none' }}
        >
          <div className="w-10 h-1.5 rounded-full" style={{ background: 'rgba(148,163,184,0.5)' }} />
        </div>

        {/* Conteúdo com scroll */}
        <div className="overflow-y-auto" style={{ maxHeight: 'calc(82dvh - 32px)' }}>

          {/* Foto / Imagem do ponto */}
          {imageUrl && (
            <div className="overflow-hidden relative" style={{ maxHeight: '200px' }}>
              <img
                src={imageUrl}
                alt={tipo}
                loading="lazy"
                className="w-full object-cover"
                style={{ maxHeight: '200px' }}
                onError={(e) => { (e.currentTarget.parentElement as HTMLElement).style.display = 'none'; }}
              />
              {/* Badge de categoria sobre a imagem */}
              <div
                className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold"
                style={{
                  background: `rgba(15,23,42,0.85)`,
                  border: `1px solid ${accentColor}55`,
                  color: accentColor,
                  backdropFilter: 'blur(6px)',
                }}
              >
                <span>{categoryIcon}</span>
                <span>{categoryLabel}</span>
              </div>
            </div>
          )}

          <div className="px-4 pt-4 pb-6">

            {/* Header: Tipo (título) + botão fechar */}
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="flex-1">
                {/* Accent line */}
                <div
                  className="w-8 h-1 rounded-full mb-2"
                  style={{ background: accentColor }}
                />
                <h2 className="text-base font-bold text-white leading-tight">
                  {tipo}
                </h2>
                {/* Descrição como subtítulo (apenas para fotografias) */}
                {descricao && (
                  <p className="text-xs text-slate-400 mt-0.5 leading-snug">{descricao}</p>
                )}
              </div>

              <button
                onClick={onClose}
                className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-slate-400 hover:text-white transition-colors"
                style={{ background: 'rgba(255,255,255,0.08)' }}
                aria-label="Fechar"
              >
                ✕
              </button>
            </div>

            {/* Estado (apenas equipamentos) */}
            {estado && estadoStyle && (
              <div className="mb-4">
                <span
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold"
                  style={{
                    background: estadoStyle.bg,
                    color:      estadoStyle.text,
                    border:     `1px solid ${estadoStyle.border}`,
                  }}
                >
                  Estado: {estado}
                </span>
              </div>
            )}

            {/* Grid de metadados */}
            <div
              className="grid grid-cols-2 gap-3 rounded-xl p-3 mb-4"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              {autor && <MetaChip label="Autor" value={autor} />}
              <MetaChip label="Data" value={dataStr} />
            </div>

            {/* Observação (apenas equipamentos) */}
            {observacao && (
              <p
                className="text-xs text-slate-400 italic rounded-lg p-3"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                {observacao}
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
