'use client'

import Link from 'next/link'

import { FooterNewsletterForm } from "./footer-newsletter-form";
import { ArrowRight } from 'lucide-react';
import { AdBanner } from './ads/AdBanner';
import { AdvertiseCTA } from './advertise-cta';

export function Footer() {


  const links = [
    { label: "Style", href: "/style" },
    { label: "Culture", href: "/culture" },
    { label: "Business & Money", href: "/business_and_money" },
    { label: "Shop", href: "../shop" },
    { label: "Advertise", href: "../advertise" },
  ];

  return (
    <footer className="bg-black-primary border-t border-border">
      <AdBanner className="py-8 border-b border-border" />
      <AdBanner className="py-8 border-b border-border" />


      {/* Main Footer Content */}
      <div className="border-b border-border px-4 sm:px-6 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto">
          <AdvertiseCTA />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">

            {/* Quick Links (Left) */}
            <div className="lg:col-span-5 order-2 md:order-1">
              <h3 className="text-xl sm:text-2xl font-bold tracking-widest mb-4 sm:mb-6">EXPLORE</h3>
              <div className="grid grid-cols-2 gap-x-6 sm:gap-x-8 gap-y-4">
                <div>
                  <p className="text-xs font-bold tracking-widest text-gold-primary mb-3 sm:mb-4">CONTENT</p>
                  <ul className="space-y-2 sm:space-y-3">
                    {links.map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href.startsWith("..") ? link.href.replace("..", "") : `/articles${link.href}`}
                          className="text-sm sm:text-base text-muted-foreground hover:text-gold-primary transition-colors block"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-bold tracking-widest text-gold-primary mb-3 sm:mb-4">COMPANY</p>
                  <ul className="space-y-2 sm:space-y-3">
                    <li><Link href="/about" className="text-sm sm:text-base text-muted-foreground hover:text-gold-primary transition-colors block">About Us</Link></li>
                    <li><Link href="/contact" className="text-sm sm:text-base text-muted-foreground hover:text-gold-primary transition-colors block">Contact</Link></li>
                    <li><Link href="/privacy" className="text-sm sm:text-base text-muted-foreground hover:text-gold-primary transition-colors block">Privacy Policy</Link></li>
                    <li><Link href="/terms" className="text-sm sm:text-base text-muted-foreground hover:text-gold-primary transition-colors block">Terms</Link></li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Newsletter Section (Right on desktop) */}
            <div className='lg:col-span-7 order-1 md:order-2'>
              <h3 className="text-xl sm:text-2xl font-bold tracking-widest mb-3 sm:mb-4">NEWSLETTER</h3>
              <p className="text-muted-foreground mb-4 sm:mb-6 text-sm sm:text-base leading-relaxed">
                Subscribe to receive curated stories, exclusive insights, and the latest luxury trends directly to your inbox.
              </p>
              <FooterNewsletterForm />
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
