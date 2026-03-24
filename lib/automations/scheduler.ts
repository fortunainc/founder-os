import cron from 'node-cron';
import { automationEngine } from './core';
import { createClient } from '@/lib/supabase/server';

class AutomationScheduler {
  private tasks: Map<string, cron.ScheduledTask> = new Map();
  private supabase = createClient();

  async initialize() {
    console.log('Initializing automation scheduler...');
    
    // Load all enabled automations from database
    const supabase = await this.supabase;
    const { data: automations } = await supabase
      .from('automations')
      .select('*')
      .eq('enabled', true);

    if (automations) {
      for (const automation of automations) {
        await this.scheduleAutomation(automation);
      }
    }

    console.log(`Scheduled ${this.tasks.size} automations`);
  }

  async scheduleAutomation(automation: any) {
    // Remove existing task if it exists
    this.unscheduleAutomation(automation.id);

    // Validate cron expression
    if (!cron.validate(automation.schedule)) {
      console.error(`Invalid cron expression for ${automation.name}: ${automation.schedule}`);
      return;
    }

    // Schedule the automation
    const task = cron.schedule(automation.schedule, async () => {
      console.log(`Running automation: ${automation.name}`);
      try {
        await automationEngine.runAutomation(automation.id);
        
        // Update last_run and next_run
        await this.updateAutomationRunTimes(automation.id);
      } catch (error) {
        console.error(`Error running automation ${automation.name}:`, error);
      }
    }, {
      scheduled: true,
      timezone: 'America/New_York',
    });

    this.tasks.set(automation.id, task);
    console.log(`Scheduled automation: ${automation.name} (${automation.schedule})`);
  }

  unscheduleAutomation(automationId: string) {
    const task = this.tasks.get(automationId);
    if (task) {
      task.stop();
      this.tasks.delete(automationId);
      console.log(`Unscheduled automation: ${automationId}`);
    }
  }

  async updateAutomationRunTimes(automationId: string) {
    const now = new Date();
    const supabase = await this.supabase;
    
    // Calculate next run time based on cron expression
    const { data: automation } = await supabase
      .from('automations')
      .select('schedule')
      .eq('id', automationId)
      .single();

    if (automation) {
      // Simple next run calculation (would need cron parser for accuracy)
      const nextRun = new Date(now.getTime() + 24 * 60 * 60 * 1000); // Default to 24 hours

      await supabase
        .from('automations')
        .update({
          last_run: now.toISOString(),
          next_run: nextRun.toISOString(),
        })
        .eq('id', automationId);
    }
  }

  async runNow(automationId: string) {
    console.log(`Running automation immediately: ${automationId}`);
    try {
      await automationEngine.runAutomation(automationId);
      await this.updateAutomationRunTimes(automationId);
    } catch (error) {
      console.error(`Error running automation ${automationId}:`, error);
      throw error;
    }
  }

  getScheduledTasks(): string[] {
    return Array.from(this.tasks.keys());
  }

  stop() {
    console.log('Stopping all automation tasks...');
    this.tasks.forEach((task) => task.stop());
    this.tasks.clear();
  }
}

export const automationScheduler = new AutomationScheduler();