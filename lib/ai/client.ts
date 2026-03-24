import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'dummy-key-for-build',
})

// Feature flags for AI functionality
export const AI_FEATURES = {
  DRAFT_GENERATION: true,
  REWRITE: true,
  ENGAGEMENT_COPILOT: true,
  INSIGHTS: true,
  FOLLOW_UPS: true,
} as const

export interface AIGenerateDraftsOptions {
  idea: string
  pillar: string
  tone: string
  voiceProfile: string
}

export interface AIRewriteOptions {
  content: string
  type: 'sharper' | 'safer' | 'human'
  voiceProfile: string
}

export interface AIEngagementAnalysisOptions {
  postText: string
  authorName: string
  authorType: string
  relationshipLevel: string
}

export interface AIInsightsOptions {
  postsCreated: number
  tasksCompleted: number
  pipelineChanges: number
  engagementMetrics: string
}

export interface AIFollowUpOptions {
  contactName: string
  context: string
  lastInteraction: string
}

// Generate multiple draft versions
export async function generateDrafts(options: AIGenerateDraftsOptions): Promise<{
  versions: Array<{
    label: string
    hook: string
    body: string
    cta: string
  }>
}> {
  if (!AI_FEATURES.DRAFT_GENERATION) {
    throw new Error('Draft generation feature is disabled')
  }

  const { idea, pillar, tone, voiceProfile } = options

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: `You are a LinkedIn content assistant helping a founder create authentic, direct, and impactful posts.

VOICE PROFILE:
${voiceProfile}

GUIDELINES:
- Be direct, not polished
- Be observational, not preachy
- Use blunt language when appropriate
- No influencer tone
- No buzzwords
- No "excited to share" or "game changer"
- Generate 3 distinct versions with different angles
- Each version should include: label, hook (1-2 sentences), body (main content), cta (curiosity-driven)`,
      },
      {
        role: 'user',
        content: `Generate 3 versions of a LinkedIn post from this idea:

IDEA: ${idea}
PILLAR: ${pillar}
TONE: ${tone}

Return as JSON with a "versions" array containing objects with label, hook, body, and cta fields.`,
      },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.7,
  })

  return JSON.parse(response.choices[0].message.content || '{}')
}

// Rewrite content with specific transformation
export async function rewriteContent(options: AIRewriteOptions): Promise<{
  rewritten: string
  changes: string[]
}> {
  if (!AI_FEATURES.REWRITE) {
    throw new Error('Rewrite feature is disabled')
  }

  const { content, type, voiceProfile } = options

  const instructions = {
    sharper: 'Make this sharper and more impactful. Strengthen the opening, remove fluff, ensure every sentence pulls its weight.',
    safer: 'Make this safer while maintaining authenticity. Avoid controversial statements, soften absolute claims, focus on shared values.',
    human: 'Make this sound less like AI. Remove AI patterns, add natural transitions, use conversational language, avoid over-structuring.',
  }[type]

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: `You are a LinkedIn content editor.

VOICE PROFILE:
${voiceProfile}

TASK: ${instructions}

Return JSON with "rewritten" (the new content) and "changes" (array of 3-5 specific changes made).`,
      },
      {
        role: 'user',
        content: content,
      },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.6,
  })

  return JSON.parse(response.choices[0].message.content || '{}')
}

// Generate hooks
export async function generateHooks(content: string): Promise<string[]> {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: 'Generate 5 strong, provocative opening hooks for this LinkedIn post. Hooks should be surprising, counterintuitive, or challenging. Return as JSON array of strings.',
      },
      {
        role: 'user',
        content: content,
      },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.8,
  })

  const result = JSON.parse(response.choices[0].message.content || '{}')
  return result.hooks || []
}

// Generate CTAs
export async function generateCTAs(content: string): Promise<string[]> {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: 'Generate 5 curiosity-driven call-to-actions for this LinkedIn post. CTAs should feel natural, non-salesy, and invite genuine engagement. Return as JSON array of strings.',
      },
      {
        role: 'user',
        content: content,
      },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.7,
  })

  const result = JSON.parse(response.choices[0].message.content || '{}')
  return result.ctas || []
}

// Engagement copilot analysis
export async function analyzeEngagement(options: AIEngagementAnalysisOptions): Promise<{
  shouldEngage: 'yes' | 'no' | 'low_priority'
  recommendedAction: 'like' | 'comment' | 'skip' | 'follow'
  commentSuggestions: Array<{
    type: 'blunt' | 'curious' | 'relationship'
    text: string
  }>
  followUpQuestion: string | null
  reasoning: string
  isLead: boolean
}> {
  if (!AI_FEATURES.ENGAGEMENT_COPILOT) {
    throw new Error('Engagement copilot feature is disabled')
  }

  const { postText, authorName, authorType, relationshipLevel } = options

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: `You are an engagement assistant for a founder. Analyze LinkedIn posts and recommend actions.

AUTHOR: ${authorName}
TYPE: ${authorType}
RELATIONSHIP: ${relationshipLevel}

Evaluate if engagement is valuable. Generate 3-5 comment suggestions (mix of blunt, curious, relationship-building). Suggest a follow-up question if relevant. Assess if this is a potential lead.

Return JSON with: shouldEngage (yes/no/low_priority), recommendedAction (like/comment/skip/follow), commentSuggestions array, followUpQuestion (string or null), reasoning (string), isLead (boolean).`,
      },
      {
        role: 'user',
        content: postText,
      },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.7,
  })

  return JSON.parse(response.choices[0].message.content || '{}')
}

// Generate insights
export async function generateInsights(options: AIInsightsOptions): Promise<{
  whatWorked: string
  whatDidnt: string
  wastedEffort: string
  nextPriorities: string[]
}> {
  if (!AI_FEATURES.INSIGHTS) {
    throw new Error('Insights feature is disabled')
  }

  const { postsCreated, tasksCompleted, pipelineChanges, engagementMetrics } = options

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: `You are a CEO insights assistant. Analyze weekly activity and generate actionable insights.

WEEKLY DATA:
- Posts created: ${postsCreated}
- Tasks completed: ${tasksCompleted}
- Pipeline changes: ${pipelineChanges}
- Engagement: ${engagementMetrics}

Identify what worked, what didn't, wasted effort, and next priorities. Be direct and specific.

Return JSON with: whatWorked, whatDidnt, wastedEffort (strings), nextPriorities (array of 3-5 strings).`,
      },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.7,
  })

  return JSON.parse(response.choices[0].message.content || '{}')
}

// Generate follow-up message
export async function generateFollowUp(options: AIFollowUpOptions): Promise<{
  message: string
  contextSummary: string
}> {
  if (!AI_FEATURES.FOLLOW_UPS) {
    throw new Error('Follow-ups feature is disabled')
  }

  const { contactName, context, lastInteraction } = options

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: `Generate a personalized follow-up message. Keep it brief, valuable, and action-oriented. No fluff.

CONTACT: ${contactName}
CONTEXT: ${context}
LAST INTERACTION: ${lastInteraction}

Return JSON with: message (the follow-up text), contextSummary (1-sentence recap of context).`,
      },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.6,
  })

  return JSON.parse(response.choices[0].message.content || '{}')
}