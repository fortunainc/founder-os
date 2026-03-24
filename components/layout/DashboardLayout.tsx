'use client'

import { ReactNode, useEffect } from 'react'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { useUIStore } from '@/lib/store'

interface DashboardLayoutProps {
  children: ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { sidebarOpen } = useUIStore()

  useEffect(() => {
    // Close sidebar on mobile when navigating
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        useUIStore.setState({ sidebarOpen: true })
      }
    }

    window.addEventListener('resize', handleResize)
    handleResize()

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Sidebar />
      
      <main className={`
        transition-all duration-200 ease-in-out
        ${sidebarOpen ? 'lg:ml-64' : 'ml-0'}
      `}>
        <Header />
        
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  )
}