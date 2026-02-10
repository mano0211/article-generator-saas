import { google } from '@ai-sdk/google';
import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// Allow streaming responses up to 60 seconds
export const maxDuration = 60;

export async function POST(req: Request) {
  // 1. Get User Input
  const { prompt, model } = await req.json();
  const cookieStore = await cookies();

  // 2. Setup Supabase Client (This was missing in your screenshot!)
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Ignored
          }
        },
      },
    }
  );

  // 3. Auth & Credit Check
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return new Response('Unauthorized', { status: 401 });
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('credits')
    .eq('id', user.id)
    .single();

  if (!profile || profile.credits < 1) {
    return new Response('Insufficient Credits', { status: 403 });
  }

  // 4. Select Model
  let selectedModel;
  if (model === 'gemini') {
    // This automatically uses the GOOGLE_GENERATIVE_AI_API_KEY from your .env.local
    selectedModel = google('gemini-2.0-flash');
  } else {
    selectedModel = openai('gpt-4o-mini');
  }

  // 5. Stream & Save
  const result = streamText({
    model: selectedModel,
    prompt: prompt,
    onFinish: async ({ text }) => {
      // This runs when the article is done
      try {
        await supabase.from('articles').insert({
          user_id: user.id,
          title: prompt.substring(0, 50) + "...",
          content: text
        });
        
        await supabase.from('profiles').update({ 
          credits: profile.credits - 1 
        }).eq('id', user.id);
        
        console.log("✅ Saved article & deducted credit");
      } catch (e) {
        console.error("Save failed:", e);
      }
    }
  });

  // 6. Return the stream
  // This function exists in the new 'ai' package you just installed
return result.toTextStreamResponse();
}
