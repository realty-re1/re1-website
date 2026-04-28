import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  const { data, error } = await supabase.from('inquiries').insert({
    name: 'test',
    phone: '010-0000-0000',
    message: 'test',
    status: 'new'
  }).select();

  return NextResponse.json({ data, error });
}
