-- FOUNDER OPERATING SYSTEM - Complete Schema

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- TABLES
-- ============================================================

-- Users table (linked to Supabase Auth)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ideas table
CREATE TABLE IF NOT EXISTS public.ideas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  raw_text TEXT NOT NULL,
  pillar TEXT NOT NULL,
  tone TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Drafts table
CREATE TABLE IF NOT EXISTS public.drafts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  idea_id UUID REFERENCES public.ideas(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  hook TEXT,
  cta TEXT,
  tone TEXT,
  pillar TEXT,
  status TEXT NOT NULL DEFAULT 'rough_draft',
  authenticity_score INTEGER,
  clarity_score INTEGER,
  engagement_potential INTEGER,
  risk_level INTEGER,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Draft versions table
CREATE TABLE IF NOT EXISTS public.draft_versions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  draft_id UUID NOT NULL REFERENCES public.drafts(id) ON DELETE CASCADE,
  version_label TEXT NOT NULL,
  content TEXT NOT NULL,
  hook TEXT,
  cta TEXT,
  transformation_type TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Scheduled posts table
CREATE TABLE IF NOT EXISTS public.scheduled_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  draft_id UUID NOT NULL REFERENCES public.drafts(id) ON DELETE CASCADE,
  scheduled_for TIMESTAMP WITH TIME ZONE,
  calendar_status TEXT NOT NULL DEFAULT 'planned',
  linkedin_url TEXT,
  posted BOOLEAN DEFAULT FALSE,
  skipped BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Published posts table
CREATE TABLE IF NOT EXISTS public.published_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  draft_id UUID REFERENCES public.drafts(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  post_text TEXT NOT NULL,
  pillar TEXT,
  tone TEXT,
  hook_type TEXT,
  cta_type TEXT,
  linkedin_url TEXT,
  posted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Post comments table
CREATE TABLE IF NOT EXISTS public.post_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  published_post_id UUID NOT NULL REFERENCES public.published_posts(id) ON DELETE CASCADE,
  commenter_name TEXT NOT NULL,
  commenter_profile_url TEXT,
  comment_text TEXT NOT NULL,
  is_high_value BOOLEAN DEFAULT FALSE,
  is_lead BOOLEAN DEFAULT FALSE,
  reply_status TEXT DEFAULT 'pending',
  reply_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Performance metrics table
CREATE TABLE IF NOT EXISTS public.performance_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  published_post_id UUID NOT NULL REFERENCES public.published_posts(id) ON DELETE CASCADE,
  impressions INTEGER NOT NULL DEFAULT 0,
  likes INTEGER NOT NULL DEFAULT 0,
  comments INTEGER NOT NULL DEFAULT 0,
  reposts INTEGER NOT NULL DEFAULT 0,
  entered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contacts table (Revenue Pipeline)
CREATE TABLE IF NOT EXISTS public.contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  company TEXT,
  type TEXT NOT NULL DEFAULT 'prospect',
  opportunity_type TEXT,
  stage TEXT NOT NULL DEFAULT 'discovery',
  notes TEXT,
  last_contact TIMESTAMP WITH TIME ZONE,
  next_follow_up TIMESTAMP WITH TIME ZONE,
  is_warm BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tasks table (Execution Engine)
CREATE TABLE IF NOT EXISTS public.tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE,
  due_date TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Daily logs table
CREATE TABLE IF NOT EXISTS public.daily_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  shipped BOOLEAN DEFAULT FALSE,
  what_moved_needle TEXT,
  what_didnt TEXT,
  warnings TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- Voice profiles table
CREATE TABLE IF NOT EXISTS public.voice_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  profile_name TEXT NOT NULL,
  description TEXT NOT NULL,
  liked_phrases TEXT[] DEFAULT '{}',
  banned_phrases TEXT[] DEFAULT '{}',
  preferred_cta_style TEXT NOT NULL,
  intensity_level TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Prompt templates table
CREATE TABLE IF NOT EXISTS public.prompt_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  prompt_text TEXT NOT NULL,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activity logs table
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  action TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- INDEXES
-- ============================================================

-- Ideas indexes
CREATE INDEX IF NOT EXISTS idx_ideas_user_id ON public.ideas(user_id);
CREATE INDEX IF NOT EXISTS idx_ideas_status ON public.ideas(status);
CREATE INDEX IF NOT EXISTS idx_ideas_created_at ON public.ideas(created_at DESC);

-- Drafts indexes
CREATE INDEX IF NOT EXISTS idx_drafts_user_id ON public.drafts(user_id);
CREATE INDEX IF NOT EXISTS idx_drafts_status ON public.drafts(status);
CREATE INDEX IF NOT EXISTS idx_drafts_idea_id ON public.drafts(idea_id);

-- Tasks indexes
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON public.tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON public.tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_tasks_completed ON public.tasks(completed);

-- Contacts indexes
CREATE INDEX IF NOT EXISTS idx_contacts_user_id ON public.contacts(user_id);
CREATE INDEX IF NOT EXISTS idx_contacts_stage ON public.contacts(stage);
CREATE INDEX IF NOT EXISTS idx_contacts_is_warm ON public.contacts(is_warm);
CREATE INDEX IF NOT EXISTS idx_contacts_next_follow_up ON public.contacts(next_follow_up);

-- Daily logs indexes
CREATE INDEX IF NOT EXISTS idx_daily_logs_user_id ON public.daily_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_logs_date ON public.daily_logs(date DESC);

-- Performance metrics indexes
CREATE INDEX IF NOT EXISTS idx_performance_metrics_post_id ON public.performance_metrics(published_post_id);

-- Activity logs indexes
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON public.activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_entity ON public.activity_logs(entity_type, entity_id);

-- ============================================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.drafts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.draft_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scheduled_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.published_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.performance_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.voice_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view own profile"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

-- Ideas policies
CREATE POLICY "Users can view own ideas"
  ON public.ideas FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own ideas"
  ON public.ideas FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own ideas"
  ON public.ideas FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own ideas"
  ON public.ideas FOR DELETE
  USING (auth.uid() = user_id);

-- Drafts policies
CREATE POLICY "Users can view own drafts"
  ON public.drafts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own drafts"
  ON public.drafts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own drafts"
  ON public.drafts FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own drafts"
  ON public.drafts FOR DELETE
  USING (auth.uid() = user_id);

-- Tasks policies
CREATE POLICY "Users can view own tasks"
  ON public.tasks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own tasks"
  ON public.tasks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tasks"
  ON public.tasks FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own tasks"
  ON public.tasks FOR DELETE
  USING (auth.uid() = user_id);

-- Contacts policies
CREATE POLICY "Users can view own contacts"
  ON public.contacts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own contacts"
  ON public.contacts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own contacts"
  ON public.contacts FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own contacts"
  ON public.contacts FOR DELETE
  USING (auth.uid() = user_id);

-- Daily logs policies
CREATE POLICY "Users can view own logs"
  ON public.daily_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own logs"
  ON public.daily_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own logs"
  ON public.daily_log FOR UPDATE
  USING (auth.uid() = user_id);

-- Draft versions policies
CREATE POLICY "Users can view own draft versions"
  ON public.draft_versions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.drafts
      WHERE drafts.id = draft_versions.draft_id AND drafts.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create own draft versions"
  ON public.draft_versions FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.drafts
      WHERE drafts.id = draft_versions.draft_id AND drafts.user_id = auth.uid()
    )
  );

