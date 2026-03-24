import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  const supabase = await createClient();
  const searchParams = request.nextUrl.searchParams;
  const runId = searchParams.get('run_id');
  
  let query = supabase
    .from('automation_logs')
    .select('*')
    .order('created_at', { ascending: false });

  if (runId) {
    query = query.eq('automation_run_id', runId);
  } else {
    // Get logs for all runs of this automation
    const { data: runs } = await supabase
      .from('automation_runs')
      .select('id')
      .eq('automation_id', params.id);

    const runIds = runs?.map(r => r.id) || [];
    if (runIds.length > 0) {
      query = query.in('automation_run_id', runIds);
    }
  }

  const { data: logs } = await query.limit(100);

  return NextResponse.json({ logs });
}