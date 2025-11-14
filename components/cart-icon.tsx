'use client'

import Link from 'next/link'
import { useState } from 'react'

export function CartIcon() {
  const [cartCount, setCartCount] = useState(0)

  return (
    <Link href="/cart" className="relative flex items-center justify-center group">
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="text-foreground group-hover:text-gold-primary transition-colors duration-300"
      >
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </svg>
      {cartCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-gold-primary text-black-primary text-xs font-bold px-2 py-1">
          {cartCount}
        </span>
      )}
    </Link>
  )
}
