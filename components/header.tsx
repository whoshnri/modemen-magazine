"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { HeaderLogo } from "./header-logo";
import { NavLinks } from "./nav-links";
import { CartIcon } from "./cart-icon";
import { AccountMenu } from "./account-menu";
import { MobileNav } from "./mobile-nav";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { NewsletterPopup } from "./newsletter-popup";

function ExpandingSearch() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpanded]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/articles?search=${encodeURIComponent(query)}`);
      setIsExpanded(false);
      setQuery("");
    }
  };

  const handleBlur = (e: React.FocusEvent) => {
    if (!query) {
      setIsExpanded(false);
    }
  };

  return (
    <div className="relative flex items-center">
      <AnimatePresence initial={false} mode="wait">
        {!isExpanded ? (
          <motion.button
            key="icon"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            onClick={() => setIsExpanded(true)}
            className="text-foreground hover:text-gold-primary transition-colors p-2"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </motion.button>
        ) : (
          <motion.form
            key="input"
            initial={{ width: 40, opacity: 0 }}
            animate={{ width: 200, opacity: 1 }}
            exit={{ width: 40, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            onSubmit={handleSearch}
            className="relative flex items-center"
          >
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onBlur={() => !query && setIsExpanded(false)}
              placeholder="SEARCH..."
              className="w-full bg-transparent border-b border-foreground text-foreground placeholder:text-muted-foreground text-sm py-1 pr-8 focus:outline-none uppercase tracking-widest"
            />
            <button
              type="button"
              onClick={() => { setIsExpanded(false); setQuery(""); }}
              className="absolute right-0 text-foreground hover:text-gold-primary"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6 6 18" /><path d="m6 6 12 12" />
              </svg>
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false)
  const [showNewsletter, setShowNewsletter] = useState(false)


  useEffect(() => {

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);

  }, []);

  return (
    <>
      {/* Sticky Top Bar */}
      <div className="sticky top-0 z-50 w-full bg-black-primary border-b border-border transition-all duration-300">
        <div className="px-4 sm:px-6 py-4 flex items-center justify-between gap-4 relative">

          {/* Left: Hamburger Menu OR Search & Subscribe */}
          <div className="flex-1 flex justify-start items-center">
            {/* Hamburger: Visible on Mobile OR when Scrolled on Desktop OR when Menu is Open */}
            <div className={`${isScrolled || isOpen ? 'block' : 'md:hidden block'}`}>
              <MobileNav isOpen={isOpen} setIsOpen={setIsOpen} />
            </div>

            {/* Desktop Actions: Search & Subscribe (Visible when NOT Scrolled AND Menu is Closed) */}
            <div className={`hidden ${isScrolled || isOpen ? '' : 'md:flex items-center gap-4'}`}>
              <ExpandingSearch />
              <button
                onClick={() => setShowNewsletter(true)}
                className="px-4 py-2 text-foreground border border-foreground font-bold tracking-widest hover:bg-white/80 hover:text-black-primary transition-colors text-xs uppercase"
              >
                SUBSCRIBE
              </button>
            </div>
          </div>

          {/* Center: Logo */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <HeaderLogo />
          </div>

          {/* Right: Account & Cart */}
          <div className="flex-1 flex justify-end items-center gap-4">
            <CartIcon />
            <AccountMenu />
          </div>
        </div>
      </div>

      {/* Navigation Links (Desktop Only, Scrolls away) */}
      <div className="hidden md:flex w-full bg-black-primary border-b border-border px-4 sm:px-6 py-4 items-center justify-center">
        <NavLinks />
      </div>
      <NewsletterPopup isVisible={showNewsletter} setIsVisible={setShowNewsletter} />
    </>
  );
}