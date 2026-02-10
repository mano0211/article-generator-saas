'use client'

import { createBrowserClient } from '@supabase/ssr'

export default function GoogleButton() {
  const handleGoogleLogin = async () => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        // This must match the URL you put in Google Cloud Console
        redirectTo: `${location.origin}/auth/callback`,
      },
    })
  }

  return (
    <button
      onClick={handleGoogleLogin}
      className="flex items-center justify-center gap-3 w-full bg-white text-black p-3 rounded-lg font-medium hover:bg-gray-200 transition mb-4"
    >
      <img 
        src="https://authjs.dev/img/providers/google.svg" 
        alt="Google logo" 
        className="w-5 h-5" 
      />
      Continue with Google
    </button>
  )
}