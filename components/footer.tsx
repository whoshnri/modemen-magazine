'use client'

import Link from 'next/link'

import { FooterNewsletterForm } from "./footer-newsletter-form";
import { ArrowRight } from 'lucide-react';

export function Footer() {


  const links = [
    { label: "Style", href: "/style" },
    { label: "Culture", href: "/culture" },
    { label: "Business & Money", href: "/business_and_money" },
    { label: "Interviews", href: "/interviews" },
    { label: "Events", href: "/events" },
    { label: "Shop", href: "/shop" },
    { label: "Advertise", href: "/advertise" },
  ];

  return (
    <footer className="bg-black-primary border-t border-border">
      {/* Store Section */}
      <div className="border-b border-border px-4 sm:px-6 py-8 sm:py-12">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-2xl sm:text-3xl font-bold tracking-widest mb-6 sm:mb-8">CURATED PICKS</h3>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            <a href="/shop/editors-picks" className="group">
              <div className="border border-border p-4 sm:p-6 hover:border-gold-primary transition-colors">
                <p className="text-sm sm:text-base font-bold tracking-widest group-hover:text-gold-primary transition-colors uppercase">EDITOR'S PICKS</p>
                <p className="text-xs text-muted-foreground mt-2">The Collection</p>
              </div>
            </a>
            <a href="/shop/gift-guide" className="group">
              <div className="border border-border p-4 sm:p-6 hover:border-gold-primary transition-colors">
                <p className="text-sm sm:text-base font-bold tracking-widest group-hover:text-gold-primary transition-colors uppercase">GIFT GUIDE</p>
                <p className="text-xs text-muted-foreground mt-2">Season's Best</p>
              </div>
            </a>
            <a href="/shop/new-arrivals" className="group">
              <div className="border border-border p-4 sm:p-6 hover:border-gold-primary transition-colors">
                <p className="text-sm sm:text-base font-bold tracking-widest group-hover:text-gold-primary transition-colors uppercase">NEW ARRIVALS</p>
                <p className="text-xs text-muted-foreground mt-2">Just In</p>
              </div>
            </a>
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="border-b border-border px-4 sm:px-6 py-8 sm:py-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:flex flex-row-reverse justify-between gap-8 sm:gap-12">
            {/* Newsletter Signup */}
            <div className='max-w-lg'>
              <h3 className="text-2xl font-bold tracking-widest mb-4">NEWSLETTER</h3>
              <p className="text-muted-foreground mb-6 text-sm sm:text-base">
                Subscribe to receive curated stories, exclusive insights, and the latest luxury trends directly to your inbox.
              </p>
              <FooterNewsletterForm />
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-2xl font-bold tracking-widest mb-6">EXPLORE</h3>
              <div className="grid grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <p className="text-xs font-bold tracking-widest text-gold-primary mb-3 sm:mb-4">CONTENT</p>
                  <ul className="space-y-2">
                    {links.map((link) => (
                      <li key={link.href}>
                        <Link href={link.href.startsWith("..") ? link.href.replace("..", "") : `/articles${link.href}`} className="text-base text-muted-foreground hover:text-gold-primary transition-colors">
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-bold tracking-widest text-gold-primary mb-3 sm:mb-4">COMPANY</p>
                  <ul className="space-y-2">
                    <li><Link href="/about" className="text-base text-muted-foreground hover:text-gold-primary transition-colors">About Us</Link></li>
                    <li><Link href="/contact" className="text-base text-muted-foreground hover:text-gold-primary transition-colors">Contact</Link></li>
                    <li><Link href="/privacy" className="text-base text-muted-foreground hover:text-gold-primary transition-colors">Privacy Policy</Link></li>
                    <li><Link href="/terms" className="text-base text-muted-foreground hover:text-gold-primary transition-colors">Terms & Conditions</Link></li>
                    <li><Link href="/advertise" className="text-base text-muted-foreground hover:text-gold-primary transition-colors">Advertise</Link></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="px-4 sm:px-6 py-6 sm:py-8">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
          <div className="text-xs sm:text-sm text-muted-foreground text-center sm:text-left">
            © 2025 Mode Men Mag. All rights reserved. | Est. 2025
          </div>
          <div className="flex gap-4 sm:gap-6">
            <a href="#" className="text-xs sm:text-sm text-muted-foreground hover:text-gold-primary transition-colors">Instagram</a>
            <a href="#" className="text-xs sm:text-sm text-muted-foreground hover:text-gold-primary transition-colors">Twitter</a>
            <a href="#" className="text-xs sm:text-sm text-muted-foreground hover:text-gold-primary transition-colors">LinkedIn</a>
            <a href="#" className="text-xs sm:text-sm text-muted-foreground hover:text-gold-primary transition-colors">YouTube</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
