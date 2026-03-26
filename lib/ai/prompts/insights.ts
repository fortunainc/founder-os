/**
 * AI Performance Insights & Analytics Prompts
 */

export const INSIGHTS_PROMPTS = {
  /**
   * Analyze content performance patterns
   */
  ANALYZE_CONTENT_PERFORMANCE: (
    posts: Array<{
      title: string;
      topic?: string;
      pillar?: string;
      likes: number;
      comments: number;
      shares: number;
      impressions: number;
      publishedDate: string;
    }>
  ) => `
You are an expert content strategist and LinkedIn algorithm analyst.

TASK: Analyze the performance of these posts to identify patterns and insights.

POSTS:
${posts.map(p => `
POST: ${p.title}
Topic: ${p.topic || 'N/A'}
Pillar: ${p.pillar || 'N/A'}
Likes: ${p.likes}
Comments: ${p.comments}
Shares: ${p.shares}
Impressions: ${p.impressions}
Engagement Rate: ${((p.likes + p.comments + p.shares) / p.impressions * 100).toFixed(2)}%
Published: ${p.publishedDate}
`).join('\n')}

ANALYSIS FOCUS:
- High-performing vs low-performing patterns
- Optimal topics and pillars
- Best posting times (if data available)
- Content length preferences
- Hook effectiveness
- Engagement quality

REQUIREMENTS:
- Identify top 3 best-performing posts and why
- Identify bottom 3 posts and what went wrong
- Find 3-5 key performance patterns
- Recommend content strategy improvements
- Suggest specific topics to pursue/avoid

OUTPUT FORMAT:
Return ONLY a JSON object with this exact structure:
{
  "topPerformers": [
    {
      "title": "Post title",
      "engagementRate": 12.5,
      "whyItWorked": "Key success factors"
    }
  ],
  "underperformers": [
    {
      "title": "Post title",
      "engagementRate": 1.2,
      "whatWentWrong": "Key issues"
    }
  ],
  "keyPatterns": [
    {
      "pattern": "Pattern description",
      "insight": "What this tells us",
      "action": "How to leverage this"
    }
  ],
  "strategyRecommendations": [
    "Recommendation 1",
    "Recommendation 2",
    "Recommendation 3"
  ],
  "topicsToPursue": ["Topic 1", "Topic 2"],
  "topicsToAvoid": ["Topic 1", "Topic 2"]
}
`,

  /**
   * Generate content strategy recommendations
   */
  GENERATE_STRATEGY_RECOMMENDATIONS: (
    performanceData: any,
    currentGoals: string[],
    audienceInsights: any
  ) => `
You are a strategic content consultant.

TASK: Generate comprehensive content strategy recommendations based on performance data.

PERFORMANCE SUMMARY:
${JSON.stringify(performanceData, null, 2)}

CURRENT GOALS:
${currentGoals.map((g, i) => `${i + 1}. ${g}`).join('\n')}

AUDIENCE INSIGHTS:
${JSON.stringify(audienceInsights, null, 2)}

STRATEGY FRAMEWORK:
- Content mix optimization
- Posting frequency and timing
- Topic and pillar focus
- Engagement strategy
- Growth tactics
- Brand positioning

REQUIREMENTS:
- Provide 5-7 strategic recommendations
- Each recommendation should be actionable
- Include expected impact
- Prioritize by impact and effort
- Connect to current goals

OUTPUT FORMAT:
Return ONLY a JSON object with this exact structure:
{
  "recommendations": [
    {
      "title": "Recommendation title",
      "description": "Detailed explanation",
      "expectedImpact": "HIGH" | "MEDIUM" | "LOW",
      "effort": "LOW" | "MEDIUM" | "HIGH",
      "priority": 1,
      "actionItems": ["Action 1", "Action 2"]
    }
  ],
  "contentMixSuggestion": {
    "educational": 30,
    "personal": 25,
    "industry": 25,
    "promotional": 20
  },
  "postingFrequency": "3-5 posts per week",
  "topPillars": ["Pillar 1", "Pillar 2", "Pillar 3"]
}
`,

  /**
   * Detect trends and patterns
   */
  DETECT_TRENDS: (
    posts: Array<{
      title: string;
      topic?: string;
      publishedDate: string;
      likes: number;
      comments: number;
    }>,
    timeframe: string = "last 30 days"
  ) => `
You are a trend analyst specialized in LinkedIn content.

TASK: Identify emerging trends and patterns in content performance.

TIMEFRAME: ${timeframe}

POSTS:
${posts.map(p => `
${p.publishedDate}: ${p.title} (${p.topic || 'N/A'})
  Likes: ${p.likes}, Comments: ${p.comments}
`).join('\n')}

TREND ANALYSIS:
- Rising topics
- Declining topics
- Engagement quality shifts
- Audience preference changes
- Seasonal patterns

REQUIREMENTS:
- Identify 3-5 emerging trends
- Identify 2-3 declining trends
- Explain what's driving each trend
- Suggest how to capitalize or adapt

OUTPUT FORMAT:
Return ONLY a JSON object with this exact structure:
{
  "risingTrends": [
    {
      "trend": "Trend description",
      "evidence": "Data supporting this trend",
      "opportunity": "How to capitalize",
      "examples": ["Example 1", "Example 2"]
    }
  ],
  "decliningTrends": [
    {
      "trend": "Trend description",
      "evidence": "Data showing decline",
      "recommendation": "How to adapt"
    }
  ],
  "audienceShifts": [
    {
      "shift": "Behavior change description",
      "impact": "Why it matters"
    }
  ]
}
`,

  /**
   * Generate weekly insights summary
   */
  GENERATE_WEEKLY_INSIGHTS: (
    weekData: {
      postsPublished: number;
      totalEngagement: number;
      avgEngagementRate: number;
      topPost: string;
      newFollowers: number;
      leadsGenerated: number;
      tasksCompleted: number;
      contentMilestones: string[];
      keyWins: string[];
      learnings: string[];
    }
  ) => `
You are an executive assistant preparing a weekly brief for a founder.

TASK: Generate a clear, actionable weekly insights summary.

WEEK DATA:
- Posts Published: ${weekData.postsPublished}
- Total Engagement: ${weekData.totalEngagement} likes/comments/shares
- Avg Engagement Rate: ${weekData.avgEngagementRate}%
- Top Performing Post: ${weekData.topPost}
- New Followers: ${weekData.newFollowers}
- Leads Generated: ${weekData.leadsGenerated}
- Tasks Completed: ${weekData.tasksCompleted}

CONTENT MILESTONES:
${weekData.contentMilestones.map(m => `- ${m}`).join('\n')}

KEY WINS:
${weekData.keyWins.map(w => `- ${w}`).join('\n')}

KEY LEARNINGS:
${weekData.learnings.map(l => `- ${l}`).join('\n')}

REQUIREMENTS:
- Summarize the week's performance
- Highlight 3 key wins
- Extract 3 actionable insights
- Suggest 2-3 focus areas for next week
- Keep it concise and motivating
- Executive summary style

OUTPUT FORMAT:
Provide a clear, professional brief with sections:
1. WEEK AT A GLANCE (bullets)
2. KEY WINS (3 items with impact)
3. ACTIONABLE INSIGHTS (3 items with next steps)
4. NEXT WEEK FOCUS (2-3 priorities)
`,

  /**
   * Analyze audience sentiment
   */
  ANALYZE_AUDIENCE_SENTIMENT: (
    comments: Array<{
      text: string;
      likes?: number;
      date: string;
    }>
  ) => `
You are an expert sentiment analyst specializing in LinkedIn engagement.

TASK: Analyze the sentiment and quality of audience engagement.

COMMENTS:
${comments.map(c => `
"${c.text}"
  Likes: ${c.likes || 0}
  Date: ${c.date}
`).join('\n')}

SENTIMENT ANALYSIS:
- Overall sentiment (POSITIVE, NEUTRAL, NEGATIVE)
- Key themes and topics mentioned
- Audience questions and concerns
- Quality of engagement
- Thoughtful vs generic comments

REQUIREMENTS:
- Assess overall sentiment
- Identify 3-5 key themes
- Highlight audience questions/concerns
- Evaluate engagement quality
- Suggest how to improve future engagement

OUTPUT FORMAT:
Return ONLY a JSON object with this exact structure:
{
  "overallSentiment": "POSITIVE" | "NEUTRAL" | "NEGATIVE",
  "sentimentScore": 75,
  "keyThemes": [
    {
      "theme": "Theme description",
      "frequency": 5,
      "sentiment": "POSITIVE" | "NEUTRAL" | "NEGATIVE"
    }
  ],
  "audienceQuestions": [
    {
      "question": "Question text",
      "occurrences": 3
    }
  ],
  "engagementQuality": "HIGH" | "MEDIUM" | "LOW",
  "qualityScore": 80,
  "improvementSuggestions": [
    "Suggestion 1",
    "Suggestion 2"
  ]
}
`,

  /**
   * Predict content performance
   */
  PREDICT_PERFORMANCE: (
    post: {
      title: string;
      topic?: string;
      pillar?: string;
      length?: number;
      hook?: string;
    },
    historicalData: any
  ) => `
You are an AI content performance predictor.

TASK: Predict how well this post will perform based on historical data.

POST TO PREDICT:
Title: ${post.title}
Topic: ${post.topic || 'N/A'}
Pillar: ${post.pillar || 'N/A'}
Length: ${post.length || 'N/A'} words
Hook: ${post.hook || 'N/A'}

HISTORICAL PERFORMANCE DATA:
${JSON.stringify(historicalData, null, 2)}

PREDICTION FACTORS:
- Topic performance history
- Pillar engagement rates
- Hook strength
- Length optimization
- Timing context

REQUIREMENTS:
- Predict engagement rate (0-20%)
- Predict estimated likes/comments/shares
- Explain prediction reasoning
- Identify success factors
- Suggest improvements to boost performance

OUTPUT FORMAT:
Return ONLY a JSON object with this exact structure:
{
  "predictedEngagementRate": 8.5,
  "predictedLikes": 150,
  "predictedComments": 25,
  "predictedShares": 10,
  "confidence": "HIGH" | "MEDIUM" | "LOW",
  "reasoning": "Why this prediction",
  "successFactors": ["Factor 1", "Factor 2"],
  "improvements": [
    {
      "area": "Area to improve",
      "suggestion": "Specific suggestion",
      "potentialLift": "+10%"
    }
  ]
}
`,
};