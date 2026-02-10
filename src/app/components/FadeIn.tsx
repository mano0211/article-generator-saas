'use client'

import { motion } from 'framer-motion'

export default function FadeIn({ 
  children, 
  delay = 0 
}: { 
  children: React.ReactNode
  delay?: number 
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} // Start invisible and 20px down
      animate={{ opacity: 1, y: 0 }}  // Fade in and slide up to natural position
      transition={{ 
        duration: 0.5, 
        delay: delay, 
        ease: [0.21, 0.47, 0.32, 0.98] // A custom "smooth" curve
      }}
    >
      {children}
    </motion.div>
  )
}