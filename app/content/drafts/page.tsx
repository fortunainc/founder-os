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
import { 
  FileText, 
  Plus, 
  Sparkles,
  Eye,
  Edit3,
  Trash2,
  CheckCircle2,
  Clock
} from 'lucide-react'

interface Draft {
  id: string
  title: string
  content: string
  status: 'draft' | 'review' | 'scheduled'
  wordCount: number
  lastEdited: string
}

export default function DraftsPage() {
  const [drafts, setDrafts] = useState<Draft[]>([
    { 
      id: '1', 
      title: 'Morning Routine for Founders', 
      content: 'Your morning routine sets the tone for your entire day...',
      status: 'draft',
      wordCount: 324,
      lastEdited: '2024-01-15',
    },
    { 
      id: '2', 
      title: 'Why I Fired My First Client', 
      content: 'Sometimes the hardest decisions are the best ones...',
      status: 'review',
      wordCount: 456,
      lastEdited: '2024-01-14',
    },
  ])
  const [selectedDraft, setSelectedDraft] = useState<Draft | null>(null)
  const [isEditorOpen, setIsEditorOpen] = useState(false)
  const [isAIGenerating, setIsAIGenerating] = useState(false)

  const statusColors: Record<string, 'success' | 'warning' | 'primary' | 'danger' | 'default'> = {
    draft: 'default',
    review: 'warning',
    scheduled: 'success',
  }

  const statusLabels = {
    draft: 'Draft',
    review: 'In Review',
    scheduled: 'Scheduled',
  }

  const openEditor = (draft?: Draft) => {
    setSelectedDraft(draft || {
      id: Date.now().toString(),
      title: '',
      content: '',
      status: 'draft',
      wordCount: 0,
      lastEdited: new Date().toISOString(),
    })
    setIsEditorOpen(true)
  }

  const saveDraft = () => {
    if (!selectedDraft) return
    const updated = {
      ...selectedDraft,
      wordCount: selectedDraft.content.split(/\s+/).filter(Boolean).length,
      lastEdited: new Date().toISOString(),
    }
    
    if (drafts.find(d => d.id === selectedDraft.id)) {
      setDrafts(drafts.map(d => d.id === selectedDraft.id ? updated : d))
    } else {
      setDrafts([updated, ...drafts])
    }
    
    setIsEditorOpen(false)
    setSelectedDraft(null)
  }

  const generateWithAI = () => {
    if (!selectedDraft?.title) return
    setIsAIGenerating(true)
    // TODO: Call AI to generate content
    setTimeout(() => {
      setSelectedDraft({
        ...selectedDraft,
        content: `Here's a draft about ${selectedDraft.title}...\n\nKey point 1: The importance of this topic\n\nKey point 2: Practical examples from my experience\n\nKey point 3: Actionable takeaways for the audience\n\nThis is just a starting point - you can refine and expand based on your unique voice and experiences.`,
      })
      setIsAIGenerating(false)
    }, 1500)
  }

  const deleteDraft = (id: string) => {
    setDrafts(drafts.filter(d => d.id !== id))
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Draft Studio
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Write, edit, and refine your content
            </p>
          </div>
          <Button onClick={() => openEditor()} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            New Draft
          </Button>
        </div>

        {/* Drafts List */}
        {drafts.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="No drafts yet"
            description="Start writing your first piece of content."
            action={{
              label: 'Create Your First Draft',
              onClick: () => openEditor(),
            }}
          />
        ) : (
          <div className="space-y-3">
            {drafts.map((draft) => (
              <Card key={draft.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                          {draft.title}
                        </h3>
                        <Badge variant={statusColors[draft.status]}>
                          {statusLabels[draft.status]}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                        {draft.content}
                      </p>
                      <div className="flex items-center gap-4 mt-3 text-xs text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(draft.lastEdited).toLocaleDateString()}
                        </span>
                        <span>{draft.wordCount} words</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditor(draft)}
                      >
                        <Edit3 className="w-4 h-4" />
                      </Button>
                      <button
                        onClick={() => deleteDraft(draft.id)}
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

        {/* Editor Modal */}
        <Modal
          isOpen={isEditorOpen}
          onClose={() => {
            setIsEditorOpen(false)
            setSelectedDraft(null)
          }}
          title={selectedDraft?.id && drafts.find(d => d.id === selectedDraft.id) ? 'Edit Draft' : 'New Draft'}
        >
          {selectedDraft && (
            <div className="space-y-4">
              <Input
                placeholder="Draft title..."
                value={selectedDraft.title}
                onChange={(e) => setSelectedDraft({ ...selectedDraft, title: e.target.value })}
              />
              
              <Textarea
                placeholder="Start writing your content..."
                value={selectedDraft.content}
                onChange={(e) => setSelectedDraft({ ...selectedDraft, content: e.target.value })}
                rows={12}
              />

              <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-800">
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <span>{selectedDraft.content.split(/\s+/).filter(Boolean).length} words</span>
                  <span>•</span>
                  <span>{selectedDraft.content.length} characters</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    onClick={generateWithAI}
                    disabled={isAIGenerating || !selectedDraft.title.trim()}
                    className="flex items-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    {isAIGenerating ? 'Generating...' : 'AI Generate'}
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => setIsEditorOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    onClick={saveDraft}
                    disabled={!selectedDraft.title.trim() || !selectedDraft.content.trim()}
                  >
                    Save Draft
                  </Button>
                </div>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </DashboardLayout>
  )
}