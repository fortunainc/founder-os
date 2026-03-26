/**
 * AI Lead Intelligence Prompts
 */

export const LEAD_PROMPTS = {
  /**
   * Score lead based on interaction history
   */
  SCORE_LEAD: (
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
    }
  ) => `
You are an expert lead scoring analyst helping a founder prioritize outreach.

TASK: Analyze this lead and assign a score (0-100) with reasoning.

LEAD PROFILE:
Name: ${lead.name}
Company: ${lead.company || 'N/A'}
Title: ${lead.title || 'N/A'}
Potential Value: ${lead.value ? `$${lead.value}` : 'Unknown'}
Last Contact: ${lead.lastContact}

INTERACTION HISTORY:
${lead.interactionHistory.map(i => `- ${i.date}: ${i.type} - ${i.details}`).join('\n')}

SCORING CRITERIA:
1. ENGAGEMENT: Frequency and quality of interactions
2. INTENT: Clear signals of interest or need
3. FIT: Alignment with ideal customer profile
4. VALUE: Potential revenue opportunity
5. TIMING: Readiness to move forward
6. AUTHORITY: Decision-maker status

SCORE RANGES:
90-100: HOT LEAD - Immediate action required
70-89: WARM LEAD - Active engagement, high potential
50-69: NURTURING - Some interest, needs more development
30-49: COLD - Minimal engagement, low priority
0-29: UNQUALIFIED - Poor fit or no interest

REQUIREMENTS:
- Assign a score (0-100)
- Provide detailed reasoning for the score
- Identify key signals from interaction history
- Suggest next action
- Estimate probability of conversion (0-100%)

OUTPUT FORMAT:
Return ONLY a JSON object with this exact structure:
{
  "score": 85,
  "category": "HOT" | "WARM" | "NURTURING" | "COLD" | "UNQUALIFIED",
  "reasoning": "Detailed explanation of score",
  "keySignals": ["Signal 1", "Signal 2", "Signal 3"],
  "nextAction": "Specific recommended action",
  "conversionProbability": 75,
  "priorityLevel": "URGENT" | "HIGH" | "MEDIUM" | "LOW"
}
`,

  /**
   * Generate personalized outreach message
   */
  GENERATE_OUTREACH: (
    lead: {
      name: string;
      company?: string;
      title?: string;
      interests?: string[];
      recentActivity?: string;
    },
    messageGoal: string,
    previousContext?: string
  ) => `
You are an expert outreach specialist helping a founder craft personalized messages.

TASK: Generate a personalized outreach message for this lead.

LEAD PROFILE:
Name: ${lead.name}
Company: ${lead.company || 'N/A'}
Title: ${lead.title || 'N/A'}
Interests: ${lead.interests?.join(', ') || 'Unknown'}
Recent Activity: ${lead.recentActivity || 'None'}

MESSAGE GOAL: ${messageGoal}
${previousContext ? `PREVIOUS CONTEXT: ${previousContext}` : ''}

OUTREACH PRINCIPLES:
- Personalized based on their profile and activity
- Value-focused, not salesy
- Clear and specific call-to-action
- Concise (100-150 words)
- Authentic, not template-like
- References something specific about them

REQUIREMENTS:
- Make it personal and specific to them
- Focus on providing value first
- Clear next step or question
- Professional but warm tone
- Avoid generic corporate language
- Include 1-2 sentence opening with context

OUTPUT FORMAT:
Provide the complete message in ready-to-send format.
`,

  /**
   * Analyze interaction patterns
   */
  ANALYZE_INTERACTION_PATTERNS: (
    leads: Array<{
      name: string;
      interactionHistory: Array<{
        date: string;
        type: string;
        response?: string;
      }>;
      score?: number;
    }>
  ) => `
You are an expert at analyzing customer behavior patterns.

TASK: Analyze interaction patterns across these leads to identify trends and insights.

LEADS AND THEIR INTERACTION HISTORY:
${leads.map(l => `
${l.name} (Score: ${l.score || 'N/A'}):
${l.interactionHistory.map(i => `  - ${i.date}: ${i.type}${i.response ? ` → ${i.response}` : ''}`).join('\n')}
`).join('\n')}

ANALYSIS FOCUS:
- Common engagement triggers
- Preferred communication channels
- Optimal timing for outreach
- Response patterns and latency
- Conversion signals
- Red flags or drop-off points

REQUIREMENTS:
- Identify 3-5 key patterns
- Explain what each pattern means
- Suggest actionable insights
- Highlight any concerning trends
- Recommend strategy adjustments

OUTPUT FORMAT:
Return ONLY a JSON object with this exact structure:
{
  "keyPatterns": [
    {
      "pattern": "Pattern description",
      "insight": "What this means",
      "actionableInsight": "How to leverage this"
    }
  ],
  "concerningTrends": [
    {
      "trend": "Trend description",
      "impact": "Why it matters",
      "recommendation": "What to do"
    }
  ],
  "strategicRecommendations": [
    "Recommendation 1",
    "Recommendation 2",
    "Recommendation 3"
  ]
}
`,

  /**
   * Identify high-value leads
   */
  IDENTIFY_HIGH_VALUE_LEADS: (
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
    }>
  ) => `
You are an expert at identifying high-potential opportunities.

TASK: Identify which leads are high-value and should be prioritized.

LEADS:
${leads.map(l => `
${l.name}
  Company: ${l.company || 'N/A'}
  Title: ${l.title || 'N/A'}
  Value: ${l.value ? `$${l.value}` : 'Unknown'}
  Last Contact: ${l.lastContact}
  Interactions: ${l.interactionHistory.length}
