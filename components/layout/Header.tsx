'use client'

import { useUIStore } from '@/lib/store'
import { useQuickCaptureStore } from '@/lib/store'
import { Bell, Plus, Search } from 'lucide-react'
import { Button } from '@/components/ui'

export function Header() {
  const { sidebarOpen, setSidebarOpen } = useUIStore()
  const { open } = useQuickCaptureStore()

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 h-16 sticky top-0 z-30">
      <div className="flex items-center justify-between h-full px-6">
        {/* Left side */}
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          {/* Search */}
          <div className="hidden md:flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded-lg w-96">
            <Search className="w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent border-none outline-none text-sm flex-1 text-gray-900 dark:text-white placeholder-gray-500"
            />
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Quick Capture Button */}
          <Button 
            variant="primary" 
            size="sm"
            onClick={open}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Quick Capture
          </Button>

          {/* Notifications */}
          <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg relative">
            <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          {/* User avatar */}
          <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-sm cursor-pointer">
            F
          </div>
        </div>
      </div>
    </header>
  )
}