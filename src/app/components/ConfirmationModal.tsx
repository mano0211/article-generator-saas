'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

export default function ConfirmationModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message 
}: ConfirmationModalProps) {
  const [mounted, setMounted] = useState(false);

  // 👇 Wait for the browser to load before trying to teleport
  useEffect(() => {
    setMounted(true);
    // Prevent scrolling when modal is open
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  // If not loaded or not open, show nothing
  if (!mounted || !isOpen) return null;

  // 👇 THE MAGIC: 'createPortal' moves this div to document.body
  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      
      {/* Click outside to close */}
      <div 
        className="absolute inset-0" 
        onClick={onClose}
      />

      <div className="relative bg-gray-900 border border-white/10 rounded-2xl p-6 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200">
        
        {/* Title */}
        <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
          {title}
        </h3>
        
        {/* Message */}
        <p className="text-gray-400 mb-8 leading-relaxed">
          {message}
        </p>

        {/* Buttons */}
        <div className="flex gap-3 justify-end">
          <button 
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            Cancel
          </button>
          
          <button 
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg text-sm font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-500 hover:to-purple-500 shadow-lg hover:shadow-blue-500/25 transition-all"
          >
            Confirm & Pay
          </button>
        </div>

      </div>
    </div>,
    document.body // 👈 Attaches modal to the <body> tag
  );
}