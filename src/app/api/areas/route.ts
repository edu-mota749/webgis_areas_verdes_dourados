import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { MOCK_AREAS_VERDES } from '@/lib/mockData';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Tenta buscar no Supabase se configurado
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder')) {
      const { data, error } = await supabase.rpc('get_areas_verdes_geojson');
      if (!error && data) {
        return NextResponse.json(data);
      }
    }
  } catch (err) {
    console.warn('Erro ao conectar Supabase, retornando dados de fallback local:', err);
  }

  // Fallback seguro de dados
  return NextResponse.json(MOCK_AREAS_VERDES);
}
