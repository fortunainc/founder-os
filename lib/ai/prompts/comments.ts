/**
 * AI Comment Reply Generation Prompts
 */

export const COMMENT_PROMPTS = {
  /**
   * Generate reply options for a comment
   */
  GENERATE_REPLIES: (
    postContent: string,
    comment: string,
    commenterProfile: string,
    userVoice: string
  ) => `
You are an expert community manager helping a founder engage authentically on LinkedIn.

TASK: Generate 3-5 reply options for this comment.

THE POST:
${postContent}

THE COMMENT:
"${comment}"

COMMENTER PROFILE:
${commenterProfile}

YOUR VOICE/STYLE:
${userVoice}

REQUIREMENTS FOR EACH REPLY:
- Length: 1-3 sentences (keep it concise)
- Tone: Match the commenter's energy
- Personal: Reference specific points they made
- Authentic: Sound like a real person, not a bot
- Value: Add something meaningful to the conversation
- CTA: When appropriate, ask a follow-up question
- Avoid: Generic responses, excessive emojis, marketing speak

REPLY STRATEGIES:
1. Appreciation: Thank them + add value
2. Validation: Agree + expand with insight
3. Curiosity: Ask clarifying question + offer help
4. Connection: Share personal experience + relate
5. Challenge (if appropriate): Offer different perspective respectfully

OUTPUT FORMAT:
Provide each reply option clearly numbered (1-5) with the reply text.
No explanations, just the replies themselves.
`,

  /**
   * Classify comment for prioritization
   */
  CLASSIFY_COMMENT: (
    comment: string,
    commenterProfile: string
  ) => `
You are an expert comment analyst helping prioritize responses.

TASK: Classify this comment by priority and type.

COMMENT:
"${comment}"

COMMENTER PROFILE:
${commenterProfile}

CLASSIFICATION OPTIONS:

PRIORITY LEVELS:
1. URGENT - Needs immediate response
   - Direct question
   - Business opportunity
   - Complaint or concern
   - High-value lead

2. HIGH - Respond within 2-4 hours
   - Thoughtful question
   - Interesting insight
   - Request for more info
   - Potential connection

3. MEDIUM - Respond within 12-24 hours
   - General comment
   - Agreement
   - Sharing experience
   - Casual engagement

4. LOW - Optional response
   - Simple emoji
   - Generic compliment
   - Low-value content

COMMENT TYPES:
- QUESTION: Asks for information
- INSIGHT: Shares valuable perspective
- REQUEST: Asks for something specific
- FEEDBACK: Provides constructive input
- PROMOTION: Self-promotional content
- SPAM: Low-quality or irrelevant

OUTPUT FORMAT:
Return ONLY a JSON object with this exact structure:
{
  "priority": "URGENT" | "HIGH" | "MEDIUM" | "LOW",
  "type": "QUESTION" | "INSIGHT" | "REQUEST" | "FEEDBACK" | "PROMOTION" | "SPAM",
  "reasoning": "Brief explanation (1 sentence)",
  "suggestResponse": true | false
}
`,

  /**
   * Detect high-value commenters
   */
  DETECT_HIGH_VALUE_COMMENTER: (
    commenterProfile: string,
    commentHistory: string[]
  ) => `
You are an expert at identifying valuable community members.

TASK: Analyze this commenter to determine if they're high-value.

COMMENTER PROFILE:
${commenterProfile}

RECENT COMMENTS HISTORY:
${commentHistory.map((c, i) => `${i + 1}. "${c}"`).join('\n')}

HIGH-VALUE INDICATORS:
- Industry influence or expertise
- Thoughtful, well-articulated comments
- Engagement from other high-value people
- Consistently adds value to discussions
- Decision-maker profile (CEO, Founder, etc.)
- Potential collaboration opportunities
- Active community member

LOW-VALUE INDICATORS:
- Spam or self-promotion
- Generic comments
- Inconsistent engagement
- Low-quality interactions
- Irrelevant content

OUTPUT FORMAT:
Return ONLY a JSON object with this exact structure:
{
  "isHighValue": true | false,
  "score": 0-100,
  "reasoning": "Brief explanation",
  "indicators": ["List of key indicators found"]
}
`,

  /**
   * Generate follow-up conversation starters
   */
  GENERATE_CONVERSATION_STARTER: (
    reply: string,
    originalComment: string
  ) => `
You are an expert at keeping conversations engaging.

TASK: Generate a follow-up question or statement to keep the conversation going.

YOUR REPLY:
"${reply}"

ORIGINAL COMMENT:
"${originalComment}"

REQUIREMENTS:
- Natural continuation of the conversation
- 1-2 sentences maximum
- Open-ended when possible
- Relevant to the topic
- Not forced or awkward

OUTPUT FORMAT:
Provide 2-3 options for follow-up engagement.
`,

  /**
   * Batch generate replies for multiple comments
   */
  BATCH_GENERATE_REPLIES: (
    postContent: string,
    comments: Array<{
      comment: string;
      commenterProfile: string;
    }>,
    userVoice: string
  ) => {
    let prompt = `
You are an expert community manager helping a founder engage authentically on LinkedIn.

TASK: Generate 3 reply options for each of these comments.

THE POST:
${postContent}

YOUR VOICE/STYLE:
${userVoice}

`;

    comments.forEach((item, index) => {
      prompt += `\nCOMMENT ${index + 1}:\n"${item.comment}"\nCOMMENTER PROFILE:\n${item.commenterProfile}\n\n`;
    });

    prompt += `
REQUIREMENTS FOR EACH REPLY:
- Length: 1-3 sentences
- Tone: Match the commenter's energy
- Personal and authentic
- Add value to conversation
- Avoid generic responses

OUTPUT FORMAT:
For each comment, provide 3 reply options numbered 1-3.
Use this format:

COMMENT 1:
1. [Reply option 1]
2. [Reply option 2]
3. [Reply option 3]

COMMENT 2:
1. [Reply option 1]
[and so on...]
`;

    return prompt;
  },
};