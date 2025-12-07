"use client";

import Link from "next/link";
import { useSession } from "@/hooks/use-session";

export function AccountMenu() {
  const { session } = useSession();

  if (!session) {
    return (
      <Link
        href="/login"
        className="px-6 py-2 bg-white text-black-primary font-bold tracking-widest hover:bg-gold-primary transition-colors text-xs uppercase"
      >
        LOGIN
      </Link>
    );
  }

  return (
    <Link
      href="/profile"
      className="flex items-center gap-2 text-sm font-medium tracking-widest text-foreground hover:text-gold-primary transition-colors duration-300 uppercase cursor-pointer"
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    </Link>
  );
}
