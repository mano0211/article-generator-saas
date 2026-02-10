import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!|| 'sk_test_123', {
  apiVersion: '2026-01-28.clover', 
});

export async function POST(req: Request) {
  try {
    const { priceId, isSubscription } = await req.json();
    const cookieStore = await cookies();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { getAll() { return cookieStore.getAll() } } }
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // 👇 PASTE YOUR COPIED ID INSIDE THESE QUOTES
    // Do not use process.env anymore. Just paste the real ID string.
    const ENTERPRISE_ID_99 = "price_1SsYkK3E4ySg0YaxUXGp6cF0"; 

    console.log("-----------------------------------------");
    console.log("🔎 DEBUG MATCHING:");
    console.log("User Clicked: ", priceId);
    console.log("We Expect:    ", ENTERPRISE_ID_99);
    console.log("Match?:       ", priceId === ENTERPRISE_ID_99);
    console.log("-----------------------------------------");

    // Logic: If they match, give 100k. If not, give 10k.
    let creditsToGive = 10000; 

    if (priceId === ENTERPRISE_ID_99) {
      creditsToGive = 100000; // 100k for Enterprise
    }

    const session = await stripe.checkout.sessions.create({
      mode: isSubscription ? 'subscription' : 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/billing?canceled=true`,
      customer_email: user.email,
      metadata: {
        userId: user.id,
        credits: creditsToGive, // 👈 This is what sends the 100k
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Stripe Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}