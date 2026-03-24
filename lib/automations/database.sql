-- Automations table
CREATE TABLE IF NOT EXISTS automations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  enabled BOOLEAN DEFAULT true,
  schedule TEXT NOT NULL, -- cron expression
  last_run TIMESTAMP WITH TIME ZONE,
  next_run TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'paused' CHECK (status IN ('active', 'paused', 'error')),
  config JSONB DEFAULT '{
    "threshold_days": 3,
    "output_destination": "dashboard",
    "require_approval": true,
    "notify_on_complete": true
  }'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Automation runs table
CREATE TABLE IF NOT EXISTS automation_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  automation_id UUID NOT NULL REFERENCES automations(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'running' CHECK (status IN ('running', 'completed', 'failed', 'cancelled')),
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  outputs JSONB DEFAULT '[]'::jsonb,
  errors TEXT[] DEFAULT ARRAY[]::TEXT[],
  result_summary TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Automation logs table
CREATE TABLE IF NOT EXISTS automation_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  automation_run_id UUID NOT NULL REFERENCES automation_runs(id) ON DELETE CASCADE,
  level TEXT CHECK (level IN ('info', 'warning', 'error')),
  message TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT CHECK (type IN ('automation', 'task', 'insight', 'alert')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  action_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- System generated tasks table
CREATE TABLE IF NOT EXISTS system_generated_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  automation_run_id UUID REFERENCES automation_runs(id) ON DELETE SET NULL,
  type TEXT CHECK (type IN ('content', 'build', 'revenue')),
  title TEXT NOT NULL,
  description TEXT,
  due_date DATE,
  priority INTEGER DEFAULT 5,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ideas table (if not exists)
CREATE TABLE IF NOT EXISTS ideas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  pillar TEXT,
  tone TEXT,
  processed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Content drafts table (if not exists)
CREATE TABLE IF NOT EXISTS content_drafts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'approved', 'scheduled', 'published')),
  scheduled_date TIMESTAMP WITH TIME ZONE,
  published_at TIMESTAMP WITH TIME ZONE,
  source_idea_id UUID REFERENCES ideas(id),
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Posts table (if not exists)
CREATE TABLE IF NOT EXISTS posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  engagement_rate DECIMAL(5,2),
  metrics JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Comments table (if not exists)
CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  author_email TEXT,
  content TEXT NOT NULL,
  replied BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Leads table (if not exists)
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT,
  company TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'converted', 'lost')),
  last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tasks table (if not exists)
CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT CHECK (type IN ('content', 'build', 'revenue')),
  title TEXT NOT NULL,
  description TEXT,
  completed BOOLEAN DEFAULT false,
  due_date DATE,
  completed_at TIMESTAMP WITH TIME ZONE,
  priority INTEGER DEFAULT 5,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_automations_enabled ON automations(enabled);
CREATE INDEX IF NOT EXISTS idx_automations_status ON automations(status);
CREATE INDEX IF NOT EXISTS idx_automation_runs_automation_id ON automation_runs(automation_id);
CREATE INDEX IF NOT EXISTS idx_automation_runs_status ON automation_runs(status);
CREATE INDEX IF NOT EXISTS idx_automation_runs_started_at ON automation_runs(started_at);
CREATE INDEX IF NOT EXISTS idx_automation_logs_run_id ON automation_logs(automation_run_id);
CREATE INDEX IF NOT EXISTS idx_automation_logs_level ON automation_logs(level);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);
CREATE INDEX IF NOT EXISTS idx_ideas_processed ON ideas(processed);
CREATE INDEX IF NOT EXISTS idx_content_drafts_status ON content_drafts(status);
CREATE INDEX IF NOT EXISTS idx_comments_replied ON comments(replied);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_last_activity ON leads(last_activity);
CREATE INDEX IF NOT EXISTS idx_tasks_completed ON tasks(completed);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date);

-- Insert default automations
INSERT INTO automations (name, description, schedule, status) VALUES
  ('Daily Priority Generator', 'Generates top 3 priorities for the day based on unfinished tasks, stale leads, and unscheduled drafts', '0 8 * * *', 'active'),
  ('Stale Lead Follow-up', 'Creates follow-up tasks for leads with no activity for 3+ days', '0 9 * * *', 'active'),
  ('Idea Processing', 'Auto-classifies new ideas, generates post angles and draft variants', '*/30 * * * *', 'active'),
  ('Approved Draft Scheduling', 'Suggests publishing slots for approved but unscheduled drafts', '0 10 * * *', 'active'),
  ('Comment Reply Generator', 'Generates reply options for new comments on published posts', '*/15 * * * *', 'active'),
  ('High-Performing Content Follow-up', 'Detects high-performing content and suggests follow-up posts', '0 11 * * *', 'active'),
  ('End-of-Day Check-in', 'Summarizes completed tasks and suggests what rolls over to tomorrow', '0 18 * * *', 'active'),
  ('Weekly CEO Brief', 'Generates weekly summary of content, tasks, pipeline, and priorities', '0 8 * * 1', 'active')
ON CONFLICT (name) DO NOTHING;