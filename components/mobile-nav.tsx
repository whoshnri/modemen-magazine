'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

const navItems = [
  { label: 'ARTICLES', href: '/articles' },
  { label: 'FASHION', href: '/fashion' },
  { label: 'LIFESTYLE', href: '/lifestyle' },
  { label: 'BEAUTY', href: '/beauty' },
  { label: 'CULTURE', href: '/culture' },
]

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="md:hidden flex items-center">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex flex-col gap-1.5 p-2"
        aria-label="Toggle menu"
      >
        <motion.div
          className="w-6 h-0.5 bg-foreground"
          animate={isOpen ? { rotate: 45, y: 10 } : { rotate: 0, y: 0 }}
          transition={{ duration: 0.3 }}
        />
        <motion.div
          className="w-6 h-0.5 bg-foreground"
          animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
        <motion.div
          className="w-6 h-0.5 bg-foreground"
          animate={isOpen ? { rotate: -45, y: -10 } : { rotate: 0, y: 0 }}
          transition={{ duration: 0.3 }}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 top-[120px] bg-black-primary border-t border-border z-40"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <nav className="flex flex-col">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="block px-6 py-4 text-sm font-bold tracking-widest border-b border-border hover:bg-black-secondary hover:text-gold-primary transition-colors"
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
