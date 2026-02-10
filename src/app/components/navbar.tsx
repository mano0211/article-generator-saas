import Link from 'next/link'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { logout } from '@/app/actions/auth'

export default async function Navbar() {
  // 1. Check Auth Status on the Server
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get(name: string) { return cookieStore.get(name)?.value } } }
  )

  const { data: { user } } = await supabase.auth.getUser()

  return (
    <nav className="flex items-center justify-between p-4 bg-gray-900 text-white">
      <Link href="/" className="text-xl font-bold">My Generator App</Link>

      <div className="flex items-center gap-4">
        {user ? (
          // IF LOGGED IN: Show Email & Sign Out Button
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-300">
              {user.email}
            </span>
            <form action={logout}>
              <button className="bg-red-500 px-4 py-2 rounded text-sm hover:bg-red-600">
                Sign Out
              </button>
            </form>
          </div>
        ) : (
          // IF LOGGED OUT: Show Login/Signup Links
          <div className="flex items-center gap-4">
            <Link href="/login" className="hover:underline">
              Sign In
            </Link>
            <Link href="/signup" className="bg-blue-600 px-4 py-2 rounded text-sm hover:bg-blue-700">
              Get Started
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}