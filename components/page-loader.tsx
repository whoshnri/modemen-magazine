'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

export function PageLoader() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 3200)
    return () => clearTimeout(timer)
  }, [])

  if (!isLoading) return null

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-black-primary flex flex-col items-center justify-center overflow-hidden"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, delay: 2.7 }}
    >
      {/* Main text animation */}
      <motion.div
        className="text-center z-50 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <motion.h1
          className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-widest text-gold-primary mb-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          MODE
        </motion.h1>
        <motion.p
          className="text-lg sm:text-2xl tracking-widest text-foreground"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          MEN MAG
        </motion.p>
      </motion.div>

      {/* Left split screen */}
      <motion.div
        className="fixed inset-0 bg-black-primary pointer-events-none z-50"
        style={{
          left: 0,
          top: 0,
          width: '50%',
        }}
        initial={{ x: 0 }}
        animate={{ x: -100 }}
        transition={{ duration: 1.2, delay: 1.8, ease: 'easeInOut' }}
      />

      {/* Right split screen */}
      <motion.div
        className="fixed inset-0 bg-black-primary pointer-events-none z-50"
        style={{
          right: 0,
          top: 0,
          width: '50%',
        }}
        initial={{ x: 0 }}
        animate={{ x: 100 }}
        transition={{ duration: 1.2, delay: 1.8, ease: 'easeInOut' }}
      />
    </motion.div>
  )
}
