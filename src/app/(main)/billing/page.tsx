'use client'
export const dynamic = 'force-dynamic';
import { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import FadeIn from '../../components/FadeIn';
import CheckoutButton from '../../components/checkoutbutton'; // 👈 Import the new button

export default function BillingPage() {
  const [isPremium, setIsPremium] = useState(false);

  // 👇 1. FETCH USER STATUS ON LOAD
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
    };

    checkUser();
  }, []);

  const plans = [
    {
      name: 'Free',
      price: '$0',
      credits: '3 Credits / mo',
      features: ['Gemini Flash Model', 'Standard Speed', 'Public History'],
      current: true, // This logic assumes everyone starts on Free
      color: 'bg-gray-800',
      priceId: null 
    },
    {
      name: 'Pro',
      price: '$10',
      credits: '10k credits / mo',
      features: ['Gemini 2.0 (Best Quality)', 'Fast Generation', 'Private History', 'Priority Support'],
      popular: true,
      color: 'bg-blue-600',
      priceId: 'price_1SsYhH3E4ySg0YaxQzbDtalm' 
    },
    {
      name: 'Enterprise',
      price: '$99',
      credits: '100k credits',
      features: ['Custom AI Models', 'API Access', 'SSO Integration', '24/7 Support'],
      color: 'bg-purple-600',
      priceId: 'price_1SsYkK3E4ySg0YaxUXGp6cF0' 
    }
  ]

  return (
    <div className="min-h-screen bg-black text-white p-10">
      <div className="max-w-5xl mx-auto text-center">
        
        <FadeIn>
          <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
            Upgrade your Plan
          </h1>
          <p className="text-gray-400 text-xl mb-16">
            Unlock more credits and premium AI features.
          </p>
        </FadeIn>

         <div className="bg-yellow-500/10 border border-yellow-500/50 text-yellow-200 p-4 rounded-lg mb-8 text-center">
           <p className="font-bold">⚠️ Demo Mode Only</p>
           <p className="text-sm">
           Do not use a real credit card. Use Stripe Test Card: <span className="font-mono bg-black/30 px-2 py-1 rounded">4242 4242 4242 4242</span>
           </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <FadeIn key={plan.name} delay={index * 0.1}>
              <div className={`relative p-8 rounded-2xl border ${plan.popular ? 'border-blue-500 shadow-2xl shadow-blue-900/40' : 'border-gray-800 bg-gray-900/50'} flex flex-col h-full transition-transform hover:-translate-y-2`}>
                
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg">
                    MOST POPULAR
                  </div>
                )}

                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="text-4xl font-bold mb-6">{plan.price} <span className="text-lg text-gray-500 font-normal">/mo</span></div>
                
                <div className="flex-1 space-y-4 mb-8 text-left">
                  <p className="font-bold text-white">{plan.credits}</p>
                  {plan.features.map(feature => (
                    <div key={feature} className="flex items-center gap-3 text-gray-400">
                      <span className="text-green-500">✓</span>
                      {feature}
                    </div>
                  ))}
                </div>

                {/* 👇 SWITCHED TO SMART BUTTON */}
                {plan.priceId ? (
                  <CheckoutButton 
                    priceId={plan.priceId}
                    isPremium={isPremium}
                    planName={plan.name}
                  />
                ) : (
                  <button 
                    disabled
                    className="w-full py-3 rounded-xl font-bold bg-gray-700 text-gray-400 cursor-not-allowed"
                  >
                    Current Plan
                  </button>
                )}

              </div>
            </FadeIn>
          ))}
        </div>

      </div>
    </div>
  )
}