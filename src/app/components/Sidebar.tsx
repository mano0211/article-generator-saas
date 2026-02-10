'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import { useEffect, useState } from 'react'
import { logout } from '../actions/auth' 

type SidebarProps = {
  isOpen: boolean
  close: () => void
}

export default function Sidebar({ isOpen, close }: SidebarProps) {
  const pathname = usePathname()
  
  const [credits, setCredits] = useState<number | null>(null)
  const [userEmail, setUserEmail] = useState<string>('') 

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUserEmail(user.email || '') 
        const { data } = await supabase
          .from('profiles')
          .select('credits')
          .eq('id', user.id)
          .single()
        if (data) setCredits(data.credits)
      }
    }
    fetchUserData()
  }, [isOpen]) 

  const menuItems = [
    { name: 'Generator', icon: '✨', href: '/' },
    { name: 'History',   icon: '📚', href: '/history' },
    { name: 'Billing',   icon: '💎', href: '/billing' },
  ]

  return (
    // 👇 FIXED: bg-black and border-gray-800 for the main container
    <aside 
      className={`fixed left-0 top-0 h-screen p-6 z-50 transition-all duration-300 w-64 flex flex-col justify-between
        bg-black border-r border-gray-800 shadow-2xl
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}
    >
      {/* TOP SECTION */}
      <div>
        <div className="flex items-center justify-between mb-10 px-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-bold text-white shadow-lg shadow-blue-900/20">
              A
            </div>
            {/* 👇 FIXED: Force white text */}
            <span className="text-xl font-bold text-white tracking-wide">ArticleGen</span>
          </div>
          <button 
            onClick={close} 
            className="md:hidden p-2 text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                // 👇 FIXED: Dark hover states
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive 
                    ? 'bg-blue-600 text-white font-bold shadow-lg shadow-blue-900/20' 
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            )
          })}
        </nav>
      </div>

      {/* BOTTOM SECTION */}
      <div className="space-y-4">
        {/* Credits Card */}
        {/* 👇 FIXED: bg-gray-900 for card, border-gray-800 */}
        <div className="p-4 bg-gray-900 rounded-xl border border-gray-800">
          <div className="flex justify-between items-center mb-2">
            <p className="text-xs font-medium text-gray-400">Available Credits</p>
            <p className="text-xs font-bold text-blue-400">
              {credits !== null ? credits : '...'}
            </p>
          </div>
          {/* 👇 FIXED: Darker track background */}
          <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-blue-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${(credits || 0) * 20}%` }}
            ></div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-gray-800 space-y-3">
            {userEmail && (
                <p className="text-xs text-center text-gray-500 mb-2 truncate px-2">
                    {userEmail}
                </p>
            )}
            
            <form action={logout}>
                {/* 👇 FIXED: Dark red hover effect */}
                <button className="flex items-center justify-center gap-3 px-4 py-3 w-full rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-200 font-medium">
                <span>🚪</span>
                <span>Sign Out</span>
                </button>
            </form>
        </div>
      </div>
    </aside>
  )
}