`).join('\n')}

HIGH-VALUE INDICATORS:
- Decision-maker titles (CEO, Founder, VP, Director)
- Significant contract value
- Active engagement history
- Clear need or pain point
- Good company fit
- Responsive behavior
- Strategic importance

REQUIREMENTS:
- Identify which leads are high-value (score 70+)
- Rank high-value leads by priority
- Provide reasoning for each
- Suggest next actions for top 3

OUTPUT FORMAT:
Return ONLY a JSON array with this exact structure:
[
  {
    "name": "Lead name",
    "isHighValue": true,
    "score": 85,
    "reasoning": "Why this is high-value",
    "priority": 1,
    "nextAction": "Specific recommended action",
    "estimatedValue": "$50,000"
  }
]
`,

  /**
   * Generate follow-up strategy
   */
  GENERATE_FOLLOWUP_STRATEGY: (
    lead: {
      name: string;
      lastContact: string;
      interactionHistory: Array<{
        date: string;
        type: string;
      }>;
    },
    daysSinceContact: number
  ) => `
You are an expert relationship strategist.

TASK: Generate a follow-up strategy for this lead.

LEAD:
Name: ${lead.name}
Last Contact: ${lead.lastContact}
Days Since Contact: ${daysSinceContact}

INTERACTION HISTORY:
${lead.interactionHistory.map(i => `- ${i.date}: ${i.type}`).join('\n')}

FOLLOW-UP STRATEGY CONSIDERATIONS:
- Days since last contact (${daysSinceContact} days)
- Type and quality of previous interactions
- No spam, but don't let opportunities fade
- Add value with each follow-up
- Vary approach and offer

REQUIREMENTS:
- Recommend specific follow-up timing
- Suggest 2-3 different follow-up angles
- Determine if this lead needs special attention
- Consider if lead is still viable

OUTPUT FORMAT:
Return ONLY a JSON object with this exact structure:
{
  "recommendedAction": "CONTACT_NOW" | "WAIT_2_DAYS" | "WAIT_7_DAYS" | "DISQUALIFY",
  "reasoning": "Why this action",
  "followUpMessages": [
    {
      "angle": "Value-add angle description",
      "message": "Draft message",
      "timing": "Send timing"
    }
  ],
  "leadViability": "HIGH" | "MEDIUM" | "LOW",
  "redFlags": ["Any concerning patterns or lack of engagement"]
}
`,

  /**
   * Analyze lead pipeline health
   */
  ANALYZE_PIPELINE_HEALTH: (
    pipelineData: {
      totalLeads: number;
      hotLeads: number;
      warmLeads: number;
      coldLeads: number;
      avgTimeToClose: string;
      conversionRate: number;
      staleLeads: number;
    }
  ) => `
You are a pipeline health analyst.

TASK: Analyze the health of the lead pipeline and provide insights.

PIPELINE METRICS:
- Total Leads: ${pipelineData.totalLeads}
- Hot Leads: ${pipelineData.hotLeads} (${((pipelineData.hotLeads / pipelineData.totalLeads) * 100).toFixed(1)}%)
- Warm Leads: ${pipelineData.warmLeads} (${((pipelineData.warmLeads / pipelineData.totalLeads) * 100).toFixed(1)}%)
- Cold Leads: ${pipelineData.coldLeads} (${((pipelineData.coldLeads / pipelineData.totalLeads) * 100).toFixed(1)}%)
- Avg Time to Close: ${pipelineData.avgTimeToClose}
- Conversion Rate: ${(pipelineData.conversionRate * 100).toFixed(1)}%
- Stale Leads: ${pipelineData.staleLeads}

HEALTH INDICATORS:
- Ideal hot lead ratio: 20-30%
- Ideal warm lead ratio: 40-50%
- Ideal conversion rate: 15-25%
- Acceptable stale leads: <10%

REQUIREMENTS:
- Assess overall pipeline health (EXCELLENT, GOOD, FAIR, POOR)
- Identify strengths and weaknesses
- Highlight any concerning metrics
- Provide 3-5 actionable recommendations
- Suggest priority focus areas

OUTPUT FORMAT:
Return ONLY a JSON object with this exact structure:
{
  "overallHealth": "EXCELLENT" | "GOOD" | "FAIR" | "POOR",
  "healthScore": 75,
  "strengths": ["Strength 1", "Strength 2"],
  "weaknesses": ["Weakness 1", "Weakness 2"],
  "concerningMetrics": [
    {
      "metric": "Metric name",
      "currentValue": "Current value",
      "idealValue": "Ideal value",
      "impact": "Why this matters"
    }
  ],
  "recommendations": [
    "Recommendation 1",
    "Recommendation 2",
    "Recommendation 3"
  ],
  "priorityFocus": "Top priority area"
}
`,
};