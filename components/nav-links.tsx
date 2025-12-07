"use client";

import Link from "next/link";
import { SearchBar } from "./search-bar";

export function NavLinks() {
  const links = [
    { label: "Style", href: "/articles/style" },
    { label: "Grooming", href: "/articles/grooming" },
    { label: "Culture", href: "/articles/culture" },
    { label: "Business & Money", href: "/articles/business-and-money" },
    { label: "Life", href: "/articles/life" },
    { label: "Tech & Innovation", href: "/articles/tech-and-innovation" },
    { label: "Shop", href: "/shop" },
    { label: "Advertise", href: "/advertise" },
  ];

  return (
    <nav className="flex items-center gap-12">
      {links.map((link) => (
        <Link
          key={link.href}
          href={`${link.href}`}
          className="text-xs font-medium tracking-widest text-foreground hover:text-gold-primary transition-colors duration-500 uppercase hover:underline underline-offset-7"
        >
          {link.label}
        </Link>
      ))}
      {/* <div className="ml-4">
        <SearchBar className="w-32" />
      </div> */}
    </nav>
  );
}
