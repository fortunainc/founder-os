/**
 * AI Content Service - Content generation and improvement
 */

import { callClaudeWithSystem } from '../claude-client';
import { CONTENT_PROMPTS } from '../prompts';
import { buildUserContext, formatUserContext } from '../context/user-context';
import type { UserContext } from '../context/user-context';

export interface GeneratePostOptions {
  idea: string;
  tone?: 'professional' | 'casual' | 'provocative' | 'inspiring';
  pillar?: string;
  userContext?: UserContext;
}

export interface ImprovePostOptions {
  post: string;
  improvements: Array<'hook' | 'structure' | 'cta' | 'flow' | 'clarity' | 'engagement'>;
  userContext?: UserContext;
}

export interface GenerateVariationsOptions {
  post: string;
  count?: number;
}

export interface GenerateHooksOptions {
  content: string;
  count?: number;
}

export interface GenerateCTAOptions {
  content: string;
  goal: 'engagement' | 'conversion' | 'connection' | 'feedback' | 'growth';
}

export interface ExpandToPostOptions {
  bullets: string[];
  tone?: 'professional' | 'casual' | 'provocative' | 'inspiring';
  userContext?: UserContext;
}

export interface RewriteToneOptions {
  post: string;
  newTone: 'professional' | 'casual' | 'provocative' | 'inspiring';
  userContext?: UserContext;
}

/**
 * Generate LinkedIn post from idea
 */
export async function generatePostFromIdea(
  options: GeneratePostOptions
): Promise<{ content: string; usage: any }> {
  const { idea, tone = 'professional', pillar, userContext } = options;

  const systemPrompt = `You are an expert LinkedIn content creator helping a busy founder create engaging posts. Write in a ${tone} tone.`;

  let userPrompt = CONTENT_PROMPTS.GENERATE_POST_FROM_IDEA(idea, tone, pillar);

  if (userContext) {
    userPrompt += `\n\n${formatUserContext(userContext)}`;
  }

  const response = await callClaudeWithSystem(systemPrompt, userPrompt, {
    model: 'claude-3-5-sonnet-20241022',
    maxTokens: 1024,
    temperature: 0.8,
  });

  return {
    content: response.content,
    usage: response.usage,
  };
}

/**
 * Improve existing post
 */
export async function improvePost(
  options: ImprovePostOptions
): Promise<{ content: string; usage: any }> {
  const { post, improvements, userContext } = options;

  const systemPrompt = `You are an expert LinkedIn editor helping improve a post while maintaining the author's voice.`;

  let userPrompt = CONTENT_PROMPTS.IMPROVE_POST(post, improvements);

  if (userContext) {
    userPrompt += `\n\n${formatUserContext(userContext)}`;
  }

  const response = await callClaudeWithSystem(systemPrompt, userPrompt, {
    model: 'claude-3-5-sonnet-20241022',
    maxTokens: 1024,
    temperature: 0.7,
  });

  return {
    content: response.content,
    usage: response.usage,
  };
}

/**
 * Generate post variations for A/B testing
 */
export async function generateVariations(
  options: GenerateVariationsOptions
): Promise<{ variations: string[]; usage: any }> {
  const { post, count = 3 } = options;

  const systemPrompt = `You are an expert content strategist creating A/B test variations.`;

  const userPrompt = CONTENT_PROMPTS.GENERATE_VARIATIONS(post, count);

  const response = await callClaudeWithSystem(systemPrompt, userPrompt, {
    model: 'claude-3-5-sonnet-20241022',
    maxTokens: 2048,
    temperature: 0.8,
  });

  // Parse variations from response
  const variations = response.content
    .split('VARIATION')
    .filter(v => v.trim())
    .map(v => v.replace(/^\s*\d+:\s*/, '').trim());

  return {
    variations,
    usage: response.usage,
  };
}

/**
 * Generate compelling hooks
 */
