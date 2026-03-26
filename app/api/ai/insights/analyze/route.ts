import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/client';
import { analyzeContentPerformance } from '@/lib/ai';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { timeframe = '30' } = body;

    // Fetch published posts for analysis
    const { data: posts } = await supabase
      .from('published_posts')
      .select('*')
      .eq('user_id', user.id)
      .gte('published_at', new Date(Date.now() - parseInt(timeframe) * 24 * 60 * 60 * 1000).toISOString())
      .order('published_at', { ascending: false });

    if (!posts || posts.length === 0) {
      return NextResponse.json(
        { error: 'No posts found for the specified timeframe' },
        { status: 404 }
      );
    }

    // Analyze content performance using Claude
    const result = await analyzeContentPerformance({
      posts: posts.map(p => ({
        title: p.post_text.substring(0, 100),
        topic: undefined,
        pillar: p.pillar || undefined,
        likes: 0,
        comments: 0,
        shares: 0,
        impressions: 0,
        publishedDate: p.posted_at,
      })),
    });

    // Log AI usage
    await supabase.from('ai_usage_logs').insert({
      user_id: user.id,
      feature: 'content_analysis',
      model_used: 'claude-3-5-sonnet',
      input_tokens: result.usage.inputTokens,
      output_tokens: result.usage.outputTokens,
      cost: result.usage.estimatedCost,
    });

    return NextResponse.json({
      success: true,
      analysis: result.analysis,
      usage: result.usage,
    });
  } catch (error) {
    console.error('Error analyzing content:', error);
    return NextResponse.json(
      { error: 'Failed to analyze content' },
      { status: 500 }
    );
  }
}