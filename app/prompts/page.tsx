'use client'

import { useState } from 'react'
import { DashboardLayout } from '@/components/layout'
import { Card, CardHeader, CardContent } from '@/components/ui'
import { Button } from '@/components/ui'
import { Input } from '@/components/ui'
import { Textarea } from '@/components/ui'
import { Badge } from '@/components/ui'
import { Select } from '@/components/ui'
import { Modal } from '@/components/ui'
import { 
  Sparkles, 
  Plus, 
  Copy, 
  Edit3, 
  Trash2,
  Search,
  Filter,
  CheckCircle2
} from 'lucide-react'

interface PromptTemplate {
  id: string
  name: string
  category: string
  template: string
  variables: string[]
  createdAt: string
}

export default function PromptsPage() {
  const [prompts, setPrompts] = useState<PromptTemplate[]>([
    { 
      id: '1', 
      name: 'Thread Generator', 
      category: 'Content Creation',
      template: 'Create a Twitter thread about {topic}. Make it {tone} and include {num_tweets} tweets. End with a question to engage the audience.',
      variables: ['topic', 'tone', 'num_tweets'],
      createdAt: '2024-01-15',
    },
    { 
      id: '2', 
      name: 'Comment Reply', 
      category: 'Engagement',
      template: 'Write a thoughtful reply to this comment: "{comment}". Keep it {tone} and under 100 characters.',
      variables: ['comment', 'tone'],
      createdAt: '2024-01-14',
    },
    { 
      id: '3', 
      name: 'LinkedIn Post', 
      category: 'Content Creation',
      template: 'Write a LinkedIn post about {topic}. Make it {tone} and include actionable advice. End with a CTA to comment.',
      variables: ['topic', 'tone'],
      createdAt: '2024-01-13',
    },
  ])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedPrompt, setSelectedPrompt] = useState<PromptTemplate | null>(null)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<string>('all')
  const [copiedPrompt, setCopiedPrompt] = useState<string | null>(null)

  const categories = ['all', ...Array.from(new Set(prompts.map(p => p.category)))]

  const filteredPrompts = prompts.filter(prompt => {
    const matchesSearch = prompt.name.toLowerCase().includes(search.toLowerCase()) ||
                         prompt.template.toLowerCase().includes(search.toLowerCase())
    const matchesFilter = filter === 'all' || prompt.category === filter
    return matchesSearch && matchesFilter
  })

  const openModal = (prompt?: PromptTemplate) => {
    setSelectedPrompt(prompt || {
      id: Date.now().toString(),
      name: '',
      category: 'Content Creation',
      template: '',
      variables: [],
      createdAt: new Date().toISOString(),
    })
    setIsModalOpen(true)
  }

  const savePrompt = () => {
    if (!selectedPrompt) return
    
    if (prompts.find(p => p.id === selectedPrompt.id)) {
      setPrompts(prompts.map(p => p.id === selectedPrompt.id ? selectedPrompt : p))
    } else {
      setPrompts([selectedPrompt, ...prompts])
    }
    
    setIsModalOpen(false)
    setSelectedPrompt(null)
  }

  const deletePrompt = (id: string) => {
    setPrompts(prompts.filter(p => p.id !== id))
  }

  const copyToClipboard = (template: string, id: string) => {
    navigator.clipboard.writeText(template)
    setCopiedPrompt(id)
    setTimeout(() => setCopiedPrompt(null), 2000)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Prompt Lab
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Create and manage reusable AI prompt templates
            </p>
          </div>
          <Button onClick={() => openModal()} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            New Prompt
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search prompts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full sm:w-48"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Categories' : category}
              </option>
            ))}
          </Select>
        </div>

        {/* Prompts List */}
        <div className="space-y-3">
          {filteredPrompts.map((prompt) => (
            <Card key={prompt.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                          {prompt.name}
                        </h3>
                        <Badge variant="primary" className="text-xs mt-1">
                          {prompt.category}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(prompt.template, prompt.id)}
                          className="flex items-center gap-1"
                        >
                          {copiedPrompt === prompt.id ? (
                            <>
                              <CheckCircle2 className="w-3 h-3 text-green-600" />
                              Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              Copy
                            </>
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openModal(prompt)}
                        >
                          <Edit3 className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deletePrompt(prompt.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>

                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-3 font-mono bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                      {prompt.template}
                    </p>

                    {prompt.variables.length > 0 && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 dark:text-gray-400">Variables:</span>
                        {prompt.variables.map((variable, index) => (
                          <Badge key={index} variant="warning" className="text-xs">
                            {variable}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Prompt Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setSelectedPrompt(null)
          }}
          title={selectedPrompt?.id && prompts.find(p => p.id === selectedPrompt.id) ? 'Edit Prompt' : 'New Prompt'}
        >
          {selectedPrompt && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Prompt Name *
                </label>
                <Input
                  placeholder="e.g., Thread Generator, Comment Reply"
                  value={selectedPrompt.name}
                  onChange={(e) => setSelectedPrompt({ ...selectedPrompt, name: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Category
                </label>
                <Select
                  value={selectedPrompt.category}
                  onChange={(e) => setSelectedPrompt({ ...selectedPrompt, category: e.target.value })}
                >
                  <option value="Content Creation">Content Creation</option>
                  <option value="Engagement">Engagement</option>
                  <option value="Analytics">Analytics</option>
                  <option value="Revenue">Revenue</option>
                  <option value="Other">Other</option>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Prompt Template *
                </label>
                <Textarea
                  placeholder="Create a prompt template using {variable} placeholders..."
                  value={selectedPrompt.template}
                  onChange={(e) => {
                    setSelectedPrompt({ 
                      ...selectedPrompt, 
                      template: e.target.value,
                      variables: (e.target.value.match(/\{([^}]+)\}/g) || []).map(v => v.slice(1, -1))
                    })
                  }}
                  rows={6}
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Use {'{'}variable{'}'} syntax for dynamic variables
                </p>
              </div>

              {selectedPrompt.variables.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Detected Variables
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {selectedPrompt.variables.map((variable, index) => (
                      <Badge key={index} variant="warning">
                        {variable}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
                <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={savePrompt}
                  disabled={!selectedPrompt.name.trim() || !selectedPrompt.template.trim()}
                >
                  Save Prompt
                </Button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </DashboardLayout>
  )
}