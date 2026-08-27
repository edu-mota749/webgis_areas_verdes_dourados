import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { MOCK_FOTOGRAFIAS } from '@/lib/mockData';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder')) {
      const { data, error } = await supabase.rpc('get_fotografias');
      if (!error && data) {
        return NextResponse.json(data);
      }
      if (error) console.warn('Erro ao chamar get_fotografias():', error.message);
    }
  } catch (err) {
    console.warn('Erro ao buscar fotografias no Supabase:', err);
  }
  return NextResponse.json(MOCK_FOTOGRAFIAS);
}
