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
        <div className="w-full max-w-5xl bg-black-primary flex flex-col md:flex-row shadow-2xl mx-auto ">
            {/* Sidebar / Tabs */}
            <div className="md:w-1/3 bg-black-secondary border-r border-border p-8 flex flex-col justify-center">
                <h3 className="text-xl font-serif text-gold-primary mb-2">Choose Access</h3>
                <p className="text-muted-foreground text-sm mb-8">
                    Join a community of men who move with intention.
                </p>

                <div className="space-y-4">
                    <button
                        onClick={() => setActiveTab("PREMIUM")}
                        className={`w-full text-left p-4 border transition-all duration-300 ${activeTab === "PREMIUM"
                            ? "border-gold-primary bg-gold-primary/10 text-white"
                            : "border-border text-muted-foreground hover:border-gold-primary/50"
                            }`}
                    >
                        <div className="flex justify-between items-center mb-1">
                            <span className="font-bold tracking-widest text-sm">PREMIUM</span>
                            {activeTab === "PREMIUM" && <div className="w-2 h-2 rounded-full bg-gold-primary" />}
                        </div>
                        <p className="text-xs opacity-70">For the modern gentleman.</p>
                    </button>

                    <button
                        onClick={() => setActiveTab("VIP")}
                        className={`w-full text-left p-4 border transition-all duration-300 ${activeTab === "VIP"
                            ? "border-gold-primary bg-gold-primary/10 text-white"
                            : "border-border text-muted-foreground hover:border-gold-primary/50"
                            }`}
                    >
                        <div className="flex justify-between items-center mb-1">
                            <span className="font-bold tracking-widest text-sm text-gold-primary">VIP</span>
                            {activeTab === "VIP" && <div className="w-2 h-2 rounded-full bg-gold-primary" />}
                        </div>
                        <p className="text-xs opacity-70">The highest level of access.</p>
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 p-10 flex flex-col relative">
                {/* Background Texture */}
                <div className="absolute inset-0 pointer-events-none opacity-5 "></div>

                <div className="relative z-10 h-full flex flex-col gap-10">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-serif mb-2 text-white uppercase">
                            {activeTab === "PREMIUM" ? "Premium Membership" : <span className="text-gold-primary">VIP Status</span>}
                        </h2>
                        <p className="text-xl text-gray-300 mb-8 font-light">
                            {activeTab === "PREMIUM"
                                ? "Unlock the full MODE MEN experience."
                                : "Exclusive. Limited. Unapologetic."}
                        </p>

                        <ul className="space-y-4 mb-8">
                            {activeTab === "PREMIUM" ? (
                                <>
                                    <FeatureItem text="Unlimited access to all articles" />
                                    <FeatureItem text="Full Style, Culture, and Business sections" />
                                    <FeatureItem text="Early access to new issues" />
                                    <FeatureItem text="Member-only stories and guides" />
                                    <FeatureItem text="Ad-light reading experience" />
                                </>
                            ) : (
                                <>
                                    <FeatureItem text="Everything in Premium" highlight />
                                    <FeatureItem text="Full archive access (2006–2026)" />
                                    <FeatureItem text="VIP seating at 20th Anniversary events" textClass="text-gold-primary" />
                                    <FeatureItem text="Annual VIP-only virtual roundtable" />
                                    <FeatureItem text="Limited-edition digital collectibles" />
                                </>
                            )}
                        </ul>
                    </div>

                    <div>
                        <div className="flex items-end gap-2 mb-6">
                            <span className="text-3xl font-bold text-white">
                                {activeTab === "PREMIUM" ? "$5.00" : "$25.00"}
                            </span>
                            <span className="text-sm text-muted-foreground mb-1">/ month</span>
                        </div>
                        <Link
                            href={`/checkout?plan=${activeTab.toLowerCase()}`}
                            className={`block w-full text-center py-4 font-bold tracking-widest uppercase transition-all  ${activeTab === "PREMIUM"
                                ? "bg-white text-black-primary hover:bg-gray-200"
                                : "bg-gold-primary text-black-primary hover:bg-gold-secondary"
                                }`}
                        >
                            {activeTab === "PREMIUM" ? "Upgrade to Premium" : "Become a VIP Member"}
                        </Link>
                        <p className="text-center text-xs text-muted-foreground mt-4">
                            Cancel anytime. {activeTab === "VIP" && "Limited spots available."}
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
