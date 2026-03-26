/**
 * AI Integration Module - Main entry point
 */

export {
  callClaude,
  callClaudeWithSystem,
  batchCallClaude,
  streamClaude,
  validateClaudeConnection,
  type ClaudeConfig,
  type ClaudeResponse,
  type ClaudeModel,
  CLAUDE_MODELS,
  DEFAULT_MODEL,
  MODEL_COSTS,
} from './claude-client';

export {
  CONTENT_PROMPTS,
  COMMENT_PROMPTS,
  PRIORITY_PROMPTS,
  LEAD_PROMPTS,
  INSIGHTS_PROMPTS,
} from './prompts';

export {
  buildUserContext,
  formatUserContext,
  type UserContext,
} from './context/user-context';

export {
  buildDataContext,
  formatDataContext,
  buildPriorityContext,
  buildContentContext,
  buildCommentContext,
  buildLeadContext,
  type DataContext,
} from './context/data-context';

export {
  // Content Service
  generatePostFromIdea,
  improvePost,
  generateVariations,
  generateHooks,
  generateCTAs,
  expandToPost,
  rewriteTone,
  batchGeneratePosts,
  type GeneratePostOptions,
  type ImprovePostOptions,
  type GenerateVariationsOptions,
  type GenerateHooksOptions,
  type GenerateCTAOptions,
  type ExpandToPostOptions,
  type RewriteToneOptions,

  // Comment Service
  generateReplies,
  classifyComment,
  detectHighValueCommenter,
  generateConversationStarter,
  batchGenerateReplies,
  type GenerateRepliesOptions,
  type ClassifyCommentOptions,
  type DetectHighValueCommenterOptions,
  type BatchGenerateRepliesOptions,

  // Priority Service
  generateDailyPriorities,
  analyzeTaskImportance,
  suggestTaskRollover,
  explainPriority,
  generateWeeklyPriorities,
  type GenerateDailyPrioritiesOptions,
  type AnalyzeTaskImportanceOptions,
  type SuggestTaskRolloverOptions,
  type GenerateWeeklyPrioritiesOptions,

  // Lead Service
  scoreLead,
  generateOutreach,
  analyzeInteractionPatterns,
  identifyHighValueLeads,
  generateFollowupStrategy,
  analyzePipelineHealth,
  type ScoreLeadOptions,
  type GenerateOutreachOptions,
  type AnalyzeInteractionPatternsOptions,
  type IdentifyHighValueLeadsOptions,
  type GenerateFollowupStrategyOptions,
  type AnalyzePipelineHealthOptions,

  // Insights Service
  analyzeContentPerformance,
  generateStrategyRecommendations,
  detectTrends,
  generateWeeklyInsights,
  analyzeAudienceSentiment,
  predictPerformance,
  type AnalyzeContentPerformanceOptions,
  type GenerateStrategyRecommendationsOptions,
  type DetectTrendsOptions,
  type GenerateWeeklyInsightsOptions,
  type AnalyzeAudienceSentimentOptions,
  type PredictPerformanceOptions,
} from './services';