-- Scheduled posts policies
CREATE POLICY "Users can view own scheduled posts"
  ON public.scheduled_posts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own scheduled posts"
  ON public.scheduled_posts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own scheduled posts"
  ON public.scheduled_posts FOR UPDATE
  USING (auth.uid() = user_id);

-- Published posts policies
CREATE POLICY "Users can view own published posts"
  ON public.published_posts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own published posts"
  ON public.published_posts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Post comments policies
CREATE POLICY "Users can view own post comments"
  ON public.post_comments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.published_posts
      WHERE published_posts.id = post_comments.published_post_id AND published_posts.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create own post comments"
  ON public.post_comments FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.published_posts
      WHERE published_posts.id = post_comments.published_post_id AND published_posts.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own post comments"
  ON public.post_comments FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.published_posts
      WHERE published_posts.id = post_comments.published_post_id AND published_posts.user_id = auth.uid()
    )
  );

-- Performance metrics policies
CREATE POLICY "Users can view own performance metrics"
  ON public.performance_metrics FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.published_posts
      WHERE published_posts.id = performance_metrics.published_post_id AND published_posts.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create own performance metrics"
  ON public.performance_metrics FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.published_posts
      WHERE published_posts.id = performance_metrics.published_post_id AND published_posts.user_id = auth.uid()
    )
  );

