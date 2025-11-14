'use client'

import Link from 'next/link'

export function NavLinks() {
  const links = [
    { label: 'FASHION', href: '/fashion' },
    { label: 'LIFESTYLE', href: '/lifestyle' },
    { label: 'ARTICLES', href: '/articles' },
    { label: 'BEAUTY', href: '/beauty' },
    { label: 'CULTURE', href: '/culture' },
  ]

  return (
    <nav className="flex items-center gap-12">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="text-sm font-medium tracking-widest text-foreground hover:text-gold-primary transition-colors duration-300 uppercase"
        >
          {link.label}
        </Link>
      ))}
    </nav>
  )
}
