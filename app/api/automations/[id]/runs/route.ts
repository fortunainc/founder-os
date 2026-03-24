import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  const supabase = await createClient();
  
  const { data: runs } = await supabase
    .from('automation_runs')
    .select('*')
    .eq('automation_id', params.id)
    .order('started_at', { ascending: false })
    .limit(20);

  return NextResponse.json({ runs });
}