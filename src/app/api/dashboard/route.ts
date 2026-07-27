import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { MOCK_AREAS_VERDES, calculateStatsFromGeoJSON } from '@/lib/mockData';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder')) {
      const { data, error } = await supabase.rpc('get_areas_verdes_geojson');
      if (!error && data) {
        return NextResponse.json(calculateStatsFromGeoJSON(data));
      }
    }
  } catch (err) {
    console.warn('Erro ao calcular estatísticas no Supabase:', err);
  }
  return NextResponse.json(calculateStatsFromGeoJSON(MOCK_AREAS_VERDES));
}
