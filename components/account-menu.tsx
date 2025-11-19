"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "@/hooks/use-session";

export function AccountMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { session } = useSession();

  

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
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
      </button>

      {isOpen && session == null && (
        <div className="absolute right-0 mt-4 w-48 bg-black-secondary border border-border">
          <Link
            href="/login"
            className="block px-4 py-3 text-sm text-foreground hover:bg-black-tertiary hover:text-gold-primary transition-colors"
          >
            LOGIN
          </Link>
          <Link
            href="/signup"
            className="block px-4 py-3 text-sm text-foreground hover:bg-black-tertiary hover:text-gold-primary transition-colors border-t border-border"
          >
            SIGN UP
          </Link>
        </div>
      )}
      {isOpen && session !== null && (
        <div className="absolute right-0 mt-4 w-48 bg-black-secondary border border-border">
          <Link
            href="/profile"
            className="block px-4 py-3 text-sm text-foreground hover:bg-black-tertiary hover:text-gold-primary transition-colors uppercase"
          >
            {session.name?.split(" ")[0]}&apos;s Profile
          </Link>
        </div>
      )}
    </div>
  );
}
