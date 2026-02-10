import { google } from '@ai-sdk/google';
import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// Allow streaming for up to 60 seconds
export const maxDuration = 60;

export async function POST(req: Request) {
  // 1. Get User Input
  const { prompt, model } = await req.json();
  const cookieStore = await cookies();

  // 2. Setup Supabase to check Auth & Credits
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );

  // 3. Auth Check
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return new Response('Unauthorized: Login required.', { status: 401 });
  }

  // 4. Credit Check
  const { data: profile } = await supabase
    .from('profiles')
    .select('credits')
    .eq('id', user.id)
    .single();

  if (!profile || profile.credits < 1) {
    return new Response('Insufficient Credits. Please Upgrade.', { status: 403 });
  }

  // 5. Select Model
  let selectedModel;
  if (model === 'gemini') {
    selectedModel = google('gemini-2.0-flash'); // Using stable 2.0 Flash
  } else {
    selectedModel = openai('gpt-4o-mini');
  }

  // 6. Stream Text & Save to DB when finished
  const result = streamText({
    model: selectedModel,
    prompt: prompt,
    onFinish: async ({ text }) => {
      // This runs AUTOMATICALLY after the stream finishes
      try {
        // A. Save Article
        await supabase.from('articles').insert({
          user_id: user.id,
          title: prompt.substring(0, 50) + "...", // Use first 50 chars as title
          content: text
        });

        // B. Deduct Credit
        await supabase.from('profiles').update({ 
          credits: profile.credits - 1 
        }).eq('id', user.id);
        
        console.log("✅ Article saved and credit deducted for user:", user.id);
      } catch (err) {
        console.error("❌ Failed to save article/deduct credit:", err);
      }
    }
  });

  return result.toTextStreamResponse();
}