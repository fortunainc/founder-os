import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/client';
import { scoreLead } from '@/lib/ai';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { leadId } = body;

    if (!leadId) {
      return NextResponse.json({ error: 'Lead ID is required' }, { status: 400 });
    }

    // Fetch lead with interaction history
    const { data: lead } = await supabase
      .from('contacts')
      .select('*')
      .eq('id', leadId)
      .eq('user_id', user.id)
      .single();

    if (!lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    // Score lead using Claude
    const result = await scoreLead({
      lead: {
        name: lead.name,
        company: lead.company || undefined,
        title: lead.opportunity_type || undefined,
        value: undefined,
        lastContact: lead.last_contact || '',
        interactionHistory: [],
      },
    });

    // Update lead score in database
    await supabase
      .from('contacts')
      .update({
        is_warm: result.score.score >= 70,
        updated_at: new Date().toISOString(),
      })
      .eq('id', leadId);

    // Log AI usage
    await supabase.from('ai_usage_logs').insert({
      user_id: user.id,
      feature: 'lead_scoring',
      model_used: 'claude-3-5-sonnet',
      input_tokens: result.usage.inputTokens,
      output_tokens: result.usage.outputTokens,
      cost: result.usage.estimatedCost,
    });

    return NextResponse.json({
      success: true,
      score: result.score,
      usage: result.usage,
    });
  } catch (error) {
    console.error('Error scoring lead:', error);
    return NextResponse.json(
      { error: 'Failed to score lead' },
      { status: 500 }
    );
  }
}