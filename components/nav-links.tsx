"use client";

import Link from "next/link";

export function NavLinks() {
  const links = [
    { label: "Style", href: "/articles/style" },
    { label: "Culture", href: "/articles/culture" },
    { label: "Business & Money", href: "/articles/business_and_money" },
    { label: "Shop", href: "/shop" },
    { label: "Advertise", href: "/advertise" },
  ];

  return (
    <nav className="flex items-center gap-8 lg:gap-12">
      {links.map((link) => (
        <div key={link.label} className="relative group">
          <Link
            href={link.href}
            className="flex items-center gap-1 text-xs tracking-widest text-foreground hover:text-gold-primary transition-colors duration-300 uppercase py-4"
          >
            {link.label}
          </Link>
        </div>
      ))}
    </nav>
  );
}
