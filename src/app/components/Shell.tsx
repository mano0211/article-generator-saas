'use client'

import { useState } from 'react'
import Sidebar from './Sidebar'
import UserBadge from './UserBadge' // 👈 Import the Badge

export default function Shell({ children }: { children: React.ReactNode }) {
  // ✅ Keep sidebar open by default for the dashboard look
  const [isOpen, setIsOpen] = useState(true)

  return (
    <div className="flex min-h-screen bg-transparent text-[var(--foreground)]">
      
      {/* 1. Sidebar */}
      <Sidebar isOpen={isOpen} close={() => setIsOpen(false)} />

      {/* 2. Hamburger Button (Visible only when closed) */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)} 
          className="fixed top-6 left-6 z-50 p-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-md transition-all hover:text-blue-500"
        >
          ☰
        </button>
      )}

      {/* 3. Main Content Wrapper */}
      <main 
        className={`relative flex-1 transition-all duration-300 ease-in-out ${
          isOpen ? 'ml-64 w-[calc(100%-16rem)]' : 'ml-0 w-full'
        }`}
      >
        
        {/* 👇 ADDED: Pro Badge in Top Right Corner */}
        <div className="absolute top-6 right-6 z-50">
          <UserBadge />
        </div>

        <div className="min-h-screen w-full">
          {children}
        </div>
      </main>
      
    </div>
  )
}