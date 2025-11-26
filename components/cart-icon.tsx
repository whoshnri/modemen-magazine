'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useShop } from './shop-context'
import { Poppins } from 'next/font/google'


const PoppinsFont = Poppins({
  weight: ['400', '700'],
  subsets: ['latin'],
})

export function CartIcon() {
  const { cart,itemCount } = useShop()



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
      {itemCount > 0 && (
        <span className={`${PoppinsFont.className} absolute -top-2 -right-2 bg-white group-hover:bg-gold-primary text-black-primary text-xs w-5 h-5 rounded-full flex items-center justify-center border-2 border-black-primary transition-colors duration-300 font-black`}>
          {itemCount}
        </span>
      )}
    </Link>
  )
}
