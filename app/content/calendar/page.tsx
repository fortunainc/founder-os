'use client'

import { useState } from 'react'
import { DashboardLayout } from '@/components/layout'
import { Card, CardHeader, CardContent } from '@/components/ui'
import { Button } from '@/components/ui'
import { Badge } from '@/components/ui'
import { EmptyState } from '@/components/ui'
import { Modal } from '@/components/ui'
import { Input } from '@/components/ui'
import { Select } from '@/components/ui'
import { 
  Calendar as CalendarIcon, 
  Plus, 
  ChevronLeft, 
  ChevronRight,
  Filter,
  CheckCircle2,
  Clock,
  CalendarDays
} from 'lucide-react'

interface ScheduledPost {
  id: string
  title: string
  date: string
  time: string
  platform: 'linkedin' | 'twitter' | 'both'
  status: 'scheduled' | 'published' | 'failed'
}

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [posts, setPosts] = useState<ScheduledPost[]>([
    { id: '1', title: 'Morning routine thread', date: '2024-01-15', time: '09:00', platform: 'linkedin', status: 'published' },
    { id: '2', title: 'Productivity tips', date: '2024-01-16', time: '14:00', platform: 'twitter', status: 'scheduled' },
    { id: '3', title: 'Leadership insights', date: '2024-01-18', time: '10:00', platform: 'linkedin', status: 'scheduled' },
  ])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newPost, setNewPost] = useState<{
    title: string;
    date: string;
    time: string;
    platform: 'linkedin' | 'twitter' | 'both';
  }>({ title: '', date: '', time: '09:00', platform: 'linkedin' })

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const days = []

    // Empty cells for days before the first day
    for (let i = 0; i < firstDay; i++) {
      days.push(null)
    }

    // Days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i))
    }

    return days
  }

  const days = getDaysInMonth(currentDate)
  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  const getPostsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0]
    return posts.filter(post => post.date === dateStr)
  }

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }

  const addScheduledPost = () => {
    if (!newPost.title.trim() || !newPost.date) return
    const post: ScheduledPost = {
      id: Date.now().toString(),
      ...newPost,
      status: 'scheduled',
    }
    setPosts([...posts, post])
    setNewPost({ title: '', date: '', time: '09:00', platform: 'linkedin' })
    setIsModalOpen(false)
  }

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Content Calendar
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Schedule and plan your content
            </p>
          </div>
          <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Schedule Post
          </Button>
        </div>

        {/* Calendar */}
        <Card>
          <CardContent className="p-6">
            {/* Month Navigation */}
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={prevMonth}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
              
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {monthName}
              </h2>
              
              <button
                onClick={nextMonth}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
              >
                <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2">
              {/* Day headers */}
              {dayNames.map((day) => (
                <div key={day} className="text-center text-sm font-medium text-gray-500 dark:text-gray-400 py-2">
                  {day}
                </div>
              ))}

              {/* Calendar days */}
              {days.map((date, index) => {
                if (!date) return <div key={index} className="h-24" />
                
                const dayPosts = getPostsForDate(date)
                const isToday = new Date().toDateString() === date.toDateString()
                const isSelected = selectedDate?.toDateString() === date.toDateString()

                return (
                  <div
                    key={index}
                    onClick={() => setSelectedDate(date)}
                    className={`
                      h-24 border border-gray-200 dark:border-gray-800 rounded-lg p-2 cursor-pointer
                      ${isToday ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700' : ''}
                      ${isSelected ? 'ring-2 ring-blue-500' : ''}
                      hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors
                    `}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-sm font-medium ${
                        isToday ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-white'
                      }`}>
                        {date.getDate()}
                      </span>
                      {dayPosts.length > 0 && (
                        <Badge variant="primary" className="text-xs">
                          {dayPosts.length}
                        </Badge>
                      )}
                    </div>
                    
                    {dayPosts.slice(0, 2).map((post) => (
                      <div key={post.id} className="text-xs text-gray-600 dark:text-gray-400 truncate">
                        {post.title}
                      </div>
                    ))}
                    
                    {dayPosts.length > 2 && (
                      <div className="text-xs text-gray-500 dark:text-gray-500">
                        +{dayPosts.length - 2} more
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Selected Day Posts */}
        {selectedDate && (
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {getPostsForDate(selectedDate).length === 0 ? (
                  <EmptyState
                    icon={CalendarDays}
                    title="No posts scheduled"
                    description="Add content to this day to build your calendar."
                  />
                ) : (
                  getPostsForDate(selectedDate).map((post) => (
                    <div key={post.id} className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                        <CalendarIcon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {post.title}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-gray-500 dark:text-gray-400">{post.time}</span>
                          <Badge variant="primary" className="text-xs">
                            {post.platform}
                          </Badge>
                          {post.status === 'published' && (
                            <Badge variant="success" className="text-xs flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" />
                              Published
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Schedule Post Modal */}
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Schedule New Post">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Post Title
              </label>
              <Input
                placeholder="Enter post title..."
                value={newPost.title}
                onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Date
                </label>
                <Input
                  type="date"
                  value={newPost.date}
                  onChange={(e) => setNewPost({ ...newPost, date: e.target.value })}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Time
                </label>
                <Input
                  type="time"
                  value={newPost.time}
                  onChange={(e) => setNewPost({ ...newPost, time: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Platform
              </label>
              <Select
                value={newPost.platform}
                onChange={(e) => setNewPost({ ...newPost, platform: e.target.value as any })}
              >
                <option value="linkedin">LinkedIn</option>
                <option value="twitter">Twitter</option>
                <option value="both">Both</option>
              </Select>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
              <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={addScheduledPost} disabled={!newPost.title.trim() || !newPost.date}>
                Schedule Post
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </DashboardLayout>
  )
}