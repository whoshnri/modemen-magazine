"use client";

import { useState, useTransition } from "react";
import { subscribeToNewsletter } from "@/app/actions/cms/newsletter";
import { useToast } from "@/components/toast/use-toast";

export function FooterNewsletterForm() {
    const [email, setEmail] = useState("");
    const [isPending, startTransition] = useTransition();
    const { showToast } = useToast();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        startTransition(async () => {
            const result = await subscribeToNewsletter(email);
            if (result.error) {
                showToast(result.error, "error");
            } else {
                showToast(result.success!, "success");
                setEmail("");
            }
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
                <input
                    type="email"
                    placeholder="EMAIL ADDRESS"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isPending}
                    className="w-full bg-transparent border-b border-white/20 py-2 pr-8 text-sm tracking-widest placeholder:text-muted-foreground focus:outline-none focus:border-gold-primary transition-colors uppercase disabled:cursor-not-allowed disabled:opacity-50"
                />
                <button
                    type="submit"
                    disabled={isPending}
                    className="absolute right-0 top-1/2 -translate-y-1/2 text-white hover:text-gold-primary transition-colors disabled:text-gray-500"
                >
                    {isPending ? '...' : '→'}
                </button>
            </div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest">
                Subscribe to receive news, updates and exclusive offers.
            </p>
        </form>
    );
}