-- Voice profiles policies
CREATE POLICY "Users can view own voice profiles"
  ON public.voice_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own voice profiles"
  ON public.voice_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own voice profiles"
  ON public.voice_profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- Activity logs policies
CREATE POLICY "Users can view own activity logs"
  ON public.activity_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own activity logs"
  ON public.activity_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- TRIGGERS
-- ============================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_ideas_updated_at
  BEFORE UPDATE ON public.ideas
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_drafts_updated_at
  BEFORE UPDATE ON public.drafts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_scheduled_posts_updated_at
  BEFORE UPDATE ON public.scheduled_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contacts_updated_at
  BEFORE UPDATE ON public.contacts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_voice_profiles_updated_at
  BEFORE UPDATE ON public.voice_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_prompt_templates_updated_at
  BEFORE UPDATE ON public.prompt_templates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to insert user record on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create user record on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- INITIAL DATA
-- ============================================================

-- Insert default prompt templates
INSERT INTO public.prompt_templates (name, category, prompt_text) VALUES
(
  'Generate Draft',
  'draft_generation',
  'Generate 3 versions of a LinkedIn post based on this idea. Each version should be distinct in tone and angle. Return JSON with versions array containing label, hook, body, and cta.'
),
(
  'Make Sharper',
  'rewrite_stronger',
  'Rewrite this post to be sharper and more impactful. Make the opening stronger, remove fluff, and ensure every sentence pulls its weight.'
),
(
  'Make Safer',
  'rewrite_safer',
  'Rewrite this post to reduce risk while maintaining authenticity. Avoid controversial statements, soften absolute claims, and focus on shared values.'
),
(
  'Make More Human',
  'rewrite_human',
  'Rewrite this post to sound less like AI. Remove AI patterns, add natural transitions, use conversational language, and avoid over-structuring.'
),
(
  'Improve Hook',
  'rewrite_voice',
  'Generate 5 strong opening hooks for this post. Hooks should be provocative, surprising, or counterintuitive. Return as JSON array.'
),
(
  'Improve CTA',
  'cta_generation',
  'Generate 5 curiosity-driven call-to-actions for this post. CTAs should feel natural, non-salesy, and invite genuine engagement. Return as JSON array.'
),
(
  'Comment Suggestions',
  'comment_suggestions',
  'Based on this LinkedIn post, generate 5 comment suggestions: 2 blunt, 2 curious, 1 relationship-building. Each comment should add value and not be generic. Return as JSON with type and text.'
),
(
  'Engagement Analysis',
  'engagement_analysis',
  'Analyze this LinkedIn post and engagement. Should I engage? Yes/No/Low priority. Recommend action: like/comment/skip/follow. Generate 3-5 comment suggestions with reasoning. Should I follow this person? Is this a potential lead?'
),
(
  'Daily Insights',
  'insights',
  'Based on this week''s activity: posts created, tasks completed, revenue pipeline changes, engagement metrics. Generate insights: what worked, what didn''t, wasted effort, next priorities. Be direct and actionable.'
),
(
  'Follow-up Message',
  'follow_up_message',
  'Generate a personalized follow-up message for this contact. Include context from our previous interaction. Keep it brief, valuable, and action-oriented. No fluff.'
)
ON CONFLICT (name) DO NOTHING;