'use client';

import { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import Link from 'next/link';
import Image from 'next/image'; 
import brainLogo from '../../assets/logo.png'; 

export default function Generator() {
  const [input, setInput] = useState('');
  const [completion, setCompletion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [recentArticles, setRecentArticles] = useState<any[]>([]);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const fetchRecent = async () => {
      const yesterday = new Date();
      yesterday.setHours(yesterday.getHours() - 24);
      const { data } = await supabase
        .from('articles')
        .select('*')
        .gte('created_at', yesterday.toISOString()) 
        .order('created_at', { ascending: false });

      if (data) setRecentArticles(data);
    };
    fetchRecent();
  }, []);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input) return;

    setIsLoading(true);
    setCompletion('');
    
    const tempTitle = input.substring(0, 50) + "...";

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: input, model: 'gemini' }),
      });

      if (!response.body) return;

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let fullText = '';

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunkValue = decoder.decode(value, { stream: true });
        fullText += chunkValue;
        setCompletion((prev) => prev + chunkValue);
      }

      const { data: savedArticle, error } = await supabase
        .from('articles')
        .insert([{ 
           title: tempTitle, 
           content: fullText, 
        }])
        .select()
        .single();

      if (!error && savedArticle) {
        setRecentArticles(prev => [savedArticle, ...prev]);
      }

    } catch (error) {
      console.error("Stream Error:", error);
      alert("Error generating article.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // 👇 FORCE BLACK BACKGROUND
    <div className="min-h-screen w-full bg-black text-gray-100 p-8 md:pl-72 flex flex-col items-center transition-all duration-300">
      
      <div className="w-full max-w-5xl space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* HEADER */}
        <div className="text-center space-y-6 pt-8">
          <div className="flex justify-center">
             {/* Dark Container for Logo */}
             <div className="p-4 bg-gray-900 rounded-3xl shadow-xl border border-gray-800">
              <Image 
                src={brainLogo} 
                alt="Brain Logo" 
                width={80} 
                height={80} 
                className="object-contain" 
              />
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-5xl font-black tracking-tighter text-white drop-shadow-sm">
              Article<span className="text-blue-500">Gen</span>
            </h1>
            <p className="text-lg text-gray-400 font-medium max-w-lg mx-auto leading-relaxed">
              Professional AI writing assistant.
            </p>
          </div>
        </div>

        {/* INPUT CARD */}
        <div className="relative group">
          {/* Dark Glow Effect */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-900 to-purple-900 rounded-3xl blur opacity-30 group-hover:opacity-50 transition duration-500"></div>
          
          {/* Dark Card Body */}
          <div className="relative bg-gray-900 p-8 rounded-3xl border border-gray-800 shadow-2xl">
            <form onSubmit={handleGenerate} className="flex flex-col gap-6">
              <div className="space-y-3">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Drafting Topic</label>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Describe what you want to write about..."
                  className="w-full h-32 bg-black border border-gray-800 rounded-2xl p-6 text-white placeholder-gray-600 focus:ring-2 focus:ring-blue-600/50 focus:border-blue-600 outline-none resize-none transition-all text-lg leading-relaxed"
                />
              </div>
              
              {/* High Contrast Button (White on Black) */}
              <button disabled={isLoading || !input} className="w-full py-4 bg-white hover:bg-gray-200 text-black font-bold rounded-xl shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                {isLoading ? 'Generating...' : 'Start Writing →'}
              </button>
            </form>
          </div>
        </div>

        {/* OUTPUT CARD */}
        {completion && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="p-10 bg-gray-900 rounded-3xl border border-gray-800 shadow-2xl">
               <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-800">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></span>
                <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Result</h2>
              </div>
              <div className="prose prose-lg prose-invert max-w-none leading-loose text-gray-300">
                {completion}
              </div>
            </div>
          </div>
        )}

        {/* HISTORY SECTION */}
        {recentArticles.length > 0 && (
          <div className="pt-12 w-full animate-in fade-in slide-in-from-bottom-8 duration-1000">
             <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <span className="text-2xl">📚</span> Recent History
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {recentArticles.map((article) => (
                <Link key={article.id} href={`/history/${article.id}`}>
                  <div className="group p-6 bg-gray-900/50 hover:bg-gray-900 rounded-2xl border border-gray-800 hover:border-blue-600/50 transition-all cursor-pointer hover:shadow-lg hover:-translate-y-1">
                    <h3 className="font-bold text-lg text-white group-hover:text-blue-400 transition-colors mb-2 truncate">
                      {article.title}
                    </h3>
                    <div className="text-sm text-gray-500 line-clamp-3 leading-relaxed">
                      {article.content}
                    </div>
                     <div className="mt-4 flex items-center gap-2 text-xs font-medium text-gray-600 uppercase tracking-wider">
                      <span>🕒 {new Date(article.created_at).toLocaleTimeString()}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}