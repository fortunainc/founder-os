'use client';

import { useEffect, useState } from 'react';
import { 
  Clock, 
  Play, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  Settings,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useToastStore } from '@/lib/store';

interface Automation {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  schedule: string;
  last_run: string | null;
  next_run: string | null;
  status: 'active' | 'paused' | 'error';
  config: {
    threshold_days?: number;
    output_destination: string;
    require_approval: boolean;
    notify_on_complete: boolean;
  };
}

interface AutomationRun {
  id: string;
  automation_id: string;
  status: 'running' | 'completed' | 'failed';
  started_at: string;
  completed_at: string | null;
  outputs: any[];
  errors: string[];
}

export default function AutomationsPage() {
  const [automations, setAutomations] = useState<Automation[]>([]);
  const [selectedAutomation, setSelectedAutomation] = useState<Automation | null>(null);
  const [runs, setRuns] = useState<AutomationRun[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedAutomation, setExpandedAutomation] = useState<string | null>(null);
  const { addToast } = useToastStore();

  useEffect(() => {
    loadAutomations();
  }, []);

  const loadAutomations = async () => {
    try {
      const response = await fetch('/api/automations');
      const data = await response.json();
      setAutomations(data.automations || []);
      setLoading(false);
    } catch (error) {
      addToast({ type: 'error', message: 'Failed to load automations' });
      setLoading(false);
    }
  };

  const loadRuns = async (automationId: string) => {
    try {
      const response = await fetch(`/api/automations/${automationId}/runs`);
      const data = await response.json();
      setRuns(data.runs || []);
    } catch (error) {
      addToast({ type: 'error', message: 'Failed to load runs' });
    }
  };

  const toggleAutomation = async (automationId: string, currentEnabled: boolean) => {
    try {
      const response = await fetch('/api/automations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'toggle',
          automationId,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setAutomations(automations.map(a => 
          a.id === automationId ? { ...a, enabled: data.enabled } : a
        ));
        addToast({ type: 'success', message: data.message });
      }
    } catch (error) {
      addToast({ type: 'error', message: 'Failed to toggle automation' });
    }
  };

  const runNow = async (automationId: string) => {
    try {
      const response = await fetch('/api/automations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'run',
          automationId,
        }),
      });

      const data = await response.json();
      if (data.success) {
        addToast({ type: 'success', message: 'Automation started' });
        // Reload runs after a delay
        setTimeout(() => loadRuns(automationId), 2000);
      }
    } catch (error) {
      addToast({ type: 'error', message: 'Failed to run automation' });
    }
  };

  const selectAutomation = (automation: Automation) => {
    setSelectedAutomation(automation);
    loadRuns(automation.id);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleString();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
      case 'completed':
        return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case 'paused':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'error':
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'running':
        return <AlertCircle className="w-4 h-4 text-blue-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      paused: 'bg-yellow-100 text-yellow-800',
      error: 'bg-red-100 text-red-800',
      running: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
    };

    return (
      <Badge className={colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading automations...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Automations
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Manage automated tasks and workflows
          </p>
        </div>
        <Button>
          <Settings className="w-4 h-4 mr-2" />
          Configure
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Automations List */}
        <div className="lg:col-span-2 space-y-4">
          {automations.map((automation) => (
            <Card key={automation.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {automation.name}
                    </h3>
                    {getStatusBadge(automation.enabled ? 'active' : 'paused')}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    {automation.description}
                  </p>
                  
                  <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>Schedule: {automation.schedule}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(automation.status)}
                      <span>Last run: {formatDate(automation.last_run)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => runNow(automation.id)}
                    disabled={!automation.enabled}
                  >
                    <Play className="w-4 h-4 mr-1" />
                    Run Now
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => toggleAutomation(automation.id, automation.enabled)}
                  >
                    {automation.enabled ? 'Disable' : 'Enable'}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setExpandedAutomation(
                        expandedAutomation === automation.id ? null : automation.id
                      );
                      if (expandedAutomation !== automation.id) {
                        selectAutomation(automation);
                      }
                    }}
                  >
                    {expandedAutomation === automation.id ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Expanded Details */}
              {expandedAutomation === automation.id && selectedAutomation?.id === automation.id && (
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
                    Recent Runs
                  </h4>
                  
                  {runs.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      No runs yet. Click "Run Now" to execute this automation.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {runs.map((run) => (
                        <div
                          key={run.id}
                          className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            {getStatusIcon(run.status)}
                            <div>
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {run.status.charAt(0).toUpperCase() + run.status.slice(1)}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                {formatDate(run.started_at)}
                                {run.completed_at && ` → ${formatDate(run.completed_at)}`}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm">
                            <div className="text-gray-600 dark:text-gray-400">
                              {run.outputs.length} outputs
                            </div>
                            {run.errors.length > 0 && (
                              <div className="text-red-600">
                                {run.errors.length} errors
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </Card>
          ))}
        </div>

        {/* Summary Panel */}
        <div className="space-y-4">
          <Card className="p-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
              Automation Summary
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Total Automations
                </span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {automations.length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Active
                </span>
                <span className="font-semibold text-green-600">
                  {automations.filter(a => a.enabled).length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Paused
                </span>
                <span className="font-semibold text-yellow-600">
                  {automations.filter(a => !a.enabled).length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  With Errors
                </span>
                <span className="font-semibold text-red-600">
                  {automations.filter(a => a.status === 'error').length}
                </span>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
              Quick Actions
            </h3>
            <div className="space-y-2">
              <Button variant="secondary" className="w-full justify-start">
                <Play className="w-4 h-4 mr-2" />
                Run All Active
              </Button>
              <Button variant="secondary" className="w-full justify-start">
                <Clock className="w-4 h-4 mr-2" />
                View Schedule
              </Button>
              <Button variant="secondary" className="w-full justify-start">
                <Settings className="w-4 h-4 mr-2" />
                Global Settings
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}