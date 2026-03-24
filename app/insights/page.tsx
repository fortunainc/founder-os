'use client'

import { useState } from 'react'
import { DashboardLayout } from '@/components/layout'
import { Card, CardHeader, CardContent } from '@/components/ui'
import { Button } from '@/components/ui'
import { Badge } from '@/components/ui'
import { 
  BarChart3, 
  TrendingUp, 
  Sparkles,
  Target,
  AlertCircle,
  CheckCircle2,
  RefreshCw
} from 'lucide-react'

export default function InsightsPage() {
  const [isGenerating, setIsGenerating] = useState(false)

  const insights = [
    {
      category: 'Content Strategy',
      type: 'opportunity',
      title: 'Thread Performance is 3x Higher',
      description: 'Your thread posts are getting significantly more engagement than single posts. Consider converting more single posts into thread formats.',
      action: 'Review single posts from last month and create thread versions',
      impact: 'high',
    },
    {
      category: 'Engagement',
      type: 'warning',
      title: 'Response Time Slowing Down',
      description: 'Average response time to comments has increased from 2 hours to 6 hours. This is impacting engagement rates.',
      action: 'Schedule dedicated engagement blocks (2x daily, 30 min each)',
      impact: 'medium',
    },
    {
      category: 'Revenue',
      type: 'success',
      title: 'Strong Pipeline Growth',
      description: 'Your pipeline has grown 40% this month. The new outreach strategy is working well.',
      action: 'Scale up the current outreach process',
      impact: 'high',
    },
    {
      category: 'Task Management',
      type: 'warning',
      title: 'Task Completion Dropped to 75%',
      description: 'Your daily task completion rate dropped from 85% to 75%. Consider reducing task count or improving time estimates.',
      action: 'Review and adjust daily task priorities',
      impact: 'medium',
    },
    {
      category: 'Content',
      type: 'opportunity',
      title: 'Untapped Niche: Productivity',
      description: 'Your productivity-related content is performing 50% better than other topics. This is your strongest content pillar.',
      action: 'Increase productivity content to 60% of your calendar',
      impact: 'high',
    },
  ]

  const generateNewInsights = async () => {
    setIsGenerating(true)
    // TODO: Call AI to generate fresh insights
    setTimeout(() => {
      setIsGenerating(false)
    }, 2000)
  }

  const typeColors: Record<string, string> = {
    opportunity: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
    warning: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800',
    success: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
  }

  const typeIcons: Record<string, any> = {
    opportunity: TrendingUp,
    warning: AlertCircle,
    success: CheckCircle2,
  }

  const impactColors: Record<string, 'success' | 'warning' | 'primary' | 'danger' | 'default'> = {
    high: 'success',
    medium: 'warning',
    low: 'default',
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              AI Insights
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Data-driven recommendations to optimize your founder operations
            </p>
          </div>
          <Button
            onClick={generateNewInsights}
            disabled={isGenerating}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
            {isGenerating ? 'Generating...' : 'Generate Insights'}
          </Button>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <p className="text-xs text-gray-600 dark:text-gray-400">High Impact</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {insights.filter(i => i.impact === 'high').length}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-xs text-gray-600 dark:text-gray-400">Opportunities</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {insights.filter(i => i.type === 'opportunity').length}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-xs text-gray-600 dark:text-gray-400">Warnings</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {insights.filter(i => i.type === 'warning').length}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-xs text-gray-600 dark:text-gray-400">Wins</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {insights.filter(i => i.type === 'success').length}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Insights List */}
        <div className="space-y-4">
          {insights.map((insight, index) => {
            const Icon = typeIcons[insight.type]
            return (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${typeColors[insight.type]}`}>
                      <Icon className="w-5 h-5" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="primary" className="text-xs">
                              {insight.category}
                            </Badge>
                            <Badge variant={impactColors[insight.impact]} className="text-xs">
                              {insight.impact} impact
                            </Badge>
                          </div>
                          <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                            {insight.title}
                          </h3>
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        {insight.description}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Target className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            {insight.action}
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="flex items-center gap-1"
                        >
                          <Sparkles className="w-3 h-3" />
                          Create Task
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* AI Summary */}
        <Card className="bg-gradient-to-r from-purple-600 to-purple-700 border-none">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-2">
                  Weekly AI Summary
                </h3>
                <p className="text-sm text-purple-100 leading-relaxed">
                  This week, your content performance has been exceptional with a 3x increase in engagement. 
                  Your pipeline is growing steadily at 40%, indicating strong revenue potential. 
                  However, focus on improving response times (currently at 6 hours, up from 2 hours) 
                  and task completion rates (dropped to 75%). Consider dedicating specific time blocks 
                  for engagement and reviewing your daily task priorities. Your productivity content 
                  is your strongest pillar - lean into this strength.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}