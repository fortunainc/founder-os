import Anthropic from '@anthropic-ai/sdk';

// Initialize Claude client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

// Model selection
export const CLAUDE_MODELS = {
  HAiku: 'claude-3-haiku-20240307', // Fast, cost-effective
  SONNET: 'claude-3-5-sonnet-20241022', // Balanced performance
  OPUS: 'claude-3-opus-20240229', // Highest quality
} as const;

export type ClaudeModel = typeof CLAUDE_MODELS[keyof typeof CLAUDE_MODELS];

// Default model configuration
export const DEFAULT_MODEL: ClaudeModel = CLAUDE_MODELS.SONNET;

// Cost tracking (per million tokens)
export const MODEL_COSTS = {
  'claude-3-haiku-20240307': { input: 0.25, output: 1.25 },
  'claude-3-5-sonnet-20241022': { input: 3.0, output: 15.0 },
  'claude-3-opus-20240229': { input: 15.0, output: 75.0 },
} as const;

export interface ClaudeConfig {
  model?: ClaudeModel;
  maxTokens?: number;
  temperature?: number;
}

export interface ClaudeResponse {
  content: string;
  model: string;
  usage: {
    inputTokens: number;
    outputTokens: number;
    totalTokens: number;
    estimatedCost: number;
  };
}

/**
 * Core Claude API wrapper with error handling and cost tracking
 */
export async function callClaude(
  prompt: string,
  config: ClaudeConfig = {}
): Promise<ClaudeResponse> {
  const {
    model = DEFAULT_MODEL,
    maxTokens = 4096,
    temperature = 0.7,
  } = config;

  try {
    const response = await anthropic.messages.create({
      model,
      max_tokens: maxTokens,
      temperature,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    // Extract content
    const content = response.content
      .filter((block) => block.type === 'text')
      .map((block) => 'text' in block ? (block as any).text : '')
      .join('\n');
    const inputTokens = response.usage.input_tokens;
    const outputTokens = response.usage.output_tokens;
    const totalTokens = inputTokens + outputTokens;
    const costs = MODEL_COSTS[model];
    const estimatedCost =
      (inputTokens / 1_000_000) * costs.input +
      (outputTokens / 1_000_000) * costs.output;

    return {
      content,
      model,
      usage: {
        inputTokens,
        outputTokens,
        totalTokens,
        estimatedCost,
      },
    };
  } catch (error) {
    console.error('Claude API error:', error);
    throw new Error(
      `Failed to call Claude API: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Call Claude with system message for better context
 */
export async function callClaudeWithSystem(
  systemPrompt: string,
  userPrompt: string,
  config: ClaudeConfig = {}
): Promise<ClaudeResponse> {
  const {
    model = DEFAULT_MODEL,
    maxTokens = 4096,
    temperature = 0.7,
  } = config;

  try {
    const response = await anthropic.messages.create({
      model,
      max_tokens: maxTokens,
      temperature,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: userPrompt,
        },
      ],
    });

    const content = response.content
      .filter((block) => block.type === 'text')
      .map((block) => 'text' in block ? (block as any).text : '')
      .join('\n');

    const inputTokens = response.usage.input_tokens;
    const outputTokens = response.usage.output_tokens;
    const totalTokens = inputTokens + outputTokens;
    const costs = MODEL_COSTS[model];
    const estimatedCost =
      (inputTokens / 1_000_000) * costs.input +
      (outputTokens / 1_000_000) * costs.output;

    return {
      content,
      model,
      usage: {
        inputTokens,
        outputTokens,
        totalTokens,
        estimatedCost,
      },
    };
  } catch (error) {
    console.error('Claude API error:', error);
    throw new Error(
      `Failed to call Claude API: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Batch processing for multiple Claude calls
 */
export async function batchCallClaude(
  prompts: Array<{ prompt: string; config?: ClaudeConfig }>,
  concurrency: number = 3
): Promise<ClaudeResponse[]> {
  const results: ClaudeResponse[] = [];
  
  for (let i = 0; i < prompts.length; i += concurrency) {
    const batch = prompts.slice(i, i + concurrency);
    const batchResults = await Promise.all(
      batch.map(({ prompt, config }) => callClaude(prompt, config))
    );
    results.push(...batchResults);
  }
  
  return results;
}

/**
 * Stream Claude response for real-time feedback
 */
export async function* streamClaude(
  prompt: string,
  config: ClaudeConfig = {}
): AsyncGenerator<string, void, unknown> {
  const {
    model = DEFAULT_MODEL,
    maxTokens = 4096,
    temperature = 0.7,
  } = config;

  try {
    const stream = await anthropic.messages.create({
      model,
      max_tokens: maxTokens,
      temperature,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      stream: true,
    });

    for await (const event of stream) {
      if (event.type === 'content_block_delta') {
        if (event.delta.type === 'text_delta') {
          yield event.delta.text;
        }
      }
    }
  } catch (error) {
    console.error('Claude streaming error:', error);
    throw new Error(
      `Failed to stream Claude: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Validate API key and connection
 */
export async function validateClaudeConnection(): Promise<boolean> {
  try {
    const response = await callClaude('Say "Connection successful"', {
      model: CLAUDE_MODELS.HAiku,
      maxTokens: 50,
    });
    return response.content.includes('Connection successful');
  } catch (error) {
    console.error('Claude connection validation failed:', error);
    return false;
  }
}