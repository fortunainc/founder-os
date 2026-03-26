/**
 * User Context Builder for AI Personalization
 */

export interface UserContext {
  profile: {
    name: string;
    headline: string;
    company?: string;
    industry: string;
  };
  voice: {
    tone: string;
    style: string;
    commonPhrases: string[];
    writingStyle: string;
  };
  goals: string[];
  contentPillars: string[];
  preferences: {
    postLength: string;
    postingFrequency: string;
    useEmojis: boolean;
    useHashtags: boolean;
    callToActionStyle: string;
  };
  recentActivity: {
    lastPostTopic: string;
    averageEngagement: number;
    topPerformingPillars: string[];
  };
}

/**
 * Build user context from profile and activity data
 */
export async function buildUserContext(supabase: any, userId: string): Promise<UserContext> {
  // Fetch user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  // Fetch user goals
  const { data: goals } = await supabase
    .from('goals')
    .select('title')
    .eq('user_id', userId)
    .eq('status', 'active');

  // Fetch content pillars
  const { data: pillars } = await supabase
    .from('content_pillars')
    .select('name')
    .eq('user_id', userId);

  // Fetch recent posts for voice analysis
  const { data: recentPosts } = await supabase
    .from('published_posts')
    .select('content, topic, pillar, likes, comments')
    .eq('user_id', userId)
    .order('published_at', { ascending: false })
    .limit(20);

  // Analyze voice from recent posts
  const voice = analyzeVoice(recentPosts || []);

  // Calculate top performing pillars
  const pillarPerformance = analyzePillarPerformance(recentPosts || []);

  return {
    profile: {
      name: profile?.name || 'Founder',
      headline: profile?.headline || '',
      company: profile?.company,
      industry: profile?.industry || 'Technology',
    },
    voice,
    goals: goals?.map((g: any) => g.title) || [],
    contentPillars: pillars?.map((p: any) => p.name) || [],
    preferences: {
      postLength: profile?.preferred_post_length || 'medium',
      postingFrequency: profile?.posting_frequency || '3-5 per week',
      useEmojis: profile?.use_emojis ?? true,
      useHashtags: profile?.use_hashtags ?? true,
      callToActionStyle: profile?.cta_style || 'question',
    },
    recentActivity: {
      lastPostTopic: recentPosts?.[0]?.topic || '',
      averageEngagement: calculateAverageEngagement(recentPosts || []),
      topPerformingPillars: pillarPerformance,
    },
  };
}

/**
 * Analyze writing voice from recent posts
 */
function analyzeVoice(posts: any[]): UserContext['voice'] {
  if (posts.length === 0) {
    return {
      tone: 'professional',
      style: 'conversational',
      commonPhrases: [],
      writingStyle: 'Direct and action-oriented',
    };
  }

  // Simple analysis - in production, this would use more sophisticated NLP
  const allText = posts.map(p => p.content).join(' ');
  
  // Detect tone based on word usage
  const professionalWords = ['strategic', 'leverage', 'optimize', 'scale', 'growth'];
  const casualWords = ['honestly', 'literally', 'amazing', 'love', 'super'];
  const inspiringWords = ['believe', 'dream', 'vision', 'impact', 'transform'];
  const provocativeWords = ['bold', 'challenge', 'controversial', 'break', 'disrupt'];

  const hasProfessional = professionalWords.some(w => allText.toLowerCase().includes(w));
  const hasCasual = casualWords.some(w => allText.toLowerCase().includes(w));
  const hasInspiring = inspiringWords.some(w => allText.toLowerCase().includes(w));
  const hasProvocative = provocativeWords.some(w => allText.toLowerCase().includes(w));

  let tone = 'professional';
  if (hasCasual) tone = 'casual';
  else if (hasInspiring) tone = 'inspiring';
  else if (hasProvocative) tone = 'provocative';

  // Extract common phrases (simplified)
  const commonPhrases: string[] = [];
  // In production, this would use proper NLP to extract recurring phrases

  return {
    tone,
    style: hasCasual ? 'conversational' : 'formal',
    commonPhrases,
    writingStyle: hasProfessional ? 
      'Strategic and analytical' : 
      hasCasual ? 
      'Friendly and approachable' : 
      'Thoughtful and measured',
  };
}

/**
 * Calculate average engagement rate
 */
function calculateAverageEngagement(posts: any[]): number {
  if (posts.length === 0) return 0;

  const totalEngagement = posts.reduce((sum, post) => {
    const engagementRate = post.impressions > 0 
      ? ((post.likes + post.comments + post.shares) / post.impressions) * 100 
      : 0;
    return sum + engagementRate;
  }, 0);

  return Number((totalEngagement / posts.length).toFixed(2));
}

/**
 * Analyze pillar performance
 */
function analyzePillarPerformance(posts: any[]): string[] {
  if (posts.length === 0) return [];

  const pillarStats = new Map<string, { total: number; count: number }>();

  posts.forEach(post => {
    if (!post.pillar) return;
    const engagement = post.likes + post.comments + post.shares;
    const current = pillarStats.get(post.pillar) || { total: 0, count: 0 };
    pillarStats.set(post.pillar, {
      total: current.total + engagement,
      count: current.count + 1,
    });
  });

  const sortedPillars = Array.from(pillarStats.entries())
    .map(([pillar, stats]) => ({
      pillar,
      avgEngagement: stats.total / stats.count,
    }))
    .sort((a, b) => b.avgEngagement - a.avgEngagement)
    .slice(0, 3)
    .map(p => p.pillar);

  return sortedPillars;
}

/**
 * Format user context for AI prompts
 */
export function formatUserContext(context: UserContext): string {
  return `
USER PROFILE:
- Name: ${context.profile.name}
- Headline: ${context.profile.headline}
- Company: ${context.profile.company || 'N/A'}
- Industry: ${context.profile.industry}

WRITING VOICE:
- Tone: ${context.voice.tone}
- Style: ${context.voice.style}
- Style: ${context.voice.writingStyle}

CURRENT GOALS:
${context.goals.map(g => `- ${g}`).join('\n') || 'No goals set'}

CONTENT PILLARS:
${context.contentPillars.map(p => `- ${p}`).join('\n') || 'No pillars defined'}

PREFERENCES:
- Post Length: ${context.preferences.postLength}
- Posting Frequency: ${context.preferences.postingFrequency}
- Use Emojis: ${context.preferences.useEmojis ? 'Yes' : 'No'}
- Use Hashtags: ${context.preferences.useHashtags ? 'Yes' : 'No'}
- CTA Style: ${context.preferences.callToActionStyle}

RECENT ACTIVITY:
- Last Post Topic: ${context.recentActivity.lastPostTopic || 'N/A'}
- Average Engagement: ${context.recentActivity.averageEngagement}%
- Top Performing Pillars: ${context.recentActivity.topPerformingPillars.join(', ') || 'N/A'}
`;
}