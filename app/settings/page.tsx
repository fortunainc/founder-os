'use client'

import { useState } from 'react'
import { DashboardLayout } from '@/components/layout'
import { Card, CardHeader, CardContent } from '@/components/ui'
import { Button } from '@/components/ui'
import { Input } from '@/components/ui'
import { Badge } from '@/components/ui'
import { 
  Settings as SettingsIcon, 
  Bell, 
  Shield, 
  Key,
  Trash2, 
  Save, 
  LogOut, 
  User, 
  Globe, 
  Moon, 
  Sun
} from 'lucide-react'

export default function SettingsPage() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    dailyDigest: false,
    weeklyReport: true,
  })
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    // TODO: Save settings to database
    setTimeout(() => {
      setIsSaving(false)
    }, 1000)
  }

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
    // TODO: Apply theme to document
  }

  const toggleNotification = (key: string) => {
    setNotifications((prev: any) => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Settings
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Manage your account and preferences
          </p>
        </div>

        {/* Profile Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Profile
              </h3>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Display Name
              </label>
              <Input
                placeholder="Your name"
                defaultValue="Founder"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <Input
                type="email"
                placeholder="your@email.com"
                defaultValue="founder@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Timezone
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm">
                <option>America/New_York (EST)</option>
                <option>America/Los_Angeles (PST)</option>
                <option>Europe/London (GMT)</option>
                <option>Asia/Tokyo (JST)</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Appearance Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Appearance
              </h3>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center gap-3">
                {theme === 'light' ? (
                  <Sun className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                ) : (
                  <Moon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                )}
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Theme
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {theme === 'light' ? 'Light mode' : 'Dark mode'}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                className="flex items-center gap-2"
              >
                {theme === 'light' ? (
                  <>
                    <Moon className="w-4 h-4" />
                    Switch to Dark
                  </>
                ) : (
                  <>
                    <Sun className="w-4 h-4" />
                    Switch to Light
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Notifications Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Notifications
              </h3>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <NotificationToggle
              title="Email Notifications"
              description="Receive email updates about your activity"
              enabled={notifications.email}
              onToggle={() => toggleNotification('email')}
            />
            <NotificationToggle
              title="Push Notifications"
              description="Receive in-app notifications"
              enabled={notifications.push}
              onToggle={() => toggleNotification('push')}
            />
            <NotificationToggle
              title="Daily Digest"
              description="Receive a daily summary of your activity"
              enabled={notifications.dailyDigest}
              onToggle={() => toggleNotification('dailyDigest')}
            />
            <NotificationToggle
              title="Weekly Report"
              description="Receive a weekly analytics report"
              enabled={notifications.weeklyReport}
              onToggle={() => toggleNotification('weeklyReport')}
            />
          </CardContent>
        </Card>

        {/* API Keys Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Key className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                API Configuration
              </h3>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                OpenAI API Key
              </label>
              <Input
                type="password"
                placeholder="sk-..."
                defaultValue="sk-xxxxxxxxxxxxxxxx"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Used for AI features like content generation and insights
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Supabase URL
              </label>
              <Input
                type="url"
                placeholder="https://your-project.supabase.co"
                defaultValue="https://founderos.supabase.co"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Supabase Anon Key
              </label>
              <Input
                type="password"
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                defaultValue="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9"
              />
            </div>
          </CardContent>
        </Card>

        {/* AI Feature Flags */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                AI Features
              </h3>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <AIFeatureToggle title="Draft Generation" description="AI-powered content generation" />
            <AIFeatureToggle title="Content Rewrite" description="AI-powered content optimization" />
            <AIFeatureToggle title="Engagement Copilot" description="AI-powered reply suggestions" />
            <AIFeatureToggle title="AI Insights" description="AI-powered analytics and recommendations" />
            <AIFeatureToggle title="AI Follow-up Suggestions" description="AI-powered CRM follow-up recommendations" />
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-red-200 dark:border-red-800">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400" />
              <h3 className="text-lg font-semibold text-red-900 dark:text-red-400">
                Danger Zone
              </h3>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <div>
                <p className="text-sm font-medium text-red-900 dark:text-red-300">
                  Delete All Data
                </p>
                <p className="text-xs text-red-700 dark:text-red-400 mt-1">
                  Permanently delete all your data. This action cannot be undone.
                </p>
              </div>
              <Button
                variant="danger"
                size="sm"
              >
                Delete All Data
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <div>
                <p className="text-sm font-medium text-red-900 dark:text-red-300">
                  Sign Out
                </p>
                <p className="text-xs text-red-700 dark:text-red-400 mt-1">
                  Sign out of your account
                </p>
              </div>
              <Button
                variant="danger"
                size="sm"
                className="flex items-center gap-1"
              >
                <LogOut className="w-3 h-3" />
                Sign Out
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
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
                Save Settings
              </>
            )}
          </Button>
        </div>
      </div>
    </DashboardLayout>
  )
}

// Helper components to simplify the main component
function NotificationToggle({ title, description, enabled, onToggle }: any) {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <div>
        <p className="text-sm font-medium text-gray-900 dark:text-white">
          {title}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {description}
        </p>
      </div>
      <button
        onClick={onToggle}
        className={`w-12 h-6 rounded-full p-1 transition-colors ${
          enabled ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
        }`}
      >
        <div
          className={`w-4 h-4 rounded-full bg-white transition-transform ${
            enabled ? 'translate-x-6' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  )
}

function AIFeatureToggle({ title, description }: any) {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <div>
        <p className="text-sm font-medium text-gray-900 dark:text-white">
          {title}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {description}
        </p>
      </div>
      <Badge variant="success">Enabled</Badge>
    </div>
  )
}