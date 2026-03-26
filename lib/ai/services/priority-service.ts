/**
 * AI Priority Service - Daily priority generation and analysis
 */

import { callClaudeWithSystem } from '../claude-client';
import { PRIORITY_PROMPTS } from '../prompts';

export interface GenerateDailyPrioritiesOptions {
  tasks: Array<{
    title: string;
    description?: string;
    dueDate?: string;
  }>;
  staleLeads: Array<{
    name: string;
    lastContact: string;
    value?: number;
  }>;
  unscheduledDrafts: Array<{
    title: string;
    status: string;
  }>;
  recentPerformance: any;
  userGoals: string[];
}

export interface AnalyzeTaskImportanceOptions {
  tasks: Array<{
    title: string;
    description?: string;
    dueDate?: string;
    estimatedTime?: string;
  }>;
}

export interface SuggestTaskRolloverOptions {
  incompleteTasks: Array<{
    title: string;
    description?: string;
    startedDate: string;
  }>;
  tomorrowContext: string;
}

export interface GenerateWeeklyPrioritiesOptions {
  currentWeekGoals: string[];
  upcomingDeadlines: string[];
  pipelineState: any;
  capacity: string;
}

/**
 * Generate daily priorities from multiple data sources
 */
export async function generateDailyPriorities(
  options: GenerateDailyPrioritiesOptions
): Promise<{ priorities: any[]; usage: any }> {
  const { tasks, staleLeads, unscheduledDrafts, recentPerformance, userGoals } = options;

  const systemPrompt = `You are an intelligent executive assistant helping a busy founder focus on what matters most. Return ONLY valid JSON.`;

  const userPrompt = PRIORITY_PROMPTS.GENERATE_DAILY_PRIORITIES(
    tasks,
    staleLeads,
    unscheduledDrafts,
    recentPerformance,
    userGoals
  );

  const response = await callClaudeWithSystem(systemPrompt, userPrompt, {
    model: 'claude-3-5-sonnet-20241022',
    maxTokens: 2048,
    temperature: 0.7,
  });

  try {
    const priorities = JSON.parse(response.content);
    return {
      priorities,
      usage: response.usage,
    };
  } catch (error) {
    console.error('Failed to parse priorities JSON:', response.content);
    throw new Error('Invalid priorities response from Claude');
  }
}

/**
 * Analyze task importance and suggest ordering
 */
export async function analyzeTaskImportance(
  options: AnalyzeTaskImportanceOptions
): Promise<{ analysis: any[]; usage: any }> {
  const { tasks } = options;

  const systemPrompt = `You are an expert prioritization analyst. Return ONLY valid JSON.`;

  const userPrompt = PRIORITY_PROMPTS.ANALYZE_TASK_IMPORTANCE(tasks);

  const response = await callClaudeWithSystem(systemPrompt, userPrompt, {
    model: 'claude-3-haiku-20240307',
    maxTokens: 1024,
    temperature: 0.3,
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
 * Suggest task rollover for tomorrow
 */
export async function suggestTaskRollover(
  options: SuggestTaskRolloverOptions
): Promise<{ suggestions: any; usage: any }> {
  const { incompleteTasks, tomorrowContext } = options;

  const systemPrompt = `You are a thoughtful assistant helping plan tomorrow's work. Return ONLY valid JSON.`;

  const userPrompt = PRIORITY_PROMPTS.SUGGEST_TASK_ROLLOVER(
    incompleteTasks,
    tomorrowContext
  );

  const response = await callClaudeWithSystem(systemPrompt, userPrompt, {
    model: 'claude-3-5-sonnet-20241022',
    maxTokens: 1024,
    temperature: 0.7,
  });

  try {
    const suggestions = JSON.parse(response.content);
    return {
      suggestions,
      usage: response.usage,
    };
  } catch (error) {
    console.error('Failed to parse suggestions JSON:', response.content);
    throw new Error('Invalid suggestions response from Claude');
  }
}

/**
 * Generate priority explanation for user
 */
export async function explainPriority(
  priority: {
    title: string;
    reasoning: string;
    impact: string;
  }
): Promise<{ explanation: string; usage: any }> {
  const systemPrompt = `You are a clear communicator helping a founder understand why something is important.`;

  const userPrompt = PRIORITY_PROMPTS.EXPLAIN_PRIORITY(priority);

  const response = await callClaudeWithSystem(systemPrompt, userPrompt, {
    model: 'claude-3-haiku-20240307',
    maxTokens: 512,
    temperature: 0.7,
  });

  return {
    explanation: response.content,
    usage: response.usage,
  };
}

/**
 * Generate weekly priorities
 */
export async function generateWeeklyPriorities(
  options: GenerateWeeklyPrioritiesOptions
): Promise<{ priorities: any[]; usage: any }> {
  const { currentWeekGoals, upcomingDeadlines, pipelineState, capacity } = options;

  const systemPrompt = `You are a strategic planner helping a founder optimize their week. Return ONLY valid JSON.`;

  const userPrompt = PRIORITY_PROMPTS.GENERATE_WEEKLY_PRIORITIES(
    currentWeekGoals,
    upcomingDeadlines,
    pipelineState,
    capacity
  );

  const response = await callClaudeWithSystem(systemPrompt, userPrompt, {
    model: 'claude-3-5-sonnet-20241022',
    maxTokens: 2048,
    temperature: 0.7,
  });

  try {
    const priorities = JSON.parse(response.content);
    return {
      priorities,
      usage: response.usage,
    };
  } catch (error) {
    console.error('Failed to parse priorities JSON:', response.content);
    throw new Error('Invalid priorities response from Claude');
  }
}