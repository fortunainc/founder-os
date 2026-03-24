'use client'

import { useState } from 'react'
import { DashboardLayout } from '@/components/layout'
import { Card, CardHeader, CardContent } from '@/components/ui'
import { Button } from '@/components/ui'
import { Input } from '@/components/ui'
import { Badge } from '@/components/ui'
import { EmptyState } from '@/components/ui'
import { Modal } from '@/components/ui'
import { Textarea } from '@/components/ui'
import { Select } from '@/components/ui'
import { 
  Plus, 
  Lightbulb, 
  Search,
  Filter,
  Sparkles,
  Trash2,
  FileText
} from 'lucide-react'

interface Idea {
  id: string
  content: string
  pillar: string
  tone: string
  status: 'inbox' | 'planned' | 'archived'
  createdAt: string
}

export default function IdeasPage() {
  const [ideas, setIdeas] = useState<Idea[]>([
    { id: '1', content: 'Share a story about your first customer', pillar: 'Storytelling', tone: 'Vulnerable', status: 'inbox', createdAt: '2024-01-15' },
    { id: '2', content: 'Tips for remote team productivity', pillar: 'Educational', tone: 'Authoritative', status: 'inbox', createdAt: '2024-01-14' },
    { id: '3', content: 'Mistake I made with early hiring', pillar: 'Storytelling', tone: 'Vulnerable', status: 'planned', createdAt: '2024-01-13' },
  ])
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'inbox' | 'planned' | 'archived'>('all')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newIdea, setNewIdea] = useState({ content: '', pillar: 'General', tone: 'Neutral' })
  const [isGenerating, setIsGenerating] = useState(false)

  const filteredIdeas = ideas.filter(idea => {
    const matchesSearch = idea.content.toLowerCase().includes(search.toLowerCase())
    const matchesFilter = filter === 'all' || idea.status === filter
    return matchesSearch && matchesFilter
  })

  const handleAddIdea = () => {
    if (!newIdea.content.trim()) return
    const idea: Idea = {
      id: Date.now().toString(),
      ...newIdea,
      status: 'inbox',
      createdAt: new Date().toISOString(),
    }
    setIdeas([idea, ...ideas])
    setNewIdea({ content: '', pillar: 'General', tone: 'Neutral' })
    setIsModalOpen(false)
  }

  const handleGenerateIdea = async () => {
    setIsGenerating(true)
    // TODO: Call AI to generate idea
    setTimeout(() => {
      const generated: Idea = {
        id: Date.now().toString(),
        content: 'The power of saying "no" as a founder - how focus drives growth',
        pillar: 'Leadership',
        tone: 'Authoritative',
        status: 'inbox',
        createdAt: new Date().toISOString(),
      }
      setIdeas([generated, ...ideas])
      setIsGenerating(false)
      setIsModalOpen(false)
    }, 1000)
  }

  const moveToDraft = (id: string) => {
    // TODO: Navigate to drafts page with this idea
    console.log('Move to draft:', id)
  }

  const archiveIdea = (id: string) => {
    setIdeas(ideas.map(idea => 
      idea.id === id ? { ...idea, status: 'archived' } : idea
    ))
  }

  const deleteIdea = (id: string) => {
    setIdeas(ideas.filter(idea => idea.id !== id))
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Idea Inbox
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Capture and organize your content ideas
            </p>
          </div>
          <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            New Idea
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search ideas..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="w-full sm:w-40"
          >
            <option value="all">All Ideas</option>
            <option value="inbox">Inbox</option>
            <option value="planned">Planned</option>
            <option value="archived">Archived</option>
          </Select>
        </div>

        {/* Ideas List */}
        {filteredIdeas.length === 0 ? (
          <EmptyState
            icon={Lightbulb}
            title="No ideas yet"
            description="Start capturing your content ideas to build your library."
            action={{
              label: 'Add Your First Idea',
              onClick: () => setIsModalOpen(true),
            }}
          />
        ) : (
          <div className="space-y-3">
            {filteredIdeas.map((idea) => (
              <Card key={idea.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Lightbulb className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900 dark:text-white mb-2">
                        {idea.content}
                      </p>
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="default">{idea.pillar}</Badge>
                        <Badge variant="warning">{idea.tone}</Badge>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(idea.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {idea.status === 'inbox' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => moveToDraft(idea.id)}
                          className="flex items-center gap-1"
                        >
                          <FileText className="w-4 h-4" />
                          Draft
                        </Button>
                      )}
                      <button
                        onClick={() => archiveIdea(idea.id)}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                      >
                        <Filter className="w-4 h-4 text-gray-400" />
                      </button>
                      <button
                        onClick={() => deleteIdea(idea.id)}
                        className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Add Idea Modal */}
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Idea">
          <div className="space-y-4">
            <Textarea
              placeholder="Describe your content idea..."
              value={newIdea.content}
              onChange={(e) => setNewIdea({ ...newIdea, content: e.target.value })}
              rows={4}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Content Pillar
                </label>
                <Select
                  value={newIdea.pillar}
                  onChange={(e) => setNewIdea({ ...newIdea, pillar: e.target.value })}
                >
                  <option value="General">General</option>
                  <option value="Storytelling">Storytelling</option>
                  <option value="Educational">Educational</option>
                  <option value="Leadership">Leadership</option>
                  <option value="Productivity">Productivity</option>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Emotional Tone
                </label>
                <Select
                  value={newIdea.tone}
                  onChange={(e) => setNewIdea({ ...newIdea, tone: e.target.value })}
                >
                  <option value="Neutral">Neutral</option>
                  <option value="Vulnerable">Vulnerable</option>
                  <option value="Authoritative">Authoritative</option>
                  <option value="Inspirational">Inspirational</option>
                  <option value="Controversial">Controversial</option>
                </Select>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
              <Button
                variant="ghost"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="ghost"
                onClick={handleGenerateIdea}
                disabled={isGenerating}
                className="flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                {isGenerating ? 'Generating...' : 'AI Generate'}
              </Button>
              <Button
                variant="primary"
                onClick={handleAddIdea}
                disabled={!newIdea.content.trim()}
              >
                Save Idea
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </DashboardLayout>
  )
}