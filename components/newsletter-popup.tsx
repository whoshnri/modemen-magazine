'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export function NewsletterPopup() {
  const [isVisible, setIsVisible] = useState(false)
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrollPercentage = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      
      if(localStorage.getItem("remind-later") === "true" && (localStorage.getItem("show-again-timestamp") === null || Date.now() >= parseInt(localStorage.getItem("show-again-timestamp")!))) {
        setIsVisible(false)
      }
      
      if (scrollPercentage > 30 && !isVisible && !localStorage.getItem('newsletter-dismissed') && !(localStorage.getItem("remind-later") === "true" && (localStorage.getItem("show-again-timestamp") === null || Date.now() < parseInt(localStorage.getItem("show-again-timestamp")!)))) {
        setIsVisible(true)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isVisible])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setSubmitted(true)
      setTimeout(() => {
        setIsVisible(false)
        localStorage.setItem('newsletter-dismissed', 'true')
      }, 2000)
    }
  }

  const handleRemindLater = () => {
    setIsVisible(false)
    localStorage.setItem('remind-later', 'true')
    localStorage.setItem("show-again-timestamp", (Date.now() + 24 * 60 * 60 * 1000).toString())
  }

  const handleClose = () => {
    setIsVisible(false)
    localStorage.setItem('newsletter-dismissed', 'true')
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black-primary bg-opacity-80 backdrop-blur-sm px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="bg-black-secondary border border-border max-w-md w-full"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors text-2xl leading-none"
            >
              ×
            </button>

            <div className="p-8">
              <h2 className="text-3xl font-bold tracking-widest mb-3">Never Lose Touch! </h2>
              <p className="text-muted-foreground mb-6">
                Subscribe to Mode Men Mag for exclusive style tips, insider fashion trends, and curated luxury lifestyle content delivered directly to your inbox.
              </p>

              {submitted ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-6"
                >
                  <p className="text-gold-primary font-bold text-lg mb-2">Thank you!</p>
                  <p className="text-sm text-muted-foreground">Check your email for exclusive offers</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 bg-black-primary border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:border-gold-primary transition-colors text-sm"
                    required
                  />
                  <button
                    type="submit"
                    className="w-full px-4 py-3 bg-gold-primary text-black-primary font-bold tracking-widest hover:bg-gold-secondary transition-colors text-sm"
                  >
                    SUBSCRIBE
                  </button>
                </form>
              )}

              {!submitted && (
                <button
                  onClick={handleRemindLater}
                  className="w-full mt-4 py-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Remind me later
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
