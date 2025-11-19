"use client";

import Link from "next/link";

export function NavLinks() {
  const links = [
    { label: "Business", href: "/articles/business" },
    { label: "Entertainment", href: "/articles/entertainment" },
    { label: "Events", href: "/articles/events" },
    { label: "Health", href: "/articles/health" },
    { label: "Politics", href: "/articles/politics" },
    { label: "Sports", href: "/articles/sports" },
    { label: "Fashion", href: "/articles/fashion" },
    { label: "Trending", href: "/trending" },
    { label: "SHOP", href: "/shop" },
  ];

  return (
    <nav className="flex items-center gap-12">
      {links.map((link) => (
        <Link
          key={link.href}
          href={`${link.href}`}
          className="text-sm font-medium tracking-widest text-foreground hover:text-gold-primary transition-colors duration-500 uppercase hover:underline underline-offset-7"
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
