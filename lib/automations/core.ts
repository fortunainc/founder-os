import { Automation, AutomationRun, AutomationLog, Notification } from '@/types/automations';
import { createClient } from '@/lib/supabase/server';

export class AutomationEngine {
  private supabase = createClient();

  async runAutomation(automationId: string): Promise<AutomationRun> {
    const automation = await this.getAutomation(automationId);
    if (!automation) {
      throw new Error(`Automation ${automationId} not found`);
    }

    if (!automation.enabled) {
      throw new Error(`Automation ${automationId} is disabled`);
    }

    // Create automation run record
    const run = await this.createAutomationRun(automationId);
    
    try {
      // Log start
      await this.log(run.id, 'info', `Starting automation: ${automation.name}`);

      // Execute the automation
      const outputs = await this.executeAutomation(automation, run.id);

      // Update run as completed
      await this.completeAutomationRun(run.id, outputs, null);

      // Send notifications if enabled
      if (automation.config.notify_on_complete) {
        await this.sendNotification(
          'automation',
          `${automation.name} Completed`,
          `Successfully processed ${outputs.length} items`,
          '/dashboard'
        );
      }

      return run;
    } catch (error) {
      // Update run as failed
      await this.failAutomationRun(run.id, error instanceof Error ? error.message : 'Unknown error');
      
      // Log error
      await this.log(run.id, 'error', `Automation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      
      throw error;
    }
  }

  private async executeAutomation(automation: Automation, runId: string) {
    const { name } = automation;
    
    switch (name) {
      case 'Daily Priority Generator':
        return await this.runDailyPriorityGenerator(runId);
      case 'Stale Lead Follow-up':
        return await this.runStaleLeadFollowup(runId, automation.config.threshold_days || 3);
      case 'Idea Processing':
        return await this.runIdeaProcessing(runId);
      case 'Approved Draft Scheduling':
        return await this.runApprovedDraftScheduling(runId);
      case 'Comment Reply Generator':
        return await this.runCommentReplyGenerator(runId);
      case 'High-Performing Content Follow-up':
        return await this.runHighPerformingContentFollowup(runId);
      case 'End-of-Day Check-in':
        return await this.runEndOfDayCheckin(runId);
      case 'Weekly CEO Brief':
        return await this.runWeeklyCEOBrief(runId);
      default:
        throw new Error(`Unknown automation: ${name}`);
    }
  }

  // Individual Automation Methods
  private async runDailyPriorityGenerator(runId: string) {
    const supabase = await this.supabase;
    const { data: tasks } = await supabase
      .from('tasks')
      .select('*')
      .eq('completed', false)
      .order('due_date', { ascending: true })
      .limit(10);

    const { data: contacts } = await supabase
      .from('contacts')
      .select('*')
      .gte('last_contact', new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString());

    // AI-powered priority generation would go here
    // For now, we'll use simple logic
    const priorities = [
      {
        type: 'task' as const,
        destination: 'today',
        data: {
          title: 'Review urgent tasks',
          reason: `${tasks?.length || 0} tasks pending completion`,
        },
      },
    ];

    return priorities;
  }

  private async runStaleLeadFollowup(runId: string, thresholdDays: number) {
    const supabase = await this.supabase;
    const thresholdDate = new Date(Date.now() - thresholdDays * 24 * 60 * 60 * 1000);
    
    const { data: staleLeads } = await supabase
      .from('contacts')
      .select('*')
      .lt('last_contact', thresholdDate.toISOString())
      .eq('stage', 'discovery');

    const outputs = [];
    
    for (const lead of staleLeads || []) {
      outputs.push({
        type: 'task' as const,
        destination: 'today',
        data: {
          title: `Follow up with ${lead.name}`,
          description: `No activity for ${thresholdDays} days`,
          lead_id: lead.id,
        },
      });
    }

    return outputs;
  }

  private async runIdeaProcessing(runId: string) {
    const supabase = await this.supabase;
    // Get recent unprocessed ideas
    const { data: ideas } = await supabase
      .from('ideas')
      .select('*')
      .eq('status', 'new')
      .limit(5);

    const outputs = [];

    for (const idea of ideas || []) {
      // AI processing would go here
      outputs.push({
        type: 'draft' as const,
        destination: 'content',
        data: {
          title: `Draft from idea: ${idea.raw_text.substring(0, 50)}...`,
          content: idea.raw_text,
          source_idea_id: idea.id,
        },
      });

      // Mark as processed
      await supabase
        .from('ideas')
        .update({ status: 'drafted' })
        .eq('id', idea.id);
    }

    return outputs;
  }

  private async runApprovedDraftScheduling(runId: string) {
    const supabase = await this.supabase;
    const { data: drafts } = await supabase
      .from('drafts')
      .select('*')
      .eq('status', 'approved')
      .is('scheduled_for', null);

    const outputs = [];

    for (const draft of drafts || []) {
      // Suggest next available slot
      const nextSlot = new Date();
      nextSlot.setDate(nextSlot.getDate() + 1);
      nextSlot.setHours(10, 0, 0, 0);

      outputs.push({
        type: 'recommendation' as const,
        destination: 'content',
        data: {
          draft_id: draft.id,
          suggested_date: nextSlot.toISOString(),
          message: `Schedule "${draft.title}" for ${nextSlot.toLocaleDateString()}`,
        },
      });
    }

    return outputs;
  }

  private async runCommentReplyGenerator(runId: string) {
    const supabase = await this.supabase;
    // Get recent comments on published posts
    const { data: comments } = await supabase
      .from('post_comments')
      .select('*')
      .eq('reply_status', 'pending')
      .limit(10);

    const outputs = [];

    for (const comment of comments || []) {
      // Get post title separately
      const { data: post } = await supabase
        .from('published_posts')
        .select('title')
        .eq('id', comment.published_post_id)
        .single();

      // Generate reply options using AI
      const replyOptions = [
        `Thanks for sharing your thoughts, ${comment.commenter_name}!`,
        `Great perspective. I'd love to hear more about your experience.`,
        `This is really insightful. Thanks for taking the time to comment.`,
      ];

      outputs.push({
        type: 'recommendation' as const,
        destination: 'notifications',
        data: {
          comment_id: comment.id,
          post_id: comment.published_post_id,
          reply_options: replyOptions,
          message: `New comment on "${post?.title || 'your post'}" - generate reply`,
        },
      });
    }

    return outputs;
  }

