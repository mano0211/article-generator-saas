'use client';

// 👇 THIS IS THE MAGIC LINE TO FIX THE DOCKER BUILD ERROR
export const dynamic = 'force-dynamic';

import { createBrowserClient } from '@supabase/ssr';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import FadeIn from '../../components/FadeIn';

export default function HistoryPage() {
  const [articles, setArticles] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 1. Setup Supabase (Client Side)
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // 2. Fetch Data on Load
  useEffect(() => {
    const fetchArticles = async () => {
      // Check user session first
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        // Redirect if not logged in
        window.location.href = '/login';
        return;
      }

      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        setError(error.message);
      } else {
        setArticles(data || []);
      }
      setIsLoading(false);
    };

    fetchArticles();
  }, []);

  // 3. Filter Logic (The Search Bar Magic)
  const filteredArticles = articles.filter(article => {
    const term = searchQuery.toLowerCase();
    return (
      article.title?.toLowerCase().includes(term) || 
      article.content?.toLowerCase().includes(term)
    );
  });

  // 4. Delete Function (Bonus: Allow deleting from history)
  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.preventDefault(); // Stop link click
    e.stopPropagation();
    
    if (!confirm("Delete this article?")) return;

    setArticles(prev => prev.filter(a => a.id !== id)); // Optimistic update
    await supabase.from('articles').delete().eq('id', id);
  };

  return (
    <div className="min-h-screen bg-black text-white p-10">
      <div className="max-w-4xl mx-auto">
        
        {/* HEADER & SEARCH BAR */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-blue-500">My History</h1>
            <p className="text-gray-400 mt-2">Manage your generated content</p>
          </div>

          {/* ✨ SEARCH INPUT ✨ */}
          <div className="w-full md:w-72 relative">
            <input
              type="text"
              placeholder="Search history..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-900 border border-gray-800 rounded-xl py-3 pl-10 pr-4 text-white focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
            />
            {/* Search Icon */}
            <svg className="absolute left-3 top-3.5 h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* LOADING STATE */}
        {isLoading && (
          <div className="text-center py-20 text-gray-500 animate-pulse">
            Loading your articles...
          </div>
        )}

        {/* ERROR STATE */}
        {error && (
          <div className="p-4 bg-red-900/30 border border-red-800 rounded-lg text-red-200 mb-6">
            Error loading history: {error}
          </div>
        )}

        {/* EMPTY STATE (No Articles OR No Search Results) */}
        {!isLoading && filteredArticles.length === 0 ? (
          <div className="bg-gray-900 p-12 rounded-2xl border border-gray-800 text-center">
            <h2 className="text-xl font-bold text-gray-300 mb-2">
              {searchQuery ? `No results for "${searchQuery}"` : "No articles yet"}
            </h2>
            <p className="text-gray-500 mb-6">
              {searchQuery ? "Try a different search term." : "Start generating content to fill up your history!"}
            </p>
            {!searchQuery && (
              <Link href="/" className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold transition-all">
                Generate First Article
              </Link>
            )}
          </div>
        ) : (
          /* LIST OF ARTICLES */
          <div className="grid gap-6">
            {filteredArticles.map((article, index) => (
              <FadeIn key={article.id} delay={index * 0.05}>
                <Link 
                  href={`/history/${article.id}`}
                  className="block relative bg-gray-900/50 border border-gray-800 p-6 rounded-2xl hover:border-blue-500 hover:shadow-lg hover:shadow-blue-900/20 transition-all group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold group-hover:text-blue-400 transition-colors pr-8">
                      {article.title}
                    </h3>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono text-gray-500 bg-black/50 px-2 py-1 rounded whitespace-nowrap">
                        {new Date(article.created_at).toLocaleDateString()}
                      </span>
                      
                      {/* DELETE BUTTON */}
                      <button 
                        onClick={(e) => handleDelete(article.id, e)}
                        className="text-gray-600 hover:text-red-500 transition-colors p-1"
                        title="Delete Article"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  
                  <div className="text-gray-400 text-sm line-clamp-3">
                    {article.content}
                  </div>
                </Link>
              </FadeIn>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}