'use client'

import { DashboardLayout } from '@/components/layout'
import { Card, CardHeader, CardContent } from '@/components/ui'
import { Badge } from '@/components/ui'
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  MessageSquare, 
  Calendar,
  Target,
  Users,
  CheckCircle2
} from 'lucide-react'

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            CEO Dashboard
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Overview of your founder operations
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Weekly Content</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">12</p>
                  <div className="flex items-center gap-1 mt-2 text-xs">
                    <TrendingUp className="w-3 h-3 text-green-600" />
                    <span className="text-green-600">+3 this week</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Tasks Completed</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">28</p>
                  <div className="flex items-center gap-1 mt-2 text-xs">
                    <TrendingUp className="w-3 h-3 text-green-600" />
                    <span className="text-green-600">85% completion</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Active Leads</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">15</p>
                  <div className="flex items-center gap-1 mt-2 text-xs">
                    <TrendingDown className="w-3 h-3 text-red-600" />
                    <span className="text-red-600">-2 this week</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Engagement Rate</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">4.8%</p>
                  <div className="flex items-center gap-1 mt-2 text-xs">
                    <TrendingUp className="w-3 h-3 text-green-600" />
                    <span className="text-green-600">+0.5% this week</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Weekly Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Weekly Activity
              </h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Content Published</span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">8 posts</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Tasks Completed</span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">28 tasks</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Calls Booked</span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">5 calls</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Ideas Captured</span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">15 ideas</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Engagement Copilot Used</span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">32 replies</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                AI Insights
              </h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <p className="text-sm font-medium text-blue-900 dark:text-blue-300">
                    Content Performance
                  </p>
                  <p className="text-xs text-blue-700 dark:text-blue-400 mt-1">
                    Your "productivity hacks" posts are performing 3x better this week. Consider creating more in this category.
                  </p>
                </div>
                
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <p className="text-sm font-medium text-green-900 dark:text-green-300">
                    Task Efficiency
                  </p>
                  <p className="text-xs text-green-700 dark:text-green-400 mt-1">
                    You're completing 85% of daily tasks. Focus on prioritizing high-impact activities in the morning.
                  </p>
                </div>

                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                  <p className="text-sm font-medium text-purple-900 dark:text-purple-300">
                    Revenue Opportunity
                  </p>
                  <p className="text-xs text-purple-700 dark:text-purple-400 mt-1">
                    3 leads in "proposal sent" stage haven't received follow-up in 3 days. Consider reaching out.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Upcoming This Week
            </h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Content Planning Session
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    Monday, 10:00 AM - Plan next week's content calendar
                  </p>
                </div>
                <Badge variant="primary">Today</Badge>
              </div>

              <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <Target className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Q3 Goal Review
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    Wednesday, 2:00 PM - Review quarterly objectives
                  </p>
                </div>
                <Badge variant="warning">In 2 days</Badge>
              </div>

              <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <DollarSign className="w-5 h-5 text-purple-600 dark:text-purple-400 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Client Call: TechCorp
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    Friday, 11:00 AM - Product demo
                  </p>
                </div>
                <Badge variant="default">In 4 days</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}