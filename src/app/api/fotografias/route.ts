import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { MOCK_FOTOGRAFIAS } from '@/lib/mockData';

export const dynamic = 'force-dynamic';

// Extrai lat/lng de geometrias do Supabase (GeoJSON object, GeoJSON string ou EWKB hex)
function parseGeom(geom: any): { lat: number; lng: number } | null {
  if (!geom) return null;

  // 1. Objeto GeoJSON { type: 'Point', coordinates: [lng, lat] }
  if (typeof geom === 'object' && Array.isArray(geom.coordinates) && geom.coordinates.length >= 2) {
    const lng = Number(geom.coordinates[0]);
    const lat = Number(geom.coordinates[1]);
    if (!isNaN(lat) && !isNaN(lng)) return { lat, lng };
  }

  // 2. String GeoJSON
  if (typeof geom === 'string' && geom.trim().startsWith('{')) {
    try {
      const parsed = JSON.parse(geom);
      if (Array.isArray(parsed.coordinates) && parsed.coordinates.length >= 2) {
        return { lng: Number(parsed.coordinates[0]), lat: Number(parsed.coordinates[1]) };
      }
    } catch {}
  }

  // 3. EWKB Hex string
  if (typeof geom === 'string') {
    try {
      const buf = Buffer.from(geom, 'hex');
      if (buf[0] === 1) {
        const hasSrid = (buf.readUInt32LE(1) & 0x20000000) !== 0;
        const offset  = hasSrid ? 9 : 5;
        const lng = buf.readDoubleLE(offset);
        const lat = buf.readDoubleLE(offset + 8);
        return { lat, lng };
      }
    } catch {}
  }

  return null;
}

export async function GET() {
  try {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder')) {
      const { data, error } = await supabase.from('fotografias').select('*');
      if (!error && data) {
        const result = data
          .map((row: any) => {
            const coords = parseGeom(row.geom);
            if (!coords) return null;
            return {
              id:        row.id,
              id_area:   row.id_area,
              tipo:      row.tipo,
              url:       row.url,
              descricao: row.descricao,
              autor:     row.autor,
              data:      row.data,
              lat:       coords.lat,
              lng:       coords.lng,
            };
          })
          .filter(Boolean);
        return NextResponse.json(result);
      }
      if (error) console.warn('Erro ao buscar fotografias:', error.message);
    }
  } catch (err) {
    console.warn('Erro ao buscar fotografias no Supabase:', err);
  }
  return NextResponse.json(MOCK_FOTOGRAFIAS);
}
