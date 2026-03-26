/**
 * Data Context Builder - Aggregates relevant data for AI operations
 */

import { createClient } from '@/lib/supabase/client';

export interface DataContext {
  tasks: any[];
  leads: any[];
  drafts: any[];
  publishedPosts: any[];
  comments: any[];
  goals: any[];
  contentPillars: any[];
}

/**
 * Fetch all relevant data for AI operations
 */
export async function buildDataContext(supabase: any, userId: string): Promise<DataContext> {
  const [
    tasks,
    leads,
    drafts,
    publishedPosts,
    comments,
    goals,
    contentPillars,
  ] = await Promise.all([
    // Fetch incomplete tasks
    supabase
      .from('tasks')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'incomplete')
      .order('due_date', { ascending: true })
      .limit(10),

    // Fetch active leads
    supabase
      .from('contacts')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .order('last_contact', { ascending: true })
      .limit(20),

    // Fetch unscheduled drafts
    supabase
      .from('drafts')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'approved')
      .is('scheduled_for', null)
      .order('updated_at', { ascending: false })
      .limit(10),

    // Fetch recent published posts
    supabase
      .from('published_posts')
      .select('*')
      .eq('user_id', userId)
      .order('published_at', { ascending: false })
      .limit(20),

    // Fetch recent comments needing replies
    supabase
      .from('post_comments')
      .select(`
        *,
        published_posts!inner(content, topic)
      `)
      .eq('published_posts.user_id', userId)
      .is('reply', null)
      .order('created_at', { ascending: false })
      .limit(15),

    // Fetch active goals
    supabase
      .from('goals')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(5),

    // Fetch content pillars
    supabase
      .from('content_pillars')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false }),
  ]);

  return {
    tasks: tasks.data || [],
    leads: leads.data || [],
    drafts: drafts.data || [],
    publishedPosts: publishedPosts.data || [],
    comments: comments.data || [],
    goals: goals.data || [],
    contentPillars: contentPillars.data || [],
  };
}

/**
 * Build context for daily priority generation
 */
export async function buildPriorityContext(supabase: any, userId: string) {
  const data = await buildDataContext(supabase, userId);

  // Add additional computed data
  const staleLeads = data.leads.filter(lead => {
    const lastContact = new Date(lead.last_contact);
    const daysSinceContact = Math.floor((Date.now() - lastContact.getTime()) / (1000 * 60 * 60 * 24));
    return daysSinceContact >= 3;
  });

  const performanceSummary = summarizePerformance(data.publishedPosts);

  return {
    tasks: data.tasks,
    staleLeads,
    unscheduledDrafts: data.drafts,
    performanceSummary,
    goals: data.goals.map(g => g.title),
  };
}

/**
 * Build context for content generation
 */
export async function buildContentContext(supabase: any, userId: string) {
  const [publishedPosts, contentPillars] = await Promise.all([
    supabase
      .from('published_posts')
      .select('*')
      .eq('user_id', userId)
      .order('published_at', { ascending: false })
      .limit(20),

    supabase
      .from('content_pillars')
      .select('*')
      .eq('user_id', userId),
  ]);

  return {
    recentPosts: publishedPosts.data || [],
    contentPillars: contentPillars.data || [],
    topPerformingTopics: getTopPerformingTopics(publishedPosts.data || []),
  };
}

/**
 * Build context for comment reply generation
 */
export async function buildCommentContext(supabase: any, userId: string, postId: string) {
  const [post, comments] = await Promise.all([
    supabase
      .from('published_posts')
      .select('*')
      .eq('id', postId)
      .single(),

    supabase
      .from('post_comments')
      .select('*')
      .eq('post_id', postId)
      .is('reply', null)
      .order('created_at', { ascending: false }),
  ]);

  return {
    post: post.data,
    comments: comments.data || [],
  };
}

/**
 * Build context for lead analysis
 */
export async function buildLeadContext(supabase: any, userId: string, leadId: string) {
  const [lead, interactions] = await Promise.all([
    supabase
      .from('contacts')
      .select('*')
      .eq('id', leadId)
      .single(),

    supabase
      .from('interactions')
      .select('*')
      .eq('contact_id', leadId)
      .order('date', { ascending: false })
      .limit(20),
  ]);

  return {
    lead: lead.data,
    interactions: interactions.data || [],
  };
}

/**
 * Summarize performance from published posts
 */
function summarizePerformance(posts: any[]): any {
  if (posts.length === 0) {
    return {
      totalPosts: 0,
      avgEngagementRate: 0,
      topPerformingPost: null,
      bestPillar: null,
    };
  }

  const totalEngagement = posts.reduce((sum, post) => {
    return sum + post.likes + post.comments + post.shares;
  }, 0);

  const avgEngagementRate = posts.reduce((sum, post) => {
    const rate = post.impressions > 0 
      ? ((post.likes + post.comments + post.shares) / post.impressions) * 100 
      : 0;
    return sum + rate;
  }, 0) / posts.length;

  const topPost = posts.reduce((best, post) => {
    const engagement = post.likes + post.comments + post.shares;
    return engagement > (best.likes + best.comments + best.shares) ? post : best;
  });

  return {
    totalPosts: posts.length,
    avgEngagementRate: Number(avgEngagementRate.toFixed(2)),
    totalEngagement,
    topPerformingPost: topPost.content?.substring(0, 100) + '...',
  };
}

/**
 * Get top performing topics
 */
function getTopPerformingTopics(posts: any[]): string[] {
  const topicStats = new Map<string, { total: number; count: number }>();

  posts.forEach(post => {
    if (!post.topic) return;
    const engagement = post.likes + post.comments + post.shares;
    const current = topicStats.get(post.topic) || { total: 0, count: 0 };
    topicStats.set(post.topic, {
      total: current.total + engagement,
      count: current.count + 1,
    });
  });

  return Array.from(topicStats.entries())
    .map(([topic, stats]) => ({
      topic,
      avgEngagement: stats.total / stats.count,
    }))
    .sort((a, b) => b.avgEngagement - a.avgEngagement)
    .slice(0, 5)
    .map(t => t.topic);
}

/**
 * Format data context for AI prompts
 */
export function formatDataContext(context: DataContext): string {
  return `
TASKS (${context.tasks.length}):
${context.tasks.map(t => `- ${t.title}${t.due_date ? ` (Due: ${t.due_date})` : ''}`).join('\n')}

LEADS (${context.leads.length}):
${context.leads.map(l => `- ${l.name}: Last contact ${l.last_contact}`).join('\n')}

DRAFTS (${context.drafts.length}):
${context.drafts.map(d => `- ${d.title} (${d.status})`).join('\n')}

PUBLISHED POSTS (${context.publishedPosts.length}):
${context.publishedPosts.slice(0, 5).map(p => `- ${p.content.substring(0, 50)}... (${p.likes} likes)`).join('\n')}

COMMENTS NEEDING REPLIES (${context.comments.length}):
${context.comments.slice(0, 5).map(c => `- ${c.text.substring(0, 50)}...`).join('\n')}

GOALS (${context.goals.length}):
${context.goals.map(g => `- ${g.title}`).join('\n')}

CONTENT PILLARS (${context.contentPillars.length}):
${context.contentPillars.map(p => `- ${p.name}`).join('\n')}
`;
}