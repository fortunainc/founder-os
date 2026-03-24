'use client'

import { useState } from 'react'
import { DashboardLayout } from '@/components/layout'
import { Card, CardHeader, CardContent } from '@/components/ui'
import { Button } from '@/components/ui'
import { Input } from '@/components/ui'
import { Textarea } from '@/components/ui'
import { Badge } from '@/components/ui'
import { 
  Mic2, 
  Sparkles, 
  Save,
  CheckCircle2,
  Info
} from 'lucide-react'

export default function VoicePage() {
  const [voiceProfile, setVoiceProfile] = useState({
    tone: 'Professional but approachable',
    topics: ['productivity', 'leadership', 'remote work', 'startup lessons'],
    avoid: ['overly technical jargon', 'self-promotion'],
    examples: '',
    additionalContext: '',
  })
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    // TODO: Save to database
    setTimeout(() => {
      setIsSaving(false)
    }, 1000)
  }

  const generateExample = async () => {
    // TODO: Call AI to generate example
    const example = "Hey everyone! 👋 Just wanted to share something that's been working wonders for my productivity. I started blocking off my first hour of the day for deep work - no emails, no Slack, just me and my most important task. It's been a game-changer. What's your morning routine hack? Let me know below! ⬇️"
    setVoiceProfile({ ...voiceProfile, examples: example })
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Voice Settings
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Configure your AI voice profile for consistent content generation
          </p>
        </div>

        {/* Info Banner */}
        <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-900 dark:text-blue-300">
                  What is a Voice Profile?
                </p>
                <p className="text-xs text-blue-700 dark:text-blue-400 mt-1">
                  Your voice profile teaches the AI how you write, what topics you cover, and what to avoid. This ensures all AI-generated content sounds like you.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Voice Profile Form */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Voice Profile Configuration
            </h3>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tone & Style
              </label>
              <Input
                placeholder="e.g., Professional but approachable, Witty and casual, Vulnerable and authentic"
                value={voiceProfile.tone}
                onChange={(e) => setVoiceProfile({ ...voiceProfile, tone: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Topics You Write About
              </label>
              <Input
                placeholder="e.g., productivity, leadership, remote work (comma-separated)"
                value={voiceProfile.topics.join(', ')}
                onChange={(e) => setVoiceProfile({ 
                  ...voiceProfile, 
                  topics: e.target.value.split(',').map(t => t.trim()).filter(Boolean) 
                })}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                These topics will be prioritized in AI suggestions
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Topics to Avoid
              </label>
              <Input
                placeholder="e.g., politics, controversial topics, overly technical jargon (comma-separated)"
                value={voiceProfile.avoid.join(', ')}
                onChange={(e) => setVoiceProfile({ 
                  ...voiceProfile, 
                  avoid: e.target.value.split(',').map(t => t.trim()).filter(Boolean) 
                })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Additional Context
              </label>
              <Textarea
                placeholder="Any additional context about your voice? e.g., I use emojis sparingly, I write short punchy sentences, I often share personal stories..."
                value={voiceProfile.additionalContext}
                onChange={(e) => setVoiceProfile({ ...voiceProfile, additionalContext: e.target.value })}
                rows={4}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Example Content
                </label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={generateExample}
                  className="flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3" />
                  AI Generate Example
                </Button>
              </div>
              <Textarea
                placeholder="Paste examples of your best content here to help the AI learn your voice..."
                value={voiceProfile.examples}
                onChange={(e) => setVoiceProfile({ ...voiceProfile, examples: e.target.value })}
                rows={6}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Providing examples helps the AI understand your writing style better
              </p>
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-800">
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2"
              >
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Profile
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Current Topics */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Current Topics
            </h3>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {voiceProfile.topics.map((topic, index) => (
                <Badge key={index} variant="primary">
                  {topic}
                </Badge>
              ))}
              {voiceProfile.topics.length === 0 && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No topics configured yet
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}