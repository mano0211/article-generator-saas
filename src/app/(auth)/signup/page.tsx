import Link from 'next/link'
import { signup } from '@/app/actions/auth'
import GoogleLogin from '../../components/GoogleLogin'

// 1. Remove 'use client' (It's better as a Server Component)
// 2. Make the function 'async'
// 3. Define the props correctly for Next.js 15
export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  // 4. Await the parameters before using them
  const params = await searchParams;
  const error = params?.error;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white">
      <div className="w-full max-w-md p-8 border border-gray-800 rounded-lg bg-gray-900 shadow-xl">
        <h1 className="text-2xl font-bold mb-6 text-center">Create Account</h1>

        {/* Use the awaited 'error' variable */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded mb-4 text-sm text-center">
            {error}
          </div>
        )}

        <GoogleLogin />

        <div className="flex items-center gap-4 my-6">
          <div className="h-px bg-gray-800 flex-1" />
          <span className="text-gray-500 text-sm font-medium">OR</span>
          <div className="h-px bg-gray-800 flex-1" />
        </div>

        <form action={signup} className="flex flex-col gap-4">
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-gray-400">Full Name</span>
            <input 
              name="fullName" 
              type="text" 
              placeholder="John Doe"
              className="bg-gray-800 border border-gray-700 p-3 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-600 outline-none transition" 
              required 
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-gray-400">Email</span>
            <input 
              name="email" 
              type="email" 
              placeholder="you@example.com"
              className="bg-gray-800 border border-gray-700 p-3 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-600 outline-none transition" 
              required 
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-gray-400">Password</span>
            <input 
              name="password" 
              type="password" 
              placeholder="••••••••"
              className="bg-gray-800 border border-gray-700 p-3 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-600 outline-none transition" 
              required 
              minLength={6}
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-gray-400">Confirm Password</span>
            <input 
              name="confirmPassword" 
              type="password" 
              placeholder="••••••••"
              className="bg-gray-800 border border-gray-700 p-3 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-600 outline-none transition" 
              required 
              minLength={6}
            />
          </label>

          <button className="bg-blue-600 text-white p-3 rounded-lg mt-4 hover:bg-blue-700 transition font-medium shadow-lg shadow-blue-900/20">
            Sign Up with Email
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-400">
          Already have an account?{' '}
          <Link href="/login" className="text-blue-400 hover:text-blue-300 font-medium hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  )
}