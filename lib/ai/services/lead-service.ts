/**
 * AI Lead Service - Lead scoring, analysis, and outreach
 */

import { callClaudeWithSystem } from '../claude-client';
import { LEAD_PROMPTS } from '../prompts';

export interface ScoreLeadOptions {
  lead: {
    name: string;
    company?: string;
    title?: string;
    value?: number;
    lastContact: string;
    interactionHistory: Array<{
      date: string;
      type: string;
      details: string;
    }>;
  };
}

export interface GenerateOutreachOptions {
  lead: {
    name: string;
    company?: string;
    title?: string;
    interests?: string[];
    recentActivity?: string;
  };
  messageGoal: string;
  previousContext?: string;
}

export interface AnalyzeInteractionPatternsOptions {
  leads: Array<{
    name: string;
    interactionHistory: Array<{
      date: string;
      type: string;
      response?: string;
    }>;
    score?: number;
  }>;
}

export interface IdentifyHighValueLeadsOptions {
  leads: Array<{
    name: string;
    company?: string;
    title?: string;
    value?: number;
    interactionHistory: Array<{
      date: string;
      type: string;
    }>;
    lastContact: string;
  }>;
}

export interface GenerateFollowupStrategyOptions {
  lead: {
    name: string;
    lastContact: string;
    interactionHistory: Array<{
      date: string;
      type: string;
    }>;
  };
  daysSinceContact: number;
}

export interface AnalyzePipelineHealthOptions {
  totalLeads: number;
  hotLeads: number;
  warmLeads: number;
  coldLeads: number;
  avgTimeToClose: string;
  conversionRate: number;
  staleLeads: number;
}

/**
 * Score lead based on interaction history
 */
export async function scoreLead(
  options: ScoreLeadOptions
): Promise<{ score: any; usage: any }> {
  const { lead } = options;

  const systemPrompt = `You are an expert lead scoring analyst. Return ONLY valid JSON.`;

  const userPrompt = LEAD_PROMPTS.SCORE_LEAD(lead);

  const response = await callClaudeWithSystem(systemPrompt, userPrompt, {
    model: 'claude-3-5-sonnet-20241022',
    maxTokens: 1024,
    temperature: 0.3,
  });

  try {
    const score = JSON.parse(response.content);
    return {
      score,
      usage: response.usage,
    };
  } catch (error) {
    console.error('Failed to parse score JSON:', response.content);
    throw new Error('Invalid score response from Claude');
  }
}

/**
 * Generate personalized outreach message
 */
export async function generateOutreach(
  options: GenerateOutreachOptions
): Promise<{ message: string; usage: any }> {
  const { lead, messageGoal, previousContext } = options;

  const systemPrompt = `You are an expert outreach specialist helping a founder craft personalized messages.`;

  const userPrompt = LEAD_PROMPTS.GENERATE_OUTREACH(lead, messageGoal, previousContext);

  const response = await callClaudeWithSystem(systemPrompt, userPrompt, {
    model: 'claude-3-5-sonnet-20241022',
    maxTokens: 1024,
    temperature: 0.8,
  });

  return {
    message: response.content,
    usage: response.usage,
  };
}

/**
 * Analyze interaction patterns
 */
export async function analyzeInteractionPatterns(
  options: AnalyzeInteractionPatternsOptions
): Promise<{ analysis: any; usage: any }> {
  const { leads } = options;

  const systemPrompt = `You are an expert at analyzing customer behavior patterns. Return ONLY valid JSON.`;

  const userPrompt = LEAD_PROMPTS.ANALYZE_INTERACTION_PATTERNS(leads);

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
 * Identify high-value leads
 */
export async function identifyHighValueLeads(
  options: IdentifyHighValueLeadsOptions
): Promise<{ highValueLeads: any[]; usage: any }> {
  const { leads } = options;

  const systemPrompt = `You are an expert at identifying high-potential opportunities. Return ONLY valid JSON.`;

  const userPrompt = LEAD_PROMPTS.IDENTIFY_HIGH_VALUE_LEADS(leads);

  const response = await callClaudeWithSystem(systemPrompt, userPrompt, {
    model: 'claude-3-5-sonnet-20241022',
    maxTokens: 2048,
    temperature: 0.3,
  });

  try {
    const highValueLeads = JSON.parse(response.content);
    return {
      highValueLeads,
      usage: response.usage,
    };
  } catch (error) {
    console.error('Failed to parse highValueLeads JSON:', response.content);
    throw new Error('Invalid highValueLeads response from Claude');
  }
}

/**
 * Generate follow-up strategy
 */
export async function generateFollowupStrategy(
  options: GenerateFollowupStrategyOptions
): Promise<{ strategy: any; usage: any }> {
  const { lead, daysSinceContact } = options;

  const systemPrompt = `You are an expert relationship strategist. Return ONLY valid JSON.`;

  const userPrompt = LEAD_PROMPTS.GENERATE_FOLLOWUP_STRATEGY(lead, daysSinceContact);

  const response = await callClaudeWithSystem(systemPrompt, userPrompt, {
    model: 'claude-3-5-sonnet-20241022',
    maxTokens: 1024,
    temperature: 0.5,
  });

  try {
    const strategy = JSON.parse(response.content);
    return {
      strategy,
      usage: response.usage,
    };
  } catch (error) {
    console.error('Failed to parse strategy JSON:', response.content);
    throw new Error('Invalid strategy response from Claude');
  }
}

/**
 * Analyze pipeline health
 */
export async function analyzePipelineHealth(
  options: AnalyzePipelineHealthOptions
): Promise<{ health: any; usage: any }> {
  const systemPrompt = `You are a pipeline health analyst. Return ONLY valid JSON.`;

  const userPrompt = LEAD_PROMPTS.ANALYZE_PIPELINE_HEALTH(options);

  const response = await callClaudeWithSystem(systemPrompt, userPrompt, {
    model: 'claude-3-5-sonnet-20241022',
    maxTokens: 1024,
    temperature: 0.5,
  });

  try {
    const health = JSON.parse(response.content);
    return {
      health,
      usage: response.usage,
    };
  } catch (error) {
    console.error('Failed to parse health JSON:', response.content);
    throw new Error('Invalid health response from Claude');
  }
}