  private async runHighPerformingContentFollowup(runId: string) {
    const supabase = await this.supabase;
    // Get high-performing posts from last week
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    
    const { data: posts } = await supabase
      .from('published_posts')
      .select('*')
      .gte('posted_at', weekAgo.toISOString())
      .order('created_at', { ascending: false });

    const outputs = [];

    for (const post of posts || []) {
      outputs.push({
        type: 'draft' as const,
        destination: 'content',
        data: {
          title: `Follow-up to: ${post.title}`,
          content: `Building on the success of "${post.title}"...`,
          source_post_id: post.id,
        },
      });
    }

    return outputs;
  }

  private async runEndOfDayCheckin(runId: string) {
    const supabase = await this.supabase;
    const today = new Date().toISOString().split('T')[0];
    
    const { data: tasks } = await supabase
      .from('tasks')
      .select('*')
      .eq('due_date', today);

    const { data: dailyLog } = await supabase
      .from('daily_logs')
      .select('*')
      .eq('date', today)
      .single();

    const completed = tasks?.filter(t => t.completed).length || 0;
    const incomplete = tasks?.filter(t => !t.completed).length || 0;

    // Only create check-in if not already done today
    if (!dailyLog) {
      return [{
        type: 'notification' as const,
        destination: 'notifications',
        data: {
          title: 'End of Day Check-in',
          message: `Today you completed ${completed} tasks. ${incomplete} tasks roll over to tomorrow.`,
        },
      }];
    }

    return [];
  }

  private async runWeeklyCEOBrief(runId: string) {
    const supabase = await this.supabase;
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    
    const [{ data: posts }, { data: tasks }, { data: contacts }] = await Promise.all([
      supabase.from('published_posts').select('*').gte('posted_at', weekAgo.toISOString()),
      supabase.from('tasks').select('*').gte('completed_at', weekAgo.toISOString()),
      supabase.from('contacts').select('*').gte('created_at', weekAgo.toISOString()),
    ]);

    return [{
      type: 'insight' as const,
      destination: 'dashboard',
      data: {
        title: 'Weekly CEO Brief',
        summary: {
          posts_published: posts?.length || 0,
          tasks_completed: tasks?.length || 0,
          new_leads: contacts?.length || 0,
        },
      },
    }];
  }

  // Database Helper Methods
  private async getAutomation(id: string): Promise<Automation | null> {
    const supabase = await this.supabase;
    const { data } = await supabase
      .from('automations')
      .select('*')
      .eq('id', id)
      .single();
    
    if (!data) return null;
    
    // Type assertion to match our Automation interface
    return {
      ...data,
      status: data.status as 'active' | 'paused' | 'error',
      config: data.config as any,
    };
  }

  private async createAutomationRun(automationId: string): Promise<AutomationRun> {
    const supabase = await this.supabase;
    const { data } = await supabase
      .from('automation_runs')
      .insert({
        automation_id: automationId,
        status: 'running',
        started_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (!data) {
      throw new Error('Failed to create automation run');
    }
    
    // Type assertion to match our AutomationRun interface
    return {
      ...data,
      status: data.status as 'running' | 'completed' | 'failed' | 'cancelled',
      outputs: data.outputs as any[],
    };
  }

  private async completeAutomationRun(
    runId: string,
    outputs: any[],
    resultSummary: string | null
  ) {
    const supabase = await this.supabase;
    await supabase
      .from('automation_runs')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
        outputs,
        result_summary: resultSummary,
      })
      .eq('id', runId);
  }

  private async failAutomationRun(runId: string, errorMessage: string) {
    const supabase = await this.supabase;
    await supabase
      .from('automation_runs')
      .update({
        status: 'failed',
        completed_at: new Date().toISOString(),
        errors: [errorMessage],
      })
      .eq('id', runId);
  }

  private async log(runId: string, level: 'info' | 'warning' | 'error', message: string, metadata?: Record<string, any>) {
    const supabase = await this.supabase;
    await supabase
      .from('automation_logs')
      .insert({
        automation_run_id: runId,
        level,
        message,
        metadata: metadata || null,
        created_at: new Date().toISOString(),
      });
  }

  private async sendNotification(type: string, title: string, message: string, actionUrl: string | null) {
    const supabase = await this.supabase;
    await supabase
      .from('notifications')
      .insert({
        type: type as any,
        title,
        message,
        read: false,
        action_url: actionUrl,
        created_at: new Date().toISOString(),
      });
  }
}

export const automationEngine = new AutomationEngine();