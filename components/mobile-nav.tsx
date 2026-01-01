'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { SearchBar } from './search-bar'
import { Gem } from 'lucide-react'

const navItems = [
  { label: 'Style', href: '/articles/style' },
  { label: 'Culture', href: '/articles/culture' },
  { label: 'Business & Money', href: '/articles/business-money' },
  { label: 'Shop', href: '/shop' },
  { label: 'Advertise', href: '/advertise' },
]

interface props {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  bannershowing: boolean;
}

export function MobileNav({ isOpen, setIsOpen, bannershowing }: props) {

  return (
    <div className="flex items-center">
      <button
        onClick={() => setIsOpen(!isOpen)}

        className="flex flex-col gap-1.5 p-2 border border-foreground"
        aria-label="Toggle menu"
      >
        <motion.div
          className="w-6 h-0.5 bg-foreground"
          animate={isOpen ? { rotate: 45, y: 10 } : { rotate: 0, y: 0 }}
        />
        <motion.div
          className="w-6 h-0.5 bg-foreground"
          animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
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
            className={`fixed inset-0 top-16 bg-black-primary border-t border-border z-40 overflow-y-auto ${bannershowing ? 'mt-10' : ''}`}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            style={{ maxHeight: 'calc(100vh - 4rem)' }}
          >
            <nav className="flex flex-col min-h-full pb-8">
              <div className="px-6 py-4 border-b border-border">
                <SearchBar setIsOpen={setIsOpen} />
              </div>

              {navItems.map((item, index) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 + 0.1 }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="block px-6 py-4 text-sm font-bold tracking-widest border-b border-border hover:bg-black-secondary hover:text-gold-primary transition-colors uppercase"
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
