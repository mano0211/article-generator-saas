'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4 ml-64">
      <h2 className="text-2xl font-bold text-red-500 mb-4">Something went wrong!</h2>
      <p className="text-gray-400 mb-4">{error.message}</p>
      <button
        onClick={() => reset()}
        className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-500"
      >
        Try again
      </button>
    </div>
  )
}