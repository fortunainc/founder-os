import { NextRequest, NextResponse } from 'next/server';
import { automationEngine } from '@/lib/automations/core';
import { automationScheduler } from '@/lib/automations/scheduler';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createClient();
  
  const { data: automations } = await supabase
    .from('automations')
    .select('*')
    .order('name');

  return NextResponse.json({ automations });
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const body = await request.json();
  const { action, automationId } = body;

  try {
    switch (action) {
      case 'run':
        await automationScheduler.runNow(automationId);
        return NextResponse.json({ success: true, message: 'Automation started' });

      case 'toggle':
        const { data: automation } = await supabase
          .from('automations')
          .select('*')
          .eq('id', automationId)
          .single();

        if (automation) {
          const updatedEnabled = !automation.enabled;
          await supabase
            .from('automations')
            .update({ enabled: updatedEnabled })
            .eq('id', automationId);

          if (updatedEnabled) {
            await automationScheduler.scheduleAutomation(automation);
          } else {
            automationScheduler.unscheduleAutomation(automationId);
          }

          return NextResponse.json({ 
            success: true, 
            enabled: updatedEnabled,
            message: `Automation ${updatedEnabled ? 'enabled' : 'disabled'}` 
          });
        }
        break;

      case 'update_config':
        const { config } = body;
        await supabase
          .from('automations')
          .update({ config })
          .eq('id', automationId);

        return NextResponse.json({ success: true, message: 'Config updated' });

      default:
        return NextResponse.json({ success: false, message: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      message: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}