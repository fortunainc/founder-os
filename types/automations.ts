// Automation Types
export interface Automation {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  schedule: string; // cron expression
  last_run: string | null;
  next_run: string | null;
  status: 'active' | 'paused' | 'error';
  config: AutomationConfig;
  created_at: string;
  updated_at: string;
}

export interface AutomationConfig {
  threshold_days?: number;
  output_destination: 'dashboard' | 'today' | 'content' | 'revenue' | 'notifications';
  require_approval: boolean;
  notify_on_complete: boolean;
}

export interface AutomationRun {
  id: string;
  automation_id: string;
  status: 'running' | 'completed' | 'failed' | 'cancelled';
  started_at: string;
  completed_at: string | null;
  outputs: AutomationOutput[];
  errors: string[];
  result_summary: string | null;
}

export interface AutomationOutput {
  type: 'task' | 'notification' | 'draft' | 'insight' | 'recommendation';
  destination: string;
  data: Record<string, any>;
  created_at: string;
}

export interface AutomationLog {
  id: string;
  automation_run_id: string;
  level: 'info' | 'warning' | 'error';
  message: string;
  metadata: Record<string, any> | null;
  created_at: string;
}

export interface Notification {
  id: string;
  type: 'automation' | 'task' | 'insight' | 'alert';
  title: string;
  message: string;
  read: boolean;
  action_url: string | null;
  created_at: string;
}

// Automation-Specific Types
export interface DailyPriority {
  task_id: string;
  title: string;
  reason: string;
  priority: number;
}

export interface StaleLeadAlert {
  lead_id: string;
  lead_name: string;
  days_inactive: number;
  suggested_task: string;
  suggested_message: string;
}

export interface IdeaProcessingResult {
  idea_id: string;
  pillar: string;
  tone: string;
  angles: string[];
  draft_variants: string[];
}

export interface ContentPerformance {
  post_id: string;
  topic: string;
  performance_score: number;
  follow_up_suggestions: string[];
}