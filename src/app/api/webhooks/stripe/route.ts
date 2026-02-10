import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { supabaseAdmin } from '../../../lib/supabaseAdmin' 

// 1. We only define the secret string here (Strings are safe during build)
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET || 'whsec_build_placeholder'

export async function POST(request: Request) {
  // 👇 2. INITIALIZE STRIPE INSIDE THE FUNCTION
  // This guarantees it NEVER runs during 'docker build'
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_build_placeholder', {
    apiVersion: '2026-01-28.clover',
  })

  const body = await request.text()
  const headerList = await headers()
  const sig = headerList.get('stripe-signature') as string

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret)
  } catch (err: any) {
    console.error(`❌ Webhook Error: ${err.message}`)
    return NextResponse.json({ error: err.message }, { status: 400 })
  }

  // Handle the event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    
    // Retrieve metadata
    const userId = session.metadata?.userId
    const creditsToAdd = Number(session.metadata?.credits || 0)

    if (userId) {
      // 1. Get current profile
      const { data: userProfile } = await supabaseAdmin
        .from('profiles')
        .select('credits')
        .eq('id', userId)
        .single()

      // 2. Add credits
      const newBalance = (userProfile?.credits || 0) + creditsToAdd

      // 3. Update Profile (Give Credits & Premium)
      const { error: profileError } = await supabaseAdmin
        .from('profiles')
        .update({ 
            credits: newBalance,
            is_premium: true 
        })
        .eq('id', userId)

      if (profileError) {
        console.error('Error updating profile:', profileError)
        return NextResponse.json({ error: 'Profile update failed' }, { status: 500 })
      }

      // 4. Save to 'payments' table
      const { error: paymentError } = await supabaseAdmin
        .from('payments')
        .insert({
            user_id: userId,
            amount: session.amount_total, 
            status: 'succeeded',
        })

      if (paymentError) {
        console.error('Error saving payment record:', paymentError)
      }
      
      console.log(`✅ Success! User ${userId} updated and payment recorded.`)
    }
  }

  return NextResponse.json({ received: true })
}