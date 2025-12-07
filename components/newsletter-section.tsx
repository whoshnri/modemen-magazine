'use client'

import { useState, useTransition } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { subscribeToNewsletter } from '@/app/actions/cms/newsletter'
import { useToast } from '@/components/toast/use-toast'

type NewsletterSectionProps = {
  heading?: string
  tagline?: string
  messageUnderInput?: string
  buttonText?: string
  showRemindLater?: boolean
}

export function NewsletterSection({
  heading = "Never Lose Touch!",
  tagline = "Subscribe for exclusive updates delivered directly to your inbox.",
  messageUnderInput = "We respect your privacy. No spam — ever.",
  buttonText = "SUBSCRIBE",
  showRemindLater = false,
}: NewsletterSectionProps) {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [isPending, startTransition] = useTransition()
  const { showToast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      startTransition(async () => {
        const result = await subscribeToNewsletter(email);
        if (result.error) {
          showToast(result.error, 'error');
        } else if (result.success) {
          setSubmitted(true)
          showToast(result.success, 'success');
          setTimeout(() => {
            setSubmitted(false)
            setEmail('')
          }, 3500)
        }
      });
    }
  }

  return (
    <section className="bg-black-secondary border border-border p-8 max-w-2xl w-full mx-auto ">
      <h2 className="text-3xl font-bold tracking-widest mb-3 uppercase">{heading}</h2>
      <p className="text-muted-foreground mb-6">{tagline}</p>

      <AnimatePresence>
        {submitted ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-6"
          >
            <p className="text-gold-primary font-bold text-lg mb-2">Awesome!</p>
            <p className="text-sm text-muted-foreground">
              Check your email for exclusive offers
            </p>
          </motion.div>
        ) : (
          <>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-3 bg-black-primary border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:border-gold-primary transition-colors text-sm"
                required
                disabled={isPending}
              />
              <button
                type="submit"
                disabled={isPending}
                className="w-full px-4 py-3 bg-gold-primary text-black-primary font-bold tracking-widest hover:bg-gold-secondary transition-colors text-sm cursor-pointer disabled:opacity-50"
              >
                {isPending ? 'SUBSCRIBING...' : buttonText}
              </button>
            </form>

            <p className="text-sm text-center text-muted-foreground mt-2">{messageUnderInput}</p>

            {showRemindLater && (
              <button
                onClick={() => alert("Remind later logic here")}
                className="w-full mt-4 py-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Remind me later
              </button>
            )}
          </>
        )}
      </AnimatePresence>
    </section>
  )
}
