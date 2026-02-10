import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'

export default async function ArticleViewPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const cookieStore = await cookies()

  // 1. Setup Supabase
  const supabase = createServerClient( 
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) { return cookieStore.get(name)?.value },
      },
    }
  )

  // 2. Auth Check
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // 3. Fetch the Specific Article
  // We also check "user_id" to make sure users can't see each other's work!
  const { data: article, error } = await supabase
    .from('articles')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (error || !article) {
    return notFound()
  }

  return (
    <div className="min-h-screen bg-black text-white p-10">
      <div className="max-w-4xl mx-auto">
        
        {/* Back Button */}
        <Link 
          href="/history" 
          className="inline-flex items-center text-gray-400 hover:text-white mb-8 transition-colors"
        >
          ← Back to History
        </Link>

        {/* Article Header */}
        <header className="mb-10 border-b border-gray-800 pb-8">
          <h1 className="text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            {article.title}
          </h1>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span className="bg-gray-900 px-3 py-1 rounded-full border border-gray-800">
              {new Date(article.created_at).toLocaleDateString()}
            </span>
            <span>{article.content.split(' ').length} words</span>
          </div>
        </header>

        {/* Article Content (Rendered Markdown) */}
        <article className="prose prose-invert prose-lg max-w-none prose-headings:text-blue-300 prose-a:text-blue-400">
          <ReactMarkdown>{article.content}</ReactMarkdown>
        </article>

      </div>
    </div>
  )
}