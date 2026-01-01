"use client";

import Link from "next/link";

export function AdvertiseCTA() {
    return (
        <div className="pb-12 mb-12 border-b border-border flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="max-w-2xl">
                <h3 className="text-2xl font-bold tracking-widest text-white mb-3">
                    <span className="text-gold-primary">ADVERTISE</span> WITH US
                </h3>

                <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                    Connect with our affluent, style-conscious audience. Showcase your brand in a premium environment designed for engagement.
                </p>
            </div>

            <Link
                href="/advertise"
                className="px-8 py-3 bg-gold-primary text-black-primary font-bold uppercase tracking-widest text-xs hover:bg-gold-secondary transition-colors shrink-0"
            >
                Start Growing Now
            </Link>
        </div>
    );
}
