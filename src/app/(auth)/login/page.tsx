import Link from 'next/link'
import { login } from '@/app/actions/auth' 
import GoogleLogin from '@/app/components/GoogleLogin'

// 1. Make the component async
export default async function LoginPage(props: { searchParams: Promise<{ error?: string }> }) {
  // 2. Await the params before using them (Next.js 15 requirement)
  const searchParams = await props.searchParams;
  const error = searchParams?.error;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white">
      <div className="w-full max-w-md p-8 border border-gray-800 rounded-lg bg-gray-900 shadow-xl">
        <h1 className="text-2xl font-bold mb-6 text-center">Welcome Back</h1>
        
        {/* Error Message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded mb-4 text-sm text-center">
            {error}
          </div>
        )}

        {/* Google Login Button */}
        <GoogleLogin />

        <div className="flex items-center gap-4 my-6">
          <div className="h-px bg-gray-800 flex-1" />
          <span className="text-gray-500 text-sm font-medium">OR</span>
          <div className="h-px bg-gray-800 flex-1" />
        </div>

        <form action={login} className="flex flex-col gap-4">
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-gray-400">Email</span>
            <input 
              name="email" 
              type="email" 
              className="bg-gray-800 border border-gray-700 p-3 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-600 outline-none transition" 
              required 
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-gray-400">Password</span>
            <input 
              name="password" 
              type="password" 
              className="bg-gray-800 border border-gray-700 p-3 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-600 outline-none transition" 
              required 
            />
          </label>

          <button className="bg-blue-600 text-white p-3 rounded-lg mt-2 hover:bg-blue-700 transition font-medium shadow-lg shadow-blue-900/20">
            Sign In
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-400">
          Don't have an account?{' '}
          <Link href="/signup" className="text-blue-400 hover:text-blue-300 font-medium hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  )
}