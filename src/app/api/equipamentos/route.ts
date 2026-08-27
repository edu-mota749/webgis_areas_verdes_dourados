import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { MOCK_EQUIPAMENTOS } from '@/lib/mockData';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder')) {
      // Usa a view que já extrai lat/lng do geom PostGIS
      const { data, error } = await supabase.from('equipamentos_view').select('*');
      if (!error && data) {
        return NextResponse.json(data);
      }
      if (error) console.warn('Erro ao buscar equipamentos_view:', error.message);
    }
  } catch (err) {
    console.warn('Erro ao buscar equipamentos no Supabase:', err);
  }
  return NextResponse.json(MOCK_EQUIPAMENTOS);
}
