'use client'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => setLoading(false), 1500)
  }

  return (
    <div className="min-h-screen bg-black-primary flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-12 sm:py-16">
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="border border-border p-8 sm:p-12">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-widest mb-2 text-center">WELCOME</h1>
            <p className="text-center text-muted-foreground mb-8">Sign in to your Mode Men Mag account</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-bold tracking-widest text-gold-primary mb-3">EMAIL</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 bg-black-secondary border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:border-gold-primary transition-colors text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold tracking-widest text-gold-primary mb-3">PASSWORD</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-black-secondary border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:border-gold-primary transition-colors text-sm"
                  required
                />
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 bg-black-secondary border border-border" />
                  <span className="text-muted-foreground">Remember me</span>
                </label>
                <a href="#" className="text-gold-primary hover:text-gold-secondary transition-colors">
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gold-primary text-black-primary font-bold tracking-widest hover:bg-gold-secondary transition-colors disabled:opacity-50"
              >
                {loading ? 'SIGNING IN...' : 'SIGN IN'}
              </button>
            </form>

            <div className="mt-8 pt-8 border-t border-border text-center">
              <p className="text-sm text-muted-foreground mb-4">
                Don't have an account?{' '}
                <Link href="/signup" className="text-gold-primary hover:text-gold-secondary transition-colors">
                  Create one
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  )
}
