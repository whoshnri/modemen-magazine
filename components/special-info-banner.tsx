"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";

export function SpecialInfoBanner() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const hiddenTimestamp = localStorage.getItem("specialBannerHidden");
        if (hiddenTimestamp) {
            const msSinceHidden = Date.now() - parseInt(hiddenTimestamp, 10);
            const hoursSinceHidden = msSinceHidden / (1000 * 60 * 60);
            if (hoursSinceHidden >= 24) {
                setIsVisible(true);
            }
        } else {
            setIsVisible(true);
        }
    }, []);

    const handleClose = () => {
        setIsVisible(false);
        localStorage.setItem("specialBannerHidden", Date.now().toString());
    };

    if (!isVisible) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="sticky top-0 z-[60] bg-gold-primary text-black-primary w-full overflow-hidden"
            >
                <div className="flex items-center justify-between px-4 sm:px-6 py-2 text-xs sm:text-sm font-medium tracking-wide">
                    <div className="flex-1" /> {/* Spacer for centering if needed, or just flex-center */}

                    <div className="flex items-center gap-2 sm:gap-4 flex-wrap justify-center text-center">
                        <span className="font-bold uppercase tracking-widest">Modemen @ 20</span>
                        <span className="hidden sm:inline opacity-80">Celebrating two decades of defining style.</span>
                        <Link
                            href="/anniversary"
                            className="underline decoration-black-primary/50 hover:decoration-black-primary transition-all font-bold uppercase"
                        >
                            Explore The Era
                        </Link>
                    </div>

                    <div className="flex-1 flex justify-end">
                        <button
                            onClick={handleClose}
                            className="p-1 hover:bg-black-primary/10 rounded-full transition-colors"
                            aria-label="Close banner"
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
                                <path d="M18 6 6 18" />
                                <path d="m6 6 12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
