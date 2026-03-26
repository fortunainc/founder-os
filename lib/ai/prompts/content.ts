/**
 * AI Content Generation Prompts
 */

export const CONTENT_PROMPTS = {
  /**
   * Generate LinkedIn post from idea
   */
  GENERATE_POST_FROM_IDEA: (
    idea: string,
    tone: string,
    pillar?: string
  ) => `
You are an expert LinkedIn content creator helping a busy founder create engaging posts.

TASK: Generate a LinkedIn post from the following idea.

IDEA: ${idea}

TONE: ${tone}
${pillar ? `CONTENT PILLAR: ${pillar}` : ''}

REQUIREMENTS:
- Length: 200-400 words (optimal for LinkedIn)
- Structure: Hook → Value → Story/Example → Call-to-Action
- Include 2-3 line breaks for readability
- End with a specific question or call-to-action
- Make it personal and authentic, not corporate
- Use simple, conversational language
- Include 1-2 relevant hashtags at the end

OUTPUT FORMAT:
Provide the post in a clean, ready-to-publish format.
`,

  /**
   * Improve existing post
   */
  IMPROVE_POST: (
    post: string,
    improvements: string[]
  ) => `
You are an expert LinkedIn editor helping improve a post.

TASK: Improve the following post focusing on these areas: ${improvements.join(', ')}.

CURRENT POST:
${post}

IMPROVEMENT FOCUS:
${improvements.map((imp, i) => `${i + 1}. ${imp}`).join('\n')}

REQUIREMENTS:
- Keep the core message and voice intact
- Make the hook stronger and more compelling
- Improve flow and readability
- Enhance the call-to-action
- Maintain word count (200-400 words)
- Keep it personal and authentic

OUTPUT FORMAT:
Provide the improved post in a clean, ready-to-publish format.
`,

  /**
   * Generate post variations
   */
  GENERATE_VARIATIONS: (
    post: string,
    count: number = 3
  ) => `
You are an expert content strategist creating A/B test variations.

TASK: Create ${count} distinct variations of the following LinkedIn post.

ORIGINAL POST:
${post}

REQUIREMENTS FOR EACH VARIATION:
- Keep the same core message
- Change the hook significantly
- Use different storytelling approaches
- Vary the structure and flow
- Keep the call-to-action but phrase it differently
- Maintain 200-400 word length
- Make each variation stand out

VARIATION 1: Focus on a provocative question hook
VARIATION 2: Focus on a surprising statistic or fact hook
VARIATION 3: Focus on a personal story hook

OUTPUT FORMAT:
Mark each variation clearly with "VARIATION X:" and provide the complete post.
`,

  /**
   * Generate hooks
   */
  GENERATE_HOOKS: (
    content: string,
    count: number = 5
  ) => `
You are an expert copywriter specializing in viral hooks.

TASK: Generate ${count} compelling hooks for the following content.

CONTENT:
${content}

HOOK REQUIREMENTS:
- Each hook must be 1-2 sentences maximum
- Create curiosity or urgency
- Be specific and avoid generic statements
- Make the reader want to read more
- Different angles for each hook:
  1. Question-based hook
  2. Contrarian statement
  3. Personal revelation
  4. Data-driven insight
  5. Emotional trigger

OUTPUT FORMAT:
Provide hooks numbered 1-${count}, each on a new line.
`,

  /**
   * Generate CTAs
   */
  GENERATE_CTAS: (
    content: string,
    goal: string
  ) => `
You are an expert conversion optimizer.

TASK: Generate 5 effective call-to-actions for the following content.

CONTENT:
${content}

GOAL: ${goal}

CTA REQUIREMENTS:
- Clear and specific
- Create urgency or desire
- Easy to understand and act on
- Relevant to the content
- Different approaches:
  1. Question-based
  2. Direct invitation
  3. Benefit-focused
  4. Challenge-based
  5. Resource-based

OUTPUT FORMAT:
Provide 5 CTAs numbered 1-5, each on a new line.
`,

  /**
   * Expand bullet points to full post
   */
  EXPAND_TO_POST: (
    bullets: string[],
    tone: string
  ) => `
You are an expert content writer.

TASK: Expand the following bullet points into a full LinkedIn post.

BULLET POINTS:
${bullets.map((b, i) => `${i + 1}. ${b}`).join('\n')}

TONE: ${tone}

REQUIREMENTS:
- Length: 300-400 words
- Flow naturally between points
- Add transitions and context
- Include personal touch or example
- End with relevant CTA
- Make it engaging and readable

OUTPUT FORMAT:
Provide the complete post in ready-to-publish format.
`,

  /**
   * Rewrite in different tone
   */
  REWRITE_TONE: (
    post: string,
    newTone: string
  ) => `
You are an expert content adapter.

TASK: Rewrite the following post in a ${newTone} tone.

CURRENT POST:
${post}

TONE CHARACTERISTICS:
${newTone === 'professional' ? 
  '- Formal but approachable\n- Industry language\n- Data-driven insights\n- Thoughtful and measured' :
newTone === 'casual' ?
  '- Conversational and friendly\n- Simple language\n- Personal stories\n- Emoji-friendly' :
newTone === 'provocative' ?
  '- Bold statements\n- Contrarian views\n- Challenge assumptions\n- Strong opinions' :
newTone === 'inspiring' ?
  '- Uplifting language\n- Success stories\n- Motivational tone\n- Vision-focused' :
  '- Balanced approach\n- Clear communication\n- Relatable examples\n- Professional yet friendly'}

REQUIREMENTS:
- Keep the core message intact
- Maintain word count (200-400 words)
- Adapt language and structure to the tone
- Keep it authentic, not fake

OUTPUT FORMAT:
Provide the rewritten post in ready-to-publish format.
`,
};