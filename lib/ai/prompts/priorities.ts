/**
 * AI Priority Analysis Prompts
 */

export const PRIORITY_PROMPTS = {
  /**
   * Generate daily priorities from multiple data sources
   */
  GENERATE_DAILY_PRIORITIES: (
    tasks: Array<{ title: string; description?: string; dueDate?: string }>,
    staleLeads: Array<{ name: string; lastContact: string; value?: number }>,
    unscheduledDrafts: Array<{ title: string; status: string }>,
    recentPerformance: any,
    userGoals: string[]
  ) => `
You are an intelligent executive assistant helping a busy founder focus on what matters most.

TASK: Analyze all available data and generate the top 3 priorities for today.

CURRENT TASKS (incomplete):
${tasks.map(t => `- ${t.title}${t.description ? `: ${t.description}` : ''}${t.dueDate ? ` (Due: ${t.dueDate})` : ''}`).join('\n')}

STALE LEADS (no contact for 3+ days):
${staleLeads.map(l => `- ${l.name}: Last contact ${l.lastContact}${l.value ? ` (Value: $${l.value})` : ''}`).join('\n')}

UNSCHEDULED DRAFTS (approved but not scheduled):
${unscheduledDrafts.map(d => `- ${d.title} (${d.status})`).join('\n')}

RECENT CONTENT PERFORMANCE:
${JSON.stringify(recentPerformance, null, 2)}

USER'S CURRENT GOALS:
${userGoals.map((g, i) => `${i + 1}. ${g}`).join('\n')}

PRIORITY CRITERIA:
1. URGENCY: Tasks due today or overdue
2. IMPACT: High-value leads and revenue opportunities
3. MOMENTUM: Content that's performing well to capitalize on
4. STRATEGY: Actions that advance key goals
5. OPPORTUNITY: Time-sensitive opportunities
6. MAINTENANCE: Preventing pipeline decay

REQUIREMENTS:
- Generate exactly 3 priorities ranked by importance
- Each priority must have a clear, actionable title
- Provide detailed reasoning for why it's a priority
- Include specific action steps (2-3 steps per priority)
- Consider the user's goals in your analysis
- Be strategic, not just reactive

OUTPUT FORMAT:
Return ONLY a JSON array with this exact structure:
[
  {
    "rank": 1,
    "title": "Clear, actionable title",
    "reasoning": "Detailed explanation of why this is priority #1",
    "actionSteps": ["Step 1", "Step 2", "Step 3"],
    "estimatedTime": "30 minutes",
    "impact": "HIGH" | "MEDIUM" | "LOW",
    "source": "TASK" | "LEAD" | "CONTENT" | "GOAL"
  }
]
`,

  /**
   * Analyze task importance and suggest ordering
   */
  ANALYZE_TASK_IMPORTANCE: (
    tasks: Array<{
      title: string;
      description?: string;
      dueDate?: string;
      estimatedTime?: string;
    }>
  ) => `
You are an expert prioritization analyst.

TASK: Analyze these tasks and rank them by importance.

TASKS:
${tasks.map((t, i) => `
${i + 1}. ${t.title}
   ${t.description ? `Description: ${t.description}` : ''}
   ${t.dueDate ? `Due: ${t.dueDate}` : ''}
   ${t.estimatedTime ? `Est. Time: ${t.estimatedTime}` : ''}
`).join('\n')}

PRIORITY FACTORS:
- Deadline proximity
- Strategic importance
- Dependencies on other tasks
- Resource requirements
- Impact on goals
- Risk if delayed

OUTPUT FORMAT:
Return ONLY a JSON array with this exact structure:
[
  {
    "rank": 1,
    "taskId": "task-1",
    "title": "Task title",
    "reasoning": "Why this task is ranked here",
    "recommendedOrder": 1,
    "priority": "URGENT" | "HIGH" | "MEDIUM" | "LOW"
  }
]
`,

  /**
   * Suggest task rollover for tomorrow
   */
  SUGGEST_TASK_ROLLOVER: (
    incompleteTasks: Array<{
      title: string;
      description?: string;
      startedDate: string;
    }>,
    tomorrowContext: string
  ) => `
You are a thoughtful assistant helping plan tomorrow's work.

TASK: Review incomplete tasks and recommend which should roll over to tomorrow.

INCOMPLETE TASKS:
${incompleteTasks.map(t => `- ${t.title}${t.description ? `: ${t.description}` : ''} (Started: ${t.startedDate})`).join('\n')}

TOMORROW'S CONTEXT:
${tomorrowContext}

ROLLOVER CRITERIA:
- Tasks critical to goals or deadlines
- Tasks partially completed and worth finishing
- Tasks blocked today but likely unblocked tomorrow
- Tasks with momentum that shouldn't be lost
- Avoid rolling over low-value or stalled tasks

REQUIREMENTS:
- Recommend which tasks should roll over
- Explain why each should/shouldn't roll over
- Suggest any tasks to abandon or defer
- Consider tomorrow's context in recommendations

OUTPUT FORMAT:
Return ONLY a JSON object with this exact structure:
{
  "rolloverTasks": [
    {
      "title": "Task title",
      "reasoning": "Why it should roll over",
      "recommendedTime": "Morning/Afternoon",
      "priority": "URGENT" | "HIGH" | "MEDIUM" | "LOW"
    }
  ],
  "abandonTasks": [
    {
      "title": "Task title",
      "reasoning": "Why it should be abandoned"
    }
  ],
  "deferTasks": [
    {
      "title": "Task title",
      "reasoning": "Why it should be deferred",
      "suggestedDate": "Specific date or timeframe"
    }
  ]
}
`,

  /**
   * Generate priority explanation for user
   */
  EXPLAIN_PRIORITY: (
    priority: {
      title: string;
      reasoning: string;
      impact: string;
    }
  ) => `
You are a clear communicator helping a founder understand why something is important.

TASK: Explain this priority in a compelling, motivating way.

PRIORITY:
Title: ${priority.title}
Reasoning: ${priority.reasoning}
Impact: ${priority.impact}

REQUIREMENTS:
- Make it clear and compelling
- Connect to bigger goals
- Show the consequences of not doing it
- Be motivating, not guilt-tripping
- 2-3 sentences maximum
- Action-oriented tone

OUTPUT FORMAT:
Provide a clear, motivating explanation (2-3 sentences).
`,

  /**
   * Weekly priority planning
   */
  GENERATE_WEEKLY_PRIORITIES: (
    currentWeekGoals: string[],
    upcomingDeadlines: string[],
    pipelineState: any,
    capacity: string
  ) => `
You are a strategic planner helping a founder optimize their week.

TASK: Generate the top 5 priorities for this week.

WEEKLY GOALS:
${currentWeekGoals.map((g, i) => `${i + 1}. ${g}`).join('\n')}

UPCOMING DEADLINES:
${upcomingDeadlines.map(d => `- ${d}`).join('\n')}

PIPELINE STATE:
${JSON.stringify(pipelineState, null, 2)}

AVAILABLE CAPACITY: ${capacity}

WEEKLY PLANNING PRINCIPLES:
- Balance urgent and important
- Leave buffer for unexpected work
- Group similar tasks for efficiency
- Schedule deep work blocks
- Account for energy levels throughout the week
- Build in review and reflection time

REQUIREMENTS:
- Generate 5 priorities for the week
- Distribute across the week (not all day 1)
- Consider realistic capacity
- Include both strategic and tactical priorities
- Suggest optimal timing for each priority

OUTPUT FORMAT:
Return ONLY a JSON array with this exact structure:
[
  {
    "rank": 1,
    "title": "Priority title",
    "reasoning": "Strategic importance",
    "optimalDay": "Monday/Tuesday/Wednesday/Thursday/Friday",
    "timeBlock": "Morning/Afternoon",
    "estimatedTime": "2 hours",
    "impact": "HIGH" | "MEDIUM" | "LOW"
  }
]
`,
};