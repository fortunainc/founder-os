/**
 * AI Insights Service - Performance analytics and strategic insights
 */

import { callClaudeWithSystem } from '../claude-client';
import { INSIGHTS_PROMPTS } from '../prompts';

export interface AnalyzeContentPerformanceOptions {
  posts: Array<{
    title: string;
    topic?: string;
    pillar?: string;
    likes: number;
    comments: number;
    shares: number;
    impressions: number;
    publishedDate: string;
  }>;
}

export interface GenerateStrategyRecommendationsOptions {
  performanceData: any;
  currentGoals: string[];
  audienceInsights: any;
}

export interface DetectTrendsOptions {
  posts: Array<{
    title: string;
    topic?: string;
    publishedDate: string;
    likes: number;
    comments: number;
  }>;
  timeframe?: string;
}

export interface GenerateWeeklyInsightsOptions {
  weekData: {
    postsPublished: number;
    totalEngagement: number;
    avgEngagementRate: number;
    topPost: string;
    newFollowers: number;
    leadsGenerated: number;
    tasksCompleted: number;
    contentMilestones: string[];
    keyWins: string[];
    learnings: string[];
  };
}

export interface AnalyzeAudienceSentimentOptions {
  comments: Array<{
    text: string;
    likes?: number;
    date: string;
  }>;
}

export interface PredictPerformanceOptions {
  post: {
    title: string;
    topic?: string;
    pillar?: string;
    length?: number;
    hook?: string;
  };
  historicalData: any;
}

/**
 * Analyze content performance patterns
 */
export async function analyzeContentPerformance(
  options: AnalyzeContentPerformanceOptions
): Promise<{ analysis: any; usage: any }> {
  const { posts } = options;

  const systemPrompt = `You are an expert content strategist and LinkedIn algorithm analyst. Return ONLY valid JSON.`;

  const userPrompt = INSIGHTS_PROMPTS.ANALYZE_CONTENT_PERFORMANCE(posts);

  const response = await callClaudeWithSystem(systemPrompt, userPrompt, {
    model: 'claude-3-5-sonnet-20241022',
    maxTokens: 2048,
    temperature: 0.5,
  });

  try {
    const analysis = JSON.parse(response.content);
    return {
      analysis,
      usage: response.usage,
    };
  } catch (error) {
    console.error('Failed to parse analysis JSON:', response.content);
    throw new Error('Invalid analysis response from Claude');
  }
}

/**
 * Generate content strategy recommendations
 */
export async function generateStrategyRecommendations(
  options: GenerateStrategyRecommendationsOptions
): Promise<{ recommendations: any; usage: any }> {
  const { performanceData, currentGoals, audienceInsights } = options;

  const systemPrompt = `You are a strategic content consultant. Return ONLY valid JSON.`;

  const userPrompt = INSIGHTS_PROMPTS.GENERATE_STRATEGY_RECOMMENDATIONS(
    performanceData,
    currentGoals,
    audienceInsights
  );

  const response = await callClaudeWithSystem(systemPrompt, userPrompt, {
    model: 'claude-3-5-sonnet-20241022',
    maxTokens: 2048,
    temperature: 0.7,
  });

  try {
    const recommendations = JSON.parse(response.content);
    return {
      recommendations,
      usage: response.usage,
    };
  } catch (error) {
    console.error('Failed to parse recommendations JSON:', response.content);
    throw new Error('Invalid recommendations response from Claude');
  }
}

/**
 * Detect trends and patterns
 */
export async function detectTrends(
  options: DetectTrendsOptions
): Promise<{ trends: any; usage: any }> {
  const { posts, timeframe = 'last 30 days' } = options;

  const systemPrompt = `You are a trend analyst specialized in LinkedIn content. Return ONLY valid JSON.`;

  const userPrompt = INSIGHTS_PROMPTS.DETECT_TRENDS(posts, timeframe);

  const response = await callClaudeWithSystem(systemPrompt, userPrompt, {
    model: 'claude-3-5-sonnet-20241022',
    maxTokens: 2048,
    temperature: 0.5,
  });

  try {
    const trends = JSON.parse(response.content);
    return {
      trends,
      usage: response.usage,
    };
  } catch (error) {
    console.error('Failed to parse trends JSON:', response.content);
    throw new Error('Invalid trends response from Claude');
  }
}

/**
 * Generate weekly insights summary
 */
export async function generateWeeklyInsights(
  options: GenerateWeeklyInsightsOptions
): Promise<{ insights: string; usage: any }> {
  const { weekData } = options;

  const systemPrompt = `You are an executive assistant preparing a weekly brief for a founder.`;

  const userPrompt = INSIGHTS_PROMPTS.GENERATE_WEEKLY_INSIGHTS(weekData);

  const response = await callClaudeWithSystem(systemPrompt, userPrompt, {
    model: 'claude-3-5-sonnet-20241022',
    maxTokens: 2048,
    temperature: 0.7,
  });

  return {
    insights: response.content,
    usage: response.usage,
  };
}

/**
 * Analyze audience sentiment
 */
export async function analyzeAudienceSentiment(
  options: AnalyzeAudienceSentimentOptions
): Promise<{ sentiment: any; usage: any }> {
  const { comments } = options;

  const systemPrompt = `You are an expert sentiment analyst. Return ONLY valid JSON.`;

  const userPrompt = INSIGHTS_PROMPTS.ANALYZE_AUDIENCE_SENTIMENT(comments);

  const response = await callClaudeWithSystem(systemPrompt, userPrompt, {
    model: 'claude-3-5-sonnet-20241022',
    maxTokens: 1024,
    temperature: 0.3,
  });

  try {
    const sentiment = JSON.parse(response.content);
    return {
      sentiment,
      usage: response.usage,
    };
  } catch (error) {
    console.error('Failed to parse sentiment JSON:', response.content);
    throw new Error('Invalid sentiment response from Claude');
  }
}

/**
 * Predict content performance
 */
export async function predictPerformance(
  options: PredictPerformanceOptions
): Promise<{ prediction: any; usage: any }> {
  const { post, historicalData } = options;

  const systemPrompt = `You are an AI content performance predictor. Return ONLY valid JSON.`;

  const userPrompt = INSIGHTS_PROMPTS.PREDICT_PERFORMANCE(post, historicalData);

  const response = await callClaudeWithSystem(systemPrompt, userPrompt, {
    model: 'claude-3-5-sonnet-20241022',
    maxTokens: 1024,
    temperature: 0.5,
  });

  try {
    const prediction = JSON.parse(response.content);
    return {
      prediction,
      usage: response.usage,
    };
  } catch (error) {
    console.error('Failed to parse prediction JSON:', response.content);
    throw new Error('Invalid prediction response from Claude');
  }
}