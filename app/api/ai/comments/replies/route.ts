import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/client';
import { generateReplies } from '@/lib/ai';
import { buildUserContext } from '@/lib/ai/context/user-context';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { postContent, comment, commenterProfile } = body;

    if (!postContent || !comment) {
      return NextResponse.json(
        { error: 'Post content and comment are required' },
        { status: 400 }
      );
    }

    // Build user context for personalization
    const userContext = await buildUserContext(supabase, user.id);

    // Generate replies using Claude
    const result = await generateReplies({
      postContent,
      comment,
      commenterProfile: commenterProfile || 'LinkedIn user',
      userContext,
    });

    // Log AI usage
    await supabase.from('ai_usage_logs').insert({
      user_id: user.id,
      feature: 'comment_replies',
      model_used: 'claude-3-5-sonnet',
      input_tokens: result.usage.inputTokens,
      output_tokens: result.usage.outputTokens,
      cost: result.usage.estimatedCost,
    });

    return NextResponse.json({
      success: true,
      replies: result.replies,
      usage: result.usage,
    });
  } catch (error) {
    console.error('Error generating replies:', error);
    return NextResponse.json(
      { error: 'Failed to generate replies' },
      { status: 500 }
    );
  }
}