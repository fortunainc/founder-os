'use client'

import Link from 'next/link'
import { DashboardLayout } from '@/components/layout'
import { Card, CardContent } from '@/components/ui'
import { Button } from '@/components/ui'
import { 
  Lightbulb, 
  FileText, 
  Calendar as CalendarIcon, 
  BarChart3,
  Plus,
  MessageSquare
} from 'lucide-react'

export default function ContentPage() {
  const sections = [
    {
      title: 'Idea Inbox',
      description: 'Capture and organize content ideas',
      icon: Lightbulb,
      href: '/content/ideas',
      count: 15,
      color: 'blue',
    },
    {
      title: 'Draft Studio',
      description: 'Write and edit your content',
      icon: FileText,
      href: '/content/drafts',
      count: 5,
      color: 'green',
    },
    {
      title: 'Content Calendar',
      description: 'Schedule and plan your posts',
      icon: CalendarIcon,
      href: '/content/calendar',
      count: 12,
      color: 'purple',
    },
    {
      title: 'Performance Tracker',
      description: 'Analyze content performance',
      icon: BarChart3,
      href: '/content/performance',
      count: 8,
      color: 'orange',
    },
  ]

  const colorClasses: Record<string, string> = {
    blue: 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
    green: 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400',
    purple: 'bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
    orange: 'bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400',
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Content OS
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Create, schedule, and analyze your content
            </p>
          </div>
          <Link href="/content/ideas">
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              New Content
            </Button>
          </Link>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <p className="text-xs text-gray-600 dark:text-gray-400">Total Ideas</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">15</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-xs text-gray-600 dark:text-gray-400">Drafts in Progress</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">5</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-xs text-gray-600 dark:text-gray-400">Scheduled</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">12</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-xs text-gray-600 dark:text-gray-400">Published This Month</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">8</p>
            </CardContent>
          </Card>
        </div>

        {/* Content Modules */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sections.map((section) => {
            const Icon = section.icon
            return (
              <Link key={section.href} href={section.href}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses[section.color]}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {section.title}
                          </h3>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {section.count}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {section.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>

        {/* Engagement Copilot Banner */}
        <Card className="bg-gradient-to-r from-blue-600 to-blue-700 border-none">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    Engagement Copilot
                  </h3>
                  <p className="text-sm text-blue-100 mt-1">
                    AI-powered reply suggestions for all your engagement
                  </p>
                </div>
              </div>
              <Link href="/engagement">
                <Button variant="primary" className="bg-white text-blue-600 hover:bg-gray-100">
                  Open Copilot
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}