export async function generateHooks(
  options: GenerateHooksOptions
): Promise<{ hooks: string[]; usage: any }> {
  const { content, count = 5 } = options;

  const systemPrompt = `You are an expert copywriter specializing in viral hooks.`;

  const userPrompt = CONTENT_PROMPTS.GENERATE_HOOKS(content, count);

  const response = await callClaudeWithSystem(systemPrompt, userPrompt, {
    model: 'claude-3-haiku-20240307',
    maxTokens: 512,
    temperature: 0.9,
  });

  const hooks = response.content
    .split('\n')
    .filter(line => line.trim())
    .map(line => line.replace(/^\d+\.\s*/, '').trim());

  return {
    hooks,
    usage: response.usage,
  };
}

/**
 * Generate call-to-actions
 */
export async function generateCTAs(
  options: GenerateCTAOptions
): Promise<{ ctas: string[]; usage: any }> {
  const { content, goal } = options;

  const systemPrompt = `You are an expert conversion optimizer.`;

  const userPrompt = CONTENT_PROMPTS.GENERATE_CTAS(content, goal);

  const response = await callClaudeWithSystem(systemPrompt, userPrompt, {
    model: 'claude-3-haiku-20240307',
    maxTokens: 512,
    temperature: 0.8,
  });

  const ctas = response.content
    .split('\n')
    .filter(line => line.trim())
    .map(line => line.replace(/^\d+\.\s*/, '').trim());

  return {
    ctas,
    usage: response.usage,
  };
}

/**
 * Expand bullet points to full post
 */
export async function expandToPost(
  options: ExpandToPostOptions
): Promise<{ content: string; usage: any }> {
  const { bullets, tone = 'professional', userContext } = options;

  const systemPrompt = `You are an expert content writer.`;

  let userPrompt = CONTENT_PROMPTS.EXPAND_TO_POST(bullets, tone);

  if (userContext) {
    userPrompt += `\n\n${formatUserContext(userContext)}`;
  }

  const response = await callClaudeWithSystem(systemPrompt, userPrompt, {
    model: 'claude-3-5-sonnet-20241022',
    maxTokens: 1024,
    temperature: 0.8,
  });

  return {
    content: response.content,
    usage: response.usage,
  };
}

/**
 * Rewrite post in different tone
 */
export async function rewriteTone(
  options: RewriteToneOptions
): Promise<{ content: string; usage: any }> {
  const { post, newTone, userContext } = options;

  const systemPrompt = `You are an expert content adapter.`;

  let userPrompt = CONTENT_PROMPTS.REWRITE_TONE(post, newTone);

  if (userContext) {
    userPrompt += `\n\n${formatUserContext(userContext)}`;
  }

  const response = await callClaudeWithSystem(systemPrompt, userPrompt, {
    model: 'claude-3-5-sonnet-20241022',
    maxTokens: 1024,
    temperature: 0.8,
  });

  return {
    content: response.content,
    usage: response.usage,
  };
}

/**
 * Batch generate posts from multiple ideas
 */
export async function batchGeneratePosts(
  ideas: string[],
  tone: 'professional' | 'casual' | 'provocative' | 'inspiring' = 'professional',
  userContext?: UserContext
): Promise<{ posts: Array<{ idea: string; content: string }>; usage: any }> {
  const systemPrompt = `You are an expert LinkedIn content creator. Write in a ${tone} tone.`;

  const posts: Array<{ idea: string; content: string }> = [];
  let totalUsage = { inputTokens: 0, outputTokens: 0, totalTokens: 0, estimatedCost: 0 };

  for (const idea of ideas) {
    let userPrompt = CONTENT_PROMPTS.GENERATE_POST_FROM_IDEA(idea, tone);

    if (userContext) {
      userPrompt += `\n\n${formatUserContext(userContext)}`;
    }

    const response = await callClaudeWithSystem(systemPrompt, userPrompt, {
      model: 'claude-3-5-sonnet-20241022',
      maxTokens: 1024,
      temperature: 0.8,
    });

    posts.push({ idea, content: response.content });
    totalUsage.inputTokens += response.usage.inputTokens;
    totalUsage.outputTokens += response.usage.outputTokens;
    totalUsage.totalTokens += response.usage.totalTokens;
    totalUsage.estimatedCost += response.usage.estimatedCost;
  }

  return {
    posts,
    usage: totalUsage,
  };
}