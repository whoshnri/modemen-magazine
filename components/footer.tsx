'use client'

import Link from 'next/link'

import { FooterNewsletterForm } from "./footer-newsletter-form";

export function Footer() {


  const links = [
    { label: "Business", href: "/business" },
    { label: "Entertainment", href: "/entertainment" },
    { label: "Events", href: "/events" },
    { label: "Health", href: "/health" },
    { label: "Politics", href: "/politics" },
    { label: "Sports", href: "/sports" },
    { label: "Fashion", href: "/fashion" },
  ];

  return (
    <footer className="bg-black-primary border-t border-border">
      {/* Store Section */}
      <div className="border-b border-border px-4 sm:px-6 py-8 sm:py-12">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-2xl sm:text-3xl font-bold tracking-widest mb-6 sm:mb-8">CURATED STORE</h3>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            <a href="/store/watches" className="group">
              <div className="border border-border p-4 sm:p-6 hover:border-gold-primary transition-colors">
                <p className="text-sm sm:text-base font-bold tracking-widest group-hover:text-gold-primary transition-colors">WATCHES</p>
                <p className="text-xs text-muted-foreground mt-2">Luxury Timepieces</p>
              </div>
            </a>
            <a href="/store/accessories" className="group">
              <div className="border border-border p-4 sm:p-6 hover:border-gold-primary transition-colors">
                <p className="text-sm sm:text-base font-bold tracking-widest group-hover:text-gold-primary transition-colors">ACCESSORIES</p>
                <p className="text-xs text-muted-foreground mt-2">Premium Essentials</p>
              </div>
            </a>
            <a href="/store/fashion" className="group">
              <div className="border border-border p-4 sm:p-6 hover:border-gold-primary transition-colors">
                <p className="text-sm sm:text-base font-bold tracking-widest group-hover:text-gold-primary transition-colors">FASHION</p>
                <p className="text-xs text-muted-foreground mt-2">Designer Collections</p>
              </div>
            </a>
            <a href="/store/lifestyle" className="group">
              <div className="border border-border p-4 sm:p-6 hover:border-gold-primary transition-colors">
                <p className="text-sm sm:text-base font-bold tracking-widest group-hover:text-gold-primary transition-colors">LIFESTYLE</p>
                <p className="text-xs text-muted-foreground mt-2">Luxury Living</p>
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
                        <Link href={`/articles${link.href}`} className="text-base text-muted-foreground hover:text-gold-primary transition-colors">
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
                    <li><Link href="#" className="text-base text-muted-foreground hover:text-gold-primary transition-colors">Contact</Link></li>
                    <li><Link href="#" className="text-base text-muted-foreground hover:text-gold-primary transition-colors">Privacy Policy</Link></li>
                    <li><Link href="#" className="text-base text-muted-foreground hover:text-gold-primary transition-colors">Terms & Conditions</Link></li>
                    <li><Link href="#" className="text-base text-muted-foreground hover:text-gold-primary transition-colors">Advertise</Link></li>
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
