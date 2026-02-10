'use client';

import { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';

export default function UserBadge() {
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('is_premium')
          .eq('id', user.id)
          .single();
        
        setIsPremium(profile?.is_premium || false);
      }
      setLoading(false);
    };

    checkUser();
  }, []);

  if (loading || !isPremium) return null;

  return (
    <div className="flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border border-amber-500/30 rounded-full shadow-[0_0_15px_rgba(245,158,11,0.15)] animate-in fade-in zoom-in duration-500">
      <span className="text-yellow-400">👑</span>
      <span className="text-xs font-bold text-yellow-200 tracking-wider uppercase drop-shadow-sm">
        PRO
      </span>
    </div>
  );
}