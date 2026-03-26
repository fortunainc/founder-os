import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/client';
import { generateDailyPriorities } from '@/lib/ai';
import { buildPriorityContext } from '@/lib/ai/context/data-context';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Build priority context with all relevant data
    const context = await buildPriorityContext(supabase, user.id);

    // Generate priorities using Claude
    const result = await generateDailyPriorities({
      tasks: context.tasks.map(t => ({
        title: t.title,
        description: t.description,
        dueDate: t.due_date,
      })),
      staleLeads: context.staleLeads.map(l => ({
        name: l.name,
        lastContact: l.last_contact,
        value: l.value,
      })),
      unscheduledDrafts: context.unscheduledDrafts.map(d => ({
        title: d.title,
        status: d.status,
      })),
      recentPerformance: context.performanceSummary,
      userGoals: context.goals,
    });

    // Log AI usage
    await supabase.from('ai_usage_logs').insert({
      user_id: user.id,
      feature: 'priority_generation',
      model_used: 'claude-3-5-sonnet',
      input_tokens: result.usage.inputTokens,
      output_tokens: result.usage.outputTokens,
      cost: result.usage.estimatedCost,
    });

    return NextResponse.json({
      success: true,
      priorities: result.priorities,
      usage: result.usage,
    });
  } catch (error) {
    console.error('Error generating priorities:', error);
    return NextResponse.json(
      { error: 'Failed to generate priorities' },
      { status: 500 }
    );
  }
}