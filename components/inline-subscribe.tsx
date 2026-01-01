"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {GemIcon} from "lucide-react"
import { SubscriptionPopup } from "./subscription-popup";
import { useState } from "react";


export function InlineSubscribePrompt() {
    const [isUpgradeOpen, setIsUpgradeOpen] = useState(false);
    return (
        <div className="my-12 p-8 border-t border-b border-gold-primary/20 bg-linear-to-r from-black-secondary to-black-primary relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gold-primary/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>

            <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="text-center sm:text-left">
                    <h4 className="text-gold-primary font-bold tracking-widest text-xs uppercase mb-2">Unlock More</h4>
                    <h3 className="text-xl md:text-2xl font-serif text-white mb-2">
                        Enjoying this story?
                    </h3>
                    <p className="text-sm text-gray-400 max-w-md">
                        Subscribe to Mode Men Premium for unlimited access to our in-depth journalism, interviews, and style guides.
                    </p>
                </div>

                <button
                    onClick={() => setIsUpgradeOpen(true)}
                    className="shrink-0 px-6 py-3 border border-gold-primary text-gold-primary hover:bg-gold-primary hover:text-black-primary transition-all duration-300 text-xs font-bold uppercase tracking-widest flex items-center gap-2"
                >
                    Upgrade
                    <GemIcon className="w-3 h-3" />
                </button>
            </div>
            <SubscriptionPopup
                isVisible={isUpgradeOpen}
                trigger="ARTICLE"
                onClose={() => setIsUpgradeOpen(false)}
            />
        </div>
    );
}

import { subscribeToNewsletter } from "@/app/actions/cms/newsletter";
import { Loader2 } from "lucide-react";

export function EndOfArticleCTA() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        const result = await subscribeToNewsletter(email);

        setLoading(false);
        if (result.success) {
            setMessage({ type: 'success', text: result.success as string });
            setEmail("");
        } else {
            setMessage({ type: 'error', text: result.error as string });
        }
    };

    return (
        <div className="my-16 bg-black-secondary border border-gold-primary/30 p-10 md:p-16 text-center relative overflow-hidden">
             
            <div className="relative z-10">
                <h2 className="text-3xl md:text-4xl mb-4 text-white">
                    Join the Inner Circle
                </h2>
                <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto font-light leading-relaxed">
                    Get exclusive stories, interviews, and style guides delivered directly to your inbox.
                    The definitive guide to the modern African gentleman.
                </p>

                <form onSubmit={handleSubscribe} className="max-w-md mx-auto flex flex-col sm:flex-row gap-4">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Your email address"
                        required
                        className="flex-1 bg-black-primary border border-border px-4 py-3 text-white focus:border-gold-primary focus:outline-none transition-colors"
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-8 py-3 bg-gold-primary text-black-primary font-bold tracking-widest uppercase hover:bg-gold-secondary transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Subscribe"}
                    </button>
                </form>

                {message && (
                    <div className={`mt-6 text-sm font-medium ${message.type === 'success' ? 'text-green-500' : 'text-red-500'}`}>
                        {message.text}
                    </div>
                )}
            </div>
             <div className="absolute top-0 right-0 w-64 h-64 bg-gold-primary/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>
             <div className="absolute bottom-0 left-0 w-64 h-64 bg-gold-primary/5 rounded-full blur-3xl -ml-32 -mb-32 pointer-events-none"></div>
        </div>
    )
}
