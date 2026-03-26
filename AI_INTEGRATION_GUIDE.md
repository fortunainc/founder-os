# FounderOS AI Integration - Complete Implementation Guide

## 🚀 Overview

FounderOS now includes full **Claude (Anthropic) AI integration** to dramatically improve your daily efficiency. All AI features use Claude 3.5 Sonnet for optimal quality and cost-effectiveness.

---

## 📋 What's Been Implemented

### ✅ Phase 1: Infrastructure (COMPLETE)
- Claude API client with error handling
- Cost tracking and usage monitoring
- Model selection (Haiku, Sonnet, Opus)
- Batch processing support
- Streaming capability
- Prompt template system
- Context builders for user personalization

### ✅ Phase 2: AI Services (COMPLETE)
1. **Content Service** - Post generation and improvement
2. **Comment Service** - Reply generation and classification
3. **Priority Service** - Daily priority generation
4. **Lead Service** - Lead scoring and outreach
5. **Insights Service** - Performance analysis

### ✅ Phase 3: API Endpoints (COMPLETE)
- `/api/ai/content/generate` - Generate posts from ideas
- `/api/ai/content/improve` - Improve existing posts
- `/api/ai/comments/replies` - Generate comment replies
- `/api/ai/priorities/generate` - Generate daily priorities
- `/api/ai/leads/score` - Score leads with AI
- `/api/ai/insights/analyze` - Analyze content performance

### ✅ Phase 4: Database (COMPLETE)
- `ai_usage_logs` table for tracking
- RLS policies for security
- Indexes for performance

---

## 🔧 Setup Instructions

### 1. Get Claude API Key

