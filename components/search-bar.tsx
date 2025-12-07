"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { NewsletterPopup } from "./newsletter-popup";

export function SearchBar({ className = "" , setIsOpen}: { className?: string, setIsOpen: (value: boolean) => void; }) {
    const [query, setQuery] = useState("");
    const router = useRouter();
    const [showNewsletter, setShowNewsletter] = useState(false)

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();

        const trimmedQuery = query.trim();
        if (!trimmedQuery) return;

        const newUrl = `/articles?search=${encodeURI(trimmedQuery)}`;

        if (window.location.pathname.startsWith('/articles')) {
            router.push(newUrl);
        } else {
            router.push(newUrl);
        }
        setIsOpen(false)
    };

    return (
        <div className="flex items-center gap-4">
            <form onSubmit={handleSearch} className={`relative flex-1 flex items-center ${className}`}>
                <input
                    type="text"
                    placeholder="SEARCH"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="bg-transparent border-b border-foreground/50 text-foreground placeholder:text-foreground/50 text-sm font-medium tracking-widest py-1 pr-8 focus:outline-none focus:border-gold-primary transition-colors w-full uppercase"
                />
                <button
                    type="submit"
                    className="absolute right-0 top-1/2 -translate-y-1/2 text-foreground hover:text-gold-primary transition-colors"
                >
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <circle cx="11" cy="11" r="8" />
                        <path d="m21 21-4.3-4.3" />
                    </svg>
                </button>
            </form>
            <button
                onClick={() => setShowNewsletter(true)}
                className="px-4 py-2 text-foreground border border-foreground font-bold tracking-widest hover:bg-white/80 hover:text-black-primary transition-colors text-xs uppercase"
            >
                SUBSCRIBE
            </button>
            <NewsletterPopup
                isVisible={showNewsletter}
                setIsVisible={setShowNewsletter}
            />
        </div>
    );
}
