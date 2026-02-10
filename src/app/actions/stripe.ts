'use server'

import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!|| 'sk_test_123', {
  apiVersion: '2026-01-28.clover',
});

export async function checkout(formData: FormData) {
  const priceId = formData.get('priceId') as string;
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll() { return cookieStore.getAll() } } }
  );

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/auth');
  }

  // 👇 CRITICAL: COPY THE ID FROM YOUR TERMINAL AND PASTE IT HERE!
  // Based on your screenshot, it looked like: price_1SsYkK3E4ySg0YaxUXGp6cF0
  const ENTERPRISE_ID_99 = "price_1SsYkK3E4ySg0YaxUXGp6cF0"; 

  console.log("-----------------------------------------");
  console.log("⚡ SERVER ACTION CHECKOUT HIT!");
  console.log("User Clicked: ", priceId);
  console.log("Is Enterprise?:", priceId === ENTERPRISE_ID_99);
  console.log("-----------------------------------------");

  let creditsToGive = 10000;
  if (priceId === ENTERPRISE_ID_99) {
    creditsToGive = 100000;
  }

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    // 👇 FIXED: Removed '/dashboard' because your app is on the home page '/'
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/billing?canceled=true`,
    customer_email: user.email,
    metadata: {
      userId: user.id,
      credits: creditsToGive, 
    },
  });

  if (session.url) {
    redirect(session.url);
  }
}