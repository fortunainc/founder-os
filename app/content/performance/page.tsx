'use client'

import { DashboardLayout } from '@/components/layout'
import { Card, CardHeader, CardContent } from '@/components/ui'
import { Badge } from '@/components/ui'
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  MessageSquare, 
  Heart,
  Share2,
  Eye,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react'

export default function PerformancePage() {
  const topPosts = [
    { id: '1', title: 'Morning routine for founders', views: 12450, likes: 342, comments: 89, shares: 45, engagement: 3.8 },
    { id: '2', title: 'Why I fired my first client', views: 9820, likes: 278, comments: 67, shares: 32, engagement: 3.9 },
    { id: '3', title: 'Productivity tips for remote teams', views: 8750, likes: 245, comments: 54, shares: 28, engagement: 3.7 },
    { id: '4', title: 'The power of saying no', views: 7230, likes: 198, comments: 45, shares: 22, engagement: 3.6 },
    { id: '5', title: 'Building in public lessons', views: 6540, likes: 167, comments: 38, shares: 18, engagement: 3.4 },
  ]

  const metrics = [
    { label: 'Total Views', value: '44.8K', change: '+12%', trend: 'up', icon: Eye },
    { label: 'Total Likes', value: '1.2K', change: '+8%', trend: 'up', icon: Heart },
    { label: 'Total Comments', value: '293', change: '+15%', trend: 'up', icon: MessageSquare },
    { label: 'Total Shares', value: '145', change: '+5%', trend: 'up', icon: Share2 },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Performance Tracker
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Analyze your content performance and engagement
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((metric) => {
            const Icon = metric.icon
            return (
              <Card key={metric.label}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{metric.label}</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                        {metric.value}
                      </p>
                      <div className={`flex items-center gap-1 mt-2 text-xs ${
                        metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {metric.trend === 'up' ? (
                          <ArrowUpRight className="w-3 h-3" />
                        ) : (
                          <ArrowDownRight className="w-3 h-3" />
                        )}
                        <span>{metric.change}</span>
                      </div>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                      <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Top Performing Posts */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Top Performing Posts
            </h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topPosts.map((post, index) => (
                <div
                  key={post.id}
                  className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                      #{index + 1}
                    </span>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                      {post.title}
                    </h4>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {post.views.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="w-3 h-3" />
                        {post.likes}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="w-3 h-3" />
                        {post.comments}
                      </span>
                      <span className="flex items-center gap-1">
                        <Share2 className="w-3 h-3" />
                        {post.shares}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {post.engagement}%
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Engagement</p>
                    </div>
                    <Badge 
                      variant={post.engagement >= 3.5 ? 'success' : 'warning'}
                      className="whitespace-nowrap"
                    >
                      {post.engagement >= 3.5 ? 'High' : 'Medium'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Engagement Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Content Performance by Type
              </h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Threads</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">4.2% avg</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '85%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Single Posts</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">3.5% avg</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '70%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Carousels</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">3.8% avg</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-purple-600 h-2 rounded-full" style={{ width: '76%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Videos</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">2.9% avg</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-orange-600 h-2 rounded-full" style={{ width: '58%' }} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Best Posting Times
              </h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <div>
                    <p className="text-sm font-medium text-green-900 dark:text-green-300">
                      Tuesday 9:00 AM
                    </p>
                    <p className="text-xs text-green-700 dark:text-green-400 mt-1">
                      Highest engagement rate
                    </p>
                  </div>
                  <Badge variant="success">Best</Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div>
                    <p className="text-sm font-medium text-blue-900 dark:text-blue-300">
                      Thursday 10:00 AM
                    </p>
                    <p className="text-xs text-blue-700 dark:text-blue-400 mt-1">
                      Strong engagement
                    </p>
                  </div>
                  <Badge variant="primary">Good</Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Monday 2:00 PM
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Moderate engagement
                    </p>
                  </div>
                  <Badge variant="default">Average</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}