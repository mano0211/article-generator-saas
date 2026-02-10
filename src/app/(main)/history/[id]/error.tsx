'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4 pl-72">
      <div className="bg-red-900/20 border border-red-800 p-8 rounded-2xl max-w-md text-center">
        <h2 className="text-2xl font-bold text-red-500 mb-4">Failed to load article</h2>
        <p className="text-gray-400 mb-6">
          We couldn't find that article or something went wrong while loading it.
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => reset()}
            className="px-6 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
          >
            Try Again
          </button>
          <a
            href="/history"
            className="px-6 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors"
          >
            Back to History
          </a>
        </div>
      </div>
    </div>
  )
}