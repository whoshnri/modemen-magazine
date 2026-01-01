"use client";

import { Check } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";

interface SubscriptionPlansProps {
    defaultTab?: "PREMIUM" | "VIP";
}

export function SubscriptionPlans({ defaultTab = "PREMIUM" }: SubscriptionPlansProps) {
    const [activeTab, setActiveTab] = useState<"PREMIUM" | "VIP">(defaultTab);

    useEffect(() => {
        setActiveTab(defaultTab);
    }, [defaultTab]);

    return (
        <div className="w-full max-w-2xl bg-black-primary flex flex-col shadow-2xl mx-auto ">
            {/* Content Area */}
            <div className="flex-1 p-8 md:p-12 flex flex-col relative">
                {/* Background Texture */}
                <div className="absolute inset-0 pointer-events-none opacity-5 "></div>

                <div className="relative z-10 h-full flex flex-col gap-10 text-center">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-serif mb-2 text-white uppercase">
                            Premium Membership
                        </h2>
                        <p className="text-xl text-gray-300 mb-8 font-light">
                            Unlock the full MODE MEN experience.
                        </p>

                        <ul className="space-y-4 mb-8 text-left max-w-md mx-auto">
                            <FeatureItem text="Unlimited access to all articles" />
                            <FeatureItem text="Full Style, Culture, and Business sections" />
                            <FeatureItem text="Early access to new issues" />
                            <FeatureItem text="Member-only stories and guides" />
                            <FeatureItem text="Ad-light reading experience" />
                        </ul>
                    </div>

                    <div>
                        <div className="flex items-end justify-center gap-2 mb-6">
                            <span className="text-3xl font-bold text-white">
                                $25.00
                            </span>
                            <span className="text-sm text-muted-foreground mb-1">/ year</span>
                        </div>
                        <Link
                            href={`/premium`}
                            className="block w-full text-center py-4 font-bold tracking-widest uppercase transition-all bg-white text-black-primary hover:bg-gray-200"
                        >
                            Upgrade to Premium
                        </Link>
                        <p className="text-center text-xs text-muted-foreground mt-4">
                            Cancel anytime.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function FeatureItem({ text, highlight = false, textClass = "text-gray-300" }: { text: string; highlight?: boolean; textClass?: string }) {
    return (
        <li className="flex items-start gap-3">
            <div className={`mt-1 rounded-full p-0.5 ${highlight ? "bg-gold-primary text-black-primary" : "bg-white/10 text-gold-primary"}`}>
                <Check className="w-3 h-3" />
            </div>
            <span className={`text-sm ${textClass}`}>{text}</span>
        </li>
    );
}
