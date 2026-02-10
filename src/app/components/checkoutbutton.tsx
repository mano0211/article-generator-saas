'use client';

import { useState } from 'react';
import { checkout } from '@/app/actions/stripe';
import ConfirmationModal from './ConfirmationModal'; // 👈 Import our new modal

interface CheckoutButtonProps {
  priceId: string;
  isPremium: boolean;
  planName: string;
}

export default function CheckoutButton({ priceId, isPremium, planName }: CheckoutButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    // 👇 1. DEFINE EXPENSIVE PLAN
    const ENTERPRISE_ID = 'price_1SsYkK3E4ySg0YaxUXGp6cF0';

    // 👇 2. SAFETY CHECK
    // If it is Enterprise AND they are Premium -> OPEN MODAL
    if (priceId === ENTERPRISE_ID && isPremium) {
      setIsModalOpen(true);
      return; 
    }

    // Otherwise, go straight to Stripe
    await processCheckout();
  };

  const processCheckout = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append('priceId', priceId);
    await checkout(formData);
    // Note: We don't set loading back to false because we redirect away
  };

  return (
    <>
      <button
        onClick={handleSubscribe}
        disabled={loading}
        className="w-full py-3 bg-white text-black hover:bg-gray-200 font-bold rounded-xl transition-all shadow-lg hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Processing...' : (isPremium ? `Buy ${planName} Again` : 'Upgrade Now')}
      </button>

      {/* 👇 RENDER THE MODAL */}
      <ConfirmationModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={processCheckout}
        title="⚠️ Active Subscription Found"
        message={`You are already a Premium Member. Purchasing the ${planName} again will add 100,000 credits to your existing balance. Do you want to proceed?`}
      />
    </>
  );
}