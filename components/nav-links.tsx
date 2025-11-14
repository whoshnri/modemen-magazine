"use client";

import Link from "next/link";

export function NavLinks() {
  const links = [
    { label: "Business", href: "/business" },
    { label: "Entertainment", href: "/entertainment" },
    { label: "Events", href: "/events" },
    { label: "Health", href: "/health" },
    { label: "Politics", href: "/politics" },
    { label: "Sports", href: "/sports" },
    { label: "Fashion", href: "/fashion" },
    { label: "Trending", href: "/trending" },
    { label: "SHOP", href: "/shop" },
  ];

  return (
    <nav className="flex items-center gap-12">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="text-sm font-medium tracking-widest text-foreground hover:text-gold-primary transition-colors duration-500 uppercase hover:underline underline-offset-7"
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
