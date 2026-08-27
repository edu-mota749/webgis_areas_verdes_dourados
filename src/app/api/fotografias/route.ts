import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { MOCK_FOTOGRAFIAS } from '@/lib/mockData';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder')) {
      // Usa a view que já extrai lat/lng do geom PostGIS
      const { data, error } = await supabase.from('fotografias_view').select('*');
      if (!error && data) {
        return NextResponse.json(data);
      }
      if (error) console.warn('Erro ao buscar fotografias_view:', error.message);
    }
  } catch (err) {
    console.warn('Erro ao buscar fotografias no Supabase:', err);
  }
  return NextResponse.json(MOCK_FOTOGRAFIAS);
}
