'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      const cookieAccepted = localStorage.getItem('cookie-accepted')
      if (!cookieAccepted) {
        setIsVisible(true)
      }
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  const handleAccept = () => {
    localStorage.setItem('cookie-accepted', 'true')
    setIsVisible(false)
  }

  return (
    <>
      {isVisible && (
        <motion.div
          className="fixed bottom-0 left-0 right-0 z-40 bg-black-secondary border-t border-border px-6 py-6"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
            <p className="text-sm text-muted-foreground flex-1">
              We use cookies to enhance your experience and analyze site usage. By continuing, you accept our{' '}
              <a href="#" className="text-gold-primary hover:text-gold-secondary transition-colors">
                Terms & Privacy Policy
              </a>
            </p>
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <button
                onClick={handleAccept}
                className="flex-1 sm:flex-none px-6 py-3 bg-gold-primary text-black-primary font-bold tracking-widest hover:bg-gold-secondary transition-colors text-sm"
              >
                ACCEPT
              </button>
              <button
                onClick={() => setIsVisible(false)}
                className="flex-1 sm:flex-none px-6 py-3 border border-border text-foreground font-bold tracking-widest hover:border-gold-primary transition-colors text-sm"
              >
                DECLINE
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </>
  )
}
