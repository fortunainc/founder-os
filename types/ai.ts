/**
 * AI Integration Types
 */

export interface AIUsageLog {
  id: string;
  user_id: string;
  feature: string;
  model_used: string;
  input_tokens: number;
  output_tokens: number;
  total_tokens: number;
  cost: number;
  created_at: string;
}

export interface AIFeature {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  category: 'content' | 'comments' | 'priorities' | 'leads' | 'insights';
}

export interface AIContentGeneration {
  idea: string;
  tone?: 'professional' | 'casual' | 'provocative' | 'inspiring';
  pillar?: string;
  content?: string;
  generatedAt?: string;
}

export interface AICommentReply {
  commentId: string;
  postContent: string;
  comment: string;
  commenterProfile: string;
  replies?: string[];
  generatedAt?: string;
}

export interface AIPriority {
  rank: number;
  title: string;
  reasoning: string;
  actionSteps: string[];
  estimatedTime: string;
  impact: 'HIGH' | 'MEDIUM' | 'LOW';
  source: 'TASK' | 'LEAD' | 'CONTENT' | 'GOAL';
}

export interface AILeadScore {
  score: number;
  category: 'HOT' | 'WARM' | 'NURTURING' | 'COLD' | 'UNQUALIFIED';
  reasoning: string;
  keySignals: string[];
  nextAction: string;
  conversionProbability: number;
  priorityLevel: 'URGENT' | 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface AIInsights {
  topPerformers: Array<{
    title: string;
    engagementRate: number;
    whyItWorked: string;
  }>;
  underperformers: Array<{
    title: string;
    engagementRate: number;
    whatWentWrong: string;
  }>;
  keyPatterns: Array<{
    pattern: string;
    insight: string;
    action: string;
  }>;
  strategyRecommendations: string[];
  topicsToPursue: string[];
  topicsToAvoid: string[];
}

export interface AIWeeklyBrief {
  weekAtGlance: string[];
  keyWins: Array<{
    win: string;
    impact: string;
  }>;
  actionableInsights: Array<{
    insight: string;
    nextStep: string;
  }>;
  nextWeekFocus: string[];
}

export interface AIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  usage?: {
    inputTokens: number;
    outputTokens: number;
    totalTokens: number;
    estimatedCost: number;
  };
}