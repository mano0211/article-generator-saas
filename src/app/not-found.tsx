import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white p-4">
      <h2 className="text-4xl font-bold mb-4 text-red-500">Page Not Found</h2>
      <p className="text-gray-400 mb-8">Could not find the requested resource.</p>
      <Link 
        href="/"
        className="px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-500 transition-colors font-bold"
      >
        Return Home
      </Link>
    </div>
  )
}