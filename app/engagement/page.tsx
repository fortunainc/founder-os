'use client'

import { useState } from 'react'
import { DashboardLayout } from '@/components/layout'
import { Card, CardContent } from '@/components/ui'
import { Button } from '@/components/ui'
import { Badge } from '@/components/ui'
import { Textarea } from '@/components/ui'
import { Input } from '@/components/ui'
import { EmptyState } from '@/components/ui'
import { 
  MessageSquare, 
  Sparkles, 
  Send, 
  CheckCircle2,
  User,
  Clock,
  TrendingUp,
  Copy,
  Edit3
} from 'lucide-react'

interface Comment {
  id: string
  author: string
  content: string
  platform: 'linkedin' | 'twitter'
  timestamp: string
  status: 'unread' | 'responded' | 'skipped'
  aiSuggestion?: string
}

export default function EngagementPage() {
  const [comments, setComments] = useState<Comment[]>([
    { 
      id: '1', 
      author: 'Sarah Chen', 
      content: 'This is exactly what I needed to read today. The morning routine tips are gold!', 
      platform: 'linkedin',
      timestamp: '2 hours ago',
      status: 'unread',
      aiSuggestion: 'Thanks Sarah! I\'m glad the morning routine tips resonated with you. What\'s one routine you\'ve been wanting to try?',
    },
    { 
      id: '2', 
      author: 'Mike Johnson', 
      content: 'Great insights! Would love to hear more about how you handle team productivity remotely.', 
      platform: 'linkedin',
      timestamp: '4 hours ago',
      status: 'unread',
      aiSuggestion: 'Appreciate the kind words, Mike! Remote team productivity is a journey. The key for us has been async communication and clear documentation. Would you like me to share our specific tools?',
    },
    { 
      id: '3', 
      author: '@startupfounder', 
      content: 'The firing your first client story hits different. Courageous move!', 
      platform: 'twitter',
      timestamp: '6 hours ago',
      status: 'responded',
    },
  ])
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null)
  const [customReply, setCustomReply] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [filter, setFilter] = useState<'all' | 'unread' | 'responded'>('all')

  const filteredComments = comments.filter(comment => {
    if (filter === 'all') return true
    return comment.status === filter
  })

  const generateReply = async (comment: Comment) => {
    setIsGenerating(true)
    // TODO: Call AI to generate reply
    setTimeout(() => {
      setComments(comments.map(c => 
        c.id === comment.id 
          ? { ...c, aiSuggestion: `Thanks ${c.author}! Really appreciate your thoughtful comment on ${c.platform === 'linkedin' ? 'LinkedIn' : 'Twitter'}. I'd love to hear more about your perspective on this topic.` }
          : c
      ))
      setIsGenerating(false)
    }, 1000)
  }

  const useAISuggestion = (comment: Comment) => {
    setCustomReply(comment.aiSuggestion || '')
  }

  const submitReply = () => {
    if (!selectedComment || !customReply.trim()) return
    // TODO: Send reply to platform (requires human approval)
    setComments(comments.map(c => 
      c.id === selectedComment.id 
        ? { ...c, status: 'responded' as const }
        : c
    ))
    setSelectedComment(null)
    setCustomReply('')
  }

  const skipComment = (id: string) => {
    setComments(comments.map(c => 
      c.id === id 
        ? { ...c, status: 'skipped' as const }
        : c
    ))
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Engagement Copilot
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              AI-powered reply suggestions for all your engagement
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="primary">
              {comments.filter(c => c.status === 'unread').length} Unread
            </Badge>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <p className="text-xs text-gray-600 dark:text-gray-400">Total Comments</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {comments.length}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-xs text-gray-600 dark:text-gray-400">Unread</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {comments.filter(c => c.status === 'unread').length}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-xs text-gray-600 dark:text-gray-400">Responded</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {comments.filter(c => c.status === 'responded').length}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-xs text-gray-600 dark:text-gray-400">AI Suggestions Used</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                24
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2">
          <Button
            variant={filter === 'all' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setFilter('all')}
          >
            All ({comments.length})
          </Button>
          <Button
            variant={filter === 'unread' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setFilter('unread')}
          >
            Unread ({comments.filter(c => c.status === 'unread').length})
          </Button>
          <Button
            variant={filter === 'responded' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setFilter('responded')}
          >
            Responded ({comments.filter(c => c.status === 'responded').length})
          </Button>
        </div>

        {/* Comments List */}
        {filteredComments.length === 0 ? (
          <EmptyState
            icon={MessageSquare}
            title="No comments to show"
            description="Connect your social media accounts to start receiving engagement."
          />
        ) : (
          <div className="space-y-4">
            {filteredComments.map((comment) => (
              <Card key={comment.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      comment.platform === 'linkedin' ? 'bg-blue-100 dark:bg-blue-900/20' : 'bg-gray-100 dark:bg-gray-800'
                    }`}>
                      <User className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                          {comment.author}
                        </p>
                        <Badge variant={comment.platform === 'linkedin' ? 'primary' : 'default'} className="text-xs">
                          {comment.platform}
                        </Badge>
                        <Badge variant={comment.status === 'unread' ? 'warning' : comment.status === 'responded' ? 'success' : 'default'}>
                          {comment.status}
                        </Badge>
                        <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {comment.timestamp}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                        {comment.content}
                      </p>

                      {comment.aiSuggestion && comment.status !== 'responded' && (
                        <div className="mb-3 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                            <span className="text-xs font-medium text-blue-900 dark:text-blue-300">
                              AI Suggestion
                            </span>
                          </div>
                          <p className="text-sm text-blue-800 dark:text-blue-300">
                            {comment.aiSuggestion}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedComment(comment)
                                setCustomReply(comment.aiSuggestion || '')
                              }}
                              className="flex items-center gap-1"
                            >
                              <Edit3 className="w-3 h-3" />
                              Use This
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(comment.aiSuggestion || '')}
                              className="flex items-center gap-1"
                            >
                              <Copy className="w-3 h-3" />
                              Copy
                            </Button>
                          </div>
                        </div>
                      )}

                      {selectedComment?.id === comment.id && (
                        <div className="space-y-2">
                          <Textarea
                            placeholder="Write your reply..."
                            value={customReply}
                            onChange={(e) => setCustomReply(e.target.value)}
                            rows={3}
                          />
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSelectedComment(null)}
                              >
                                Cancel
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => skipComment(comment.id)}
                              >
                                Skip
                              </Button>
                            </div>
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={submitReply}
                              disabled={!customReply.trim()}
                              className="flex items-center gap-1"
                            >
                              <Send className="w-3 h-3" />
                              Send Reply
                            </Button>
                          </div>
                        </div>
                      )}

                      {!selectedComment && comment.status !== 'responded' && !comment.aiSuggestion && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => generateReply(comment)}
                          disabled={isGenerating}
                          className="flex items-center gap-1"
                        >
                          <Sparkles className="w-3 h-3" />
                          {isGenerating ? 'Generating...' : 'Generate Reply'}
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}