1. Go to [Anthropic Console](https://console.anthropic.com/)
2. Sign in or create account
3. Go to API Keys section
4. Create new API key
5. Copy the key (starts with `sk-ant-...`)

### 2. Configure Environment Variables

Add to your `.env.local` file:

```bash
# Supabase (already configured)
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# Anthropic Claude API (NEW)
ANTHROPIC_API_KEY=sk-ant-...
```

### 3. Update Database Schema

Run the SQL in `supabase/schema.sql` in your Supabase SQL editor:

```sql
-- AI Usage Logs Table
CREATE TABLE IF NOT EXISTS ai_usage_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  feature VARCHAR(100) NOT NULL,
  model_used VARCHAR(100) NOT NULL,
  input_tokens INTEGER DEFAULT 0,
  output_tokens INTEGER DEFAULT 0,
  total_tokens INTEGER DEFAULT 0,
  cost DECIMAL(10, 4) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);
```

### 4. Deploy Changes

```bash
# Commit and push changes
git add .
git commit -m "Add Claude AI integration"
git push

# Deploy to Vercel (automatic)
```

---

## 💡 Using AI Features

### 1. Generate LinkedIn Posts from Ideas

**API Call:**
```typescript
const response = await fetch('/api/ai/content/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    idea: "The importance of building in public",
    tone: "professional",
    pillar: "Building in Public"
  })
});

const { content, usage } = await response.json();
```

**Response:**
```json
{
  "success": true,
  "content": "Building in public isn't just about sharing your work...",
  "usage": {
    "inputTokens": 250,
    "outputTokens": 380,
    "totalTokens": 630,
    "estimatedCost": 0.012
  }
}
```

### 2. Improve Existing Posts

**API Call:**
```typescript
const response = await fetch('/api/ai/content/improve', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    post: "Your existing post content here...",
    improvements: ["hook", "structure", "cta"]
  })
});
```

### 3. Generate Comment Replies

**API Call:**
```typescript
const response = await fetch('/api/ai/comments/replies', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    postContent: "Your post content...",
    comment: "Great insights! I've been thinking about this too.",
    commenterProfile: "John Smith, CEO at TechCorp"
  })
});

const { replies } = await response.json();
// Returns 3-5 reply options
```

### 4. Generate Daily Priorities

**API Call:**
```typescript
const response = await fetch('/api/ai/priorities/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({})
});

const { priorities } = await response.json();
// Returns top 3 priorities with reasoning and action steps
```

### 5. Score Leads with AI

**API Call:**
```typescript
const response = await fetch('/api/ai/leads/score', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    leadId: "lead-uuid-here"
  })
});

const { score } = await response.json();
// Returns score (0-100), category, and recommendations
```

### 6. Analyze Content Performance

**API Call:**
```typescript
const response = await fetch('/api/ai/insights/analyze', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    timeframe: "30" // days
  })
});

const { analysis } = await response.json();
// Returns performance patterns and recommendations
```

---

## 💰 Cost Estimates

### Claude 3.5 Sonnet Pricing (Current)
- Input: $3.00 per 1M tokens
- Output: $15.00 per 1M tokens

### Estimated Monthly Usage

| Feature | Frequency | Tokens/Month | Cost/Month |
|---------|-----------|--------------|------------|
| Content Generation | 50 posts × 500 tokens | 25K input + 19K output | ~$0.37 |
| Post Improvements | 20 posts × 400 tokens | 8K input + 6K output | ~$0.11 |
| Comment Replies | 200 comments × 200 tokens | 40K input + 30K output | ~$0.59 |
| Priority Generation | 30 days × 300 tokens | 9K input + 7K output | ~$0.13 |
| Lead Scoring | 100 leads × 200 tokens | 20K input + 15K output | ~$0.29 |
| Insights Analysis | 4 weeks × 1000 tokens | 4K input + 3K output | ~$0.05 |

**Total Estimated Cost: ~$1.54/month**

### Cost Optimization Tips
1. Use Claude 3 Haiku for simple tasks (75% cheaper)
2. Implement response caching
3. Batch similar requests
4. Set max tokens appropriately

---

## 🎯 Expected Efficiency Gains

| Task | Before | After | Time Saved |
|------|--------|-------|------------|
| Write LinkedIn Post | 30-45 min | 2-3 min | **27-43 min** |
| Improve Post | 10-15 min | 1-2 min | **8-13 min** |
| Write Comment Reply | 2-3 min | 30 sec | **1.5-2.5 min** |
| Decide Daily Priorities | 15-20 min | 2-3 min | **12-17 min** |
| Score Lead | 5-10 min | 1 min | **4-9 min** |
| Analyze Performance | 30-60 min | 5 min | **25-55 min** |

**Total Daily Time Saved: 78-140 minutes (1.3-2.3 hours)**

---

## 🛠️ Advanced Usage

### Custom Prompts

You can create custom prompts in the prompt templates:

```typescript
import { callClaudeWithSystem } from '@/lib/ai';

const response = await callClaudeWithSystem(
  'You are an expert in your specific domain',
  'Your custom prompt here',
  {
    model: 'claude-3-5-sonnet-20241022',
    maxTokens: 1024,
    temperature: 0.7
  }
);
```

### Streaming Responses

For real-time feedback:

```typescript
import { streamClaude } from '@/lib/ai';

for await (const chunk of streamClaude('Your prompt')) {
  console.log(chunk); // Stream each token
}
```

### Batch Processing

Process multiple items efficiently:

```typescript
import { batchCallClaude } from '@/lib/ai';

const results = await batchCallClaude([
  { prompt: 'Idea 1' },
  { prompt: 'Idea 2' },
  { prompt: 'Idea 3' }
], 3); // Concurrency of 3
```

---

## 📊 Monitoring & Analytics

### View AI Usage

```sql
SELECT 
  feature,
  COUNT(*) as total_calls,
  SUM(total_tokens) as total_tokens,
  SUM(cost) as total_cost
FROM ai_usage_logs
WHERE user_id = 'your-user-id'
  AND created_at >= NOW() - INTERVAL '30 days'
GROUP BY feature;
```

### Daily Usage Trend

```sql
SELECT 
  DATE(created_at) as date,
  SUM(total_tokens) as tokens,
  SUM(cost) as cost
FROM ai_usage_logs
WHERE user_id = 'your-user-id'
  AND created_at >= NOW() - INTERVAL '7 days'
GROUP BY DATE(created_at)
ORDER BY date DESC;
```

---

## 🔐 Security & Privacy

- All AI calls require authentication
- User data is isolated per user
- AI usage is logged and tracked
- API keys are server-side only
- RLS policies protect data

---

## 🚨 Troubleshooting

### Issue: "Invalid API Key"
**Solution:** Verify `ANTHROPIC_API_KEY` in `.env.local` is correct

### Issue: "Rate limit exceeded"
**Solution:** You've hit Anthropic's rate limits. Wait or upgrade your plan.

### Issue: "Context window exceeded"
**Solution:** Reduce input size or increase `maxTokens` parameter

### Issue: "Malformed JSON response"
**Solution:** The AI response couldn't be parsed. Check logs for details.

---

## 📚 Next Steps

1. **Add UI Components** - Integrate AI features into the dashboard
2. **Create AI Settings Page** - Let users configure preferences
3. **Add AI Features to Sidebar** - Quick access to AI tools
4. **Implement AI Usage Dashboard** - View costs and usage
5. **Add Voice Command Integration** - Optional voice interface

---

## 🎉 Summary

FounderOS now has **full Claude AI integration** with:
- ✅ 5 AI services for content, comments, priorities, leads, and insights
- ✅ 6 API endpoints for easy integration
- ✅ Complete cost tracking and monitoring
- ✅ User personalization and context awareness
- ✅ Estimated **$1.54/month** for active usage
- **Expected to save 1.3-2.3 hours daily**

All infrastructure is in place. Just add your Claude API key and start using AI features!

**Status: READY TO USE 🚀**