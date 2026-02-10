'use client'

import { Suspense } from 'react' // 👈 Import this
import Generator from "../components/Generator"

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white p-4">
      {/* 👇 Wrap the Generator in Suspense */}
      <Suspense fallback={<div className="text-white text-center p-10">Loading Generator...</div>}>
        <Generator />
      </Suspense>
    </div>
  )
}