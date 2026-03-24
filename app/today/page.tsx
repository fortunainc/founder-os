'use client'

import { useState } from 'react'
import { DashboardLayout } from '@/components/layout'
import { Card, CardHeader, CardContent } from '@/components/ui'
import { Button } from '@/components/ui'
import { Badge } from '@/components/ui'
import { Input } from '@/components/ui'
import { EmptyState } from '@/components/ui'
import { 
  Plus, 
  CheckCircle2, 
  Circle, 
  Clock, 
  TrendingUp,
  AlertCircle,
  Sparkles
} from 'lucide-react'

interface Task {
  id: string
  title: string
  completed: boolean
  priority: 'high' | 'medium' | 'low'
  timeBlock?: string
}

export default function TodayPage() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', title: 'Write LinkedIn post about productivity', completed: false, priority: 'high', timeBlock: '9:00 AM - 10:00 AM' },
    { id: '2', title: 'Review and reply to comments', completed: true, priority: 'medium', timeBlock: '10:00 AM - 10:30 AM' },
    { id: '3', title: 'Follow up with 3 warm leads', completed: false, priority: 'high', timeBlock: '2:00 PM - 3:00 PM' },
  ])
  const [newTask, setNewTask] = useState('')
  const [showAISuggestions, setShowAISuggestions] = useState(false)

  const aiSuggestions = [
    'Post a thread about your morning routine',
    'Engage with 5 comments on industry posts',
    'Update CRM with new prospect notes',
  ]

  const handleAddTask = () => {
    if (!newTask.trim()) return
    if (tasks.length >= 3) {
      // Show warning about max 3 tasks
      return
    }
    const task: Task = {
      id: Date.now().toString(),
      title: newTask,
      completed: false,
      priority: 'medium',
    }
    setTasks([...tasks, task])
    setNewTask('')
  }

  const toggleTask = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ))
  }

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id))
  }

  const completionRate = tasks.length > 0 
    ? Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100) 
    : 0

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Today's Focus
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Tasks Today</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    {tasks.filter(t => !t.completed).length} / 3
                  </p>
                </div>
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                  <Circle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Completion</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    {completionRate}%
                  </p>
                </div>
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Focus Time</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    4h 30m
                  </p>
                </div>
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Warning */}
        {tasks.length >= 3 && (
          <div className="flex items-start gap-3 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-yellow-900 dark:text-yellow-300">
                Maximum 3 Tasks
              </p>
              <p className="text-xs text-yellow-700 dark:text-yellow-400 mt-1">
                Focus on completing your current tasks before adding more. Quality over quantity.
              </p>
            </div>
          </div>
        )}

        {/* Add Task */}
        <Card>
          <CardContent className="p-4">
            <div className="flex gap-3">
              <Input
                placeholder="Add a task (max 3 per day)..."
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
                disabled={tasks.length >= 3}
              />
              <Button 
                onClick={handleAddTask} 
                disabled={!newTask.trim() || tasks.length >= 3}
                size="md"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* AI Suggestions */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            AI Task Suggestions
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAISuggestions(!showAISuggestions)}
            className="flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            {showAISuggestions ? 'Hide' : 'Show'}
          </Button>
        </div>

        {showAISuggestions && (
          <div className="space-y-2">
            {aiSuggestions.map((suggestion, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                onClick={() => {
                  if (tasks.length < 3) {
                    setTasks([...tasks, {
                      id: Date.now().toString(),
                      title: suggestion,
                      completed: false,
                      priority: 'medium',
                    }])
                    setShowAISuggestions(false)
                  }
                }}
              >
                <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {suggestion}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Tasks List */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Today's Priorities
          </h2>

          {tasks.length === 0 ? (
            <EmptyState
              icon={CheckCircle2}
              title="No tasks for today"
              description="Add your top 3 priorities to start your day focused."
            />
          ) : (
            tasks.map((task) => (
              <Card key={task.id} className="transition-all">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => toggleTask(task.id)}
                      className="flex-shrink-0 mt-0.5"
                    >
                      {task.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                      ) : (
                        <Circle className="w-5 h-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                      )}
                    </button>
                    
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm ${
                        task.completed 
                          ? 'text-gray-500 dark:text-gray-500 line-through' 
                          : 'text-gray-900 dark:text-white'
                      }`}>
                        {task.title}
                      </p>
                      {task.timeBlock && !task.completed && (
                        <div className="flex items-center gap-1 mt-2">
                          <Clock className="w-3 h-3 text-gray-500" />
                          <span className="text-xs text-gray-500">{task.timeBlock}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge
                        variant={task.priority === 'high' ? 'danger' : task.priority === 'medium' ? 'warning' : 'default'}
                      >
                        {task.priority}
                      </Badge>
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                      >
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* End of Day Check-in */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              End of Day Check-in
            </h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <input type="checkbox" id="reflection" className="w-4 h-4 rounded" />
                <label htmlFor="reflection" className="text-sm text-gray-700 dark:text-gray-300">
                  Completed daily reflection
                </label>
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" id="tomorrow" className="w-4 h-4 rounded" />
                <label htmlFor="tomorrow" className="text-sm text-gray-700 dark:text-gray-300">
                  Planned tomorrow's priorities
                </label>
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" id="celebrate" className="w-4 h-4 rounded" />
                <label htmlFor="celebrate" className="text-sm text-gray-700 dark:text-gray-300">
                  Celebrated wins
                </label>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}