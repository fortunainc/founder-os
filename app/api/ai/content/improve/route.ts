import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/client';
import { improvePost } from '@/lib/ai';
import { buildUserContext } from '@/lib/ai/context/user-context';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { post, improvements } = body;

    if (!post || !improvements) {
      return NextResponse.json(
        { error: 'Post and improvements are required' },
        { status: 400 }
      );
    }

    // Build user context for personalization
    const userContext = await buildUserContext(supabase, user.id);

    // Improve post using Claude
    const result = await improvePost({
      post,
      improvements,
      userContext,
    });

    // Log AI usage
    await supabase.from('ai_usage_logs').insert({
      user_id: user.id,
      feature: 'content_improvement',
      model_used: 'claude-3-5-sonnet',
      input_tokens: result.usage.inputTokens,
      output_tokens: result.usage.outputTokens,
      cost: result.usage.estimatedCost,
    });

    return NextResponse.json({
      success: true,
      content: result.content,
      usage: result.usage,
    });
  } catch (error) {
    console.error('Error improving post:', error);
    return NextResponse.json(
      { error: 'Failed to improve post' },
      { status: 500 }
    );
  }
}