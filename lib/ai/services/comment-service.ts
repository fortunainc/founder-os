/**
 * AI Comment Service - Comment reply generation and analysis
 */

import { callClaudeWithSystem } from '../claude-client';
import { COMMENT_PROMPTS } from '../prompts';
import { buildUserContext, formatUserContext } from '../context/user-context';
import type { UserContext } from '../context/user-context';

export interface GenerateRepliesOptions {
  postContent: string;
  comment: string;
  commenterProfile: string;
  userContext?: UserContext;
}

export interface ClassifyCommentOptions {
  comment: string;
  commenterProfile: string;
}

export interface DetectHighValueCommenterOptions {
  commenterProfile: string;
  commentHistory: string[];
}

export interface BatchGenerateRepliesOptions {
  postContent: string;
  comments: Array<{
    comment: string;
    commenterProfile: string;
  }>;
  userContext?: UserContext;
}

/**
 * Generate reply options for a comment
 */
export async function generateReplies(
  options: GenerateRepliesOptions
): Promise<{ replies: string[]; usage: any }> {
  const { postContent, comment, commenterProfile, userContext } = options;

  const systemPrompt = `You are an expert community manager helping a founder engage authentically on LinkedIn.`;

  const userPrompt = COMMENT_PROMPTS.GENERATE_REPLIES(
    postContent,
    comment,
    commenterProfile,
    userContext ? formatUserContext(userContext) : 'Professional and authentic'
  );

  const response = await callClaudeWithSystem(systemPrompt, userPrompt, {
    model: 'claude-3-5-sonnet-20241022',
    maxTokens: 1024,
    temperature: 0.8,
  });

  // Parse replies from response
  const replies = response.content
    .split('\n')
    .filter(line => line.trim() && /^\d+\./.test(line))
    .map(line => line.replace(/^\d+\.\s*/, '').trim());

  return {
    replies,
    usage: response.usage,
  };
}

/**
 * Classify comment for prioritization
 */
export async function classifyComment(
  options: ClassifyCommentOptions
): Promise<{ classification: any; usage: any }> {
  const { comment, commenterProfile } = options;

  const systemPrompt = `You are an expert comment analyst helping prioritize responses. Return ONLY valid JSON.`;

  const userPrompt = COMMENT_PROMPTS.CLASSIFY_COMMENT(comment, commenterProfile);

  const response = await callClaudeWithSystem(systemPrompt, userPrompt, {
    model: 'claude-3-haiku-20240307',
    maxTokens: 512,
    temperature: 0.3,
  });

  try {
    const classification = JSON.parse(response.content);
    return {
      classification,
      usage: response.usage,
    };
  } catch (error) {
    console.error('Failed to parse classification JSON:', response.content);
    throw new Error('Invalid classification response from Claude');
  }
}

/**
 * Detect high-value commenters
 */
export async function detectHighValueCommenter(
  options: DetectHighValueCommenterOptions
): Promise<{ analysis: any; usage: any }> {
  const { commenterProfile, commentHistory } = options;

  const systemPrompt = `You are an expert at identifying valuable community members. Return ONLY valid JSON.`;

  const userPrompt = COMMENT_PROMPTS.DETECT_HIGH_VALUE_COMMENTER(
    commenterProfile,
    commentHistory
  );

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
 * Generate follow-up conversation starters
 */
export async function generateConversationStarter(
  reply: string,
  originalComment: string
): Promise<{ starters: string[]; usage: any }> {
  const systemPrompt = `You are an expert at keeping conversations engaging.`;

  const userPrompt = COMMENT_PROMPTS.GENERATE_CONVERSATION_STARTER(
    reply,
    originalComment
  );

  const response = await callClaudeWithSystem(systemPrompt, userPrompt, {
    model: 'claude-3-haiku-20240307',
    maxTokens: 512,
    temperature: 0.8,
  });

  const starters = response.content
    .split('\n')
    .filter(line => line.trim())
    .map(line => line.replace(/^\d+\.\s*/, '').trim());

  return {
    starters,
    usage: response.usage,
  };
}

/**
 * Batch generate replies for multiple comments
 */
export async function batchGenerateReplies(
  options: BatchGenerateRepliesOptions
): Promise<{ results: Array<{ comment: string; replies: string[] }>; usage: any }> {
  const { postContent, comments, userContext } = options;

  const systemPrompt = `You are an expert community manager helping a founder engage authentically on LinkedIn.`;

  const userPrompt = COMMENT_PROMPTS.BATCH_GENERATE_REPLIES(
    postContent,
    comments,
    userContext ? formatUserContext(userContext) : 'Professional and authentic'
  );

  const response = await callClaudeWithSystem(systemPrompt, userPrompt, {
    model: 'claude-3-5-sonnet-20241022',
    maxTokens: 2048,
    temperature: 0.8,
  });

  // Parse batch results
  const results: Array<{ comment: string; replies: string[] }> = [];
  const lines = response.content.split('\n');
  let currentComment = '';
  let currentReplies: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    
    if (trimmed.startsWith('COMMENT')) {
      // Save previous comment if exists
      if (currentComment && currentReplies.length > 0) {
        results.push({ comment: currentComment, replies: currentReplies });
      }
      // Start new comment (extract from first line after "COMMENT X:")
      const match = trimmed.match(/COMMENT \d+:\s*"(.+?)"/);
      currentComment = match ? match[1] : '';
      currentReplies = [];
    } else if (/^\d+\./.test(trimmed)) {
      currentReplies.push(trimmed.replace(/^\d+\.\s*/, ''));
    }
  }

  // Add last comment
  if (currentComment && currentReplies.length > 0) {
    results.push({ comment: currentComment, replies: currentReplies });
  }

  return {
    results,
    usage: response.usage,
  };
}