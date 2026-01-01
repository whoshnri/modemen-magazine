"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/hooks/use-session";
import { useToast } from "@/components/toast/use-toast";
import Image from "next/image";
import { Check, Crown, Loader2 } from "lucide-react";
import PaystackPop from '@paystack/inline-js';
import { upgradeUserToPremium } from "@/app/actions/subscriptionOps";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import Spinner from "@/components/spinner";

export default function PremiumOnboardingPage() {
    const { session } = useSession();
    const router = useRouter();
    const { showToast } = useToast();
    const [loading, setLoading] = useState(false);
    const [PAYSTACK_AMOUNT, setPAYSTACK_AMOUNT] = useState(0);

    async function getPaystackAmount() {
        const response = await fetch("https://v6.exchangerate-api.com/v6/b27a448f9f273cb49b2b96e7/latest/USD");
        const exchangeRate = (await response.json()).conversion_rates.NGN;
        const PAYSTACK_AMOUNT = 25 * exchangeRate * 100; // $25 * 1600 NGN/$ * 100 kobo
        setPAYSTACK_AMOUNT(PAYSTACK_AMOUNT);
    }

    useEffect(() => {
        getPaystackAmount();
    }, []);

    const handleSubscribe = () => {
        if (!session) {
            showToast("Please sign in to subscribe", "error");
            router.push("/login"); // Or open login modal
            return;
        }

        setLoading(true);

        const paystack = new PaystackPop();
        paystack.newTransaction({
            key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "",
            email: session.email,
            amount: PAYSTACK_AMOUNT,
            currency: "NGN", // or USD if enabled
            reference: "" + Math.floor((Math.random() * 1000000000) + 1),
            onSuccess: async (transaction: any) => {
                showToast("Payment successful! Upgrading your account...", "success");
                const res = await upgradeUserToPremium(session.id);
                if (res.success) {
                    showToast("Welcome to Premium!", "success");
                    router.push("/");
                    router.refresh();
                } else {
                    showToast("Something went wrong with the upgrade. Please contact support.", "error");
                }
                setLoading(false);
            },
            onCancel: () => {
                showToast("Transaction cancelled", "error");
                setLoading(false);
            },
        });
    };

    if (session && (session.subscriptionPlan === "PREMIUM" || session.subscriptionPlan === "VIP")) {
        return (
            <>
                <Header />
                <div className="min-h-screen bg-black-primary text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('/noise.png')] opacity-20 pointer-events-none mix-blend-overlay"></div>
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold-primary/20 rounded-full blur-[120px] pointer-events-none"></div>

                    <div className="max-w-3xl w-full text-center space-y-8 z-10 animate-in fade-in zoom-in duration-500">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gold-primary/20 text-gold-primary mb-4">
                            <Crown className="w-10 h-10" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                            You Are <span className="text-gold-primary">Premium.</span>
                        </h1>
                        <p className="text-muted-foreground text-lg max-w-xl mx-auto">
                            Welcome to the inner circle. Your subscription is active, and you have unlocked full access to everything Mode Men Magazine has to offer.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left max-w-2xl mx-auto mt-8">
                            <div className="p-6 bg-white/5 border border-white/10 rounded-lg">
                                <h3 className="text-gold-primary font-bold tracking-widest uppercase mb-2">Ad-Free Experience</h3>
                                <p className="text-sm text-gray-400">Read without interruptions. Pure content, zero distractions.</p>
                            </div>
                            <div className="p-6 bg-white/5 border border-white/10 rounded-lg">
                                <h3 className="text-gold-primary font-bold tracking-widest uppercase mb-2">Exclusive Content</h3>
                                <p className="text-sm text-gray-400">Access deep-dive interviews, industry reports, and special features.</p>
                            </div>
                            <div className="p-6 bg-white/5 border border-white/10 rounded-lg">
                                <h3 className="text-gold-primary font-bold tracking-widest uppercase mb-2">Early Access</h3>
                                <p className="text-sm text-gray-400">Be the first to see new collections and issue drops.</p>
                            </div>
                            <div className="p-6 bg-white/5 border border-white/10 rounded-lg">
                                <h3 className="text-gold-primary font-bold tracking-widest uppercase mb-2">Member Perks</h3>
                                <p className="text-sm text-gray-400">Special invites and offers reserved only for members.</p>
                            </div>
                        </div>

                        <div className="pt-8">
                            <a
                                href="/profile"
                                className="inline-block px-8 py-4 bg-white text-black font-bold uppercase tracking-widest hover:bg-gold-primary transition-colors"
                            >
                                Go To My Profile
                            </a>
                        </div>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Header />
            <div className="min-h-screen bg-black-primary text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
                {/* Background Effects */}
                <div className="absolute top-0 left-0 w-full h-full bg-[url('/noise.png')] opacity-20 pointer-events-none mix-blend-overlay"></div>
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold-primary/20 rounded-full blur-[120px] pointer-events-none"></div>

                <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center z-10">

                    {/* Left: Content */}
                    <div className="space-y-8 animate-in slide-in-from-left duration-700">
                        <div>
                            <span className="text-gold-primary tracking-[0.2em] text-xs font-bold uppercase mb-2 block">Premium Membership</span>
                            <h1 className="text-5xl font-bold tracking-tight mb-4">Elevate Your <br /><span className="text-transparent bg-clip-text bg-linear-to-r from-gold-primary to-white">Lifestyle.</span></h1>
                            <p className="text-muted-foreground text-lg leading-relaxed">
                                Unlock the ultimate Modemen experience. No distractions, just pure style, culture, and exclusive access.
                            </p>
                        </div>

                        <ul className="space-y-4">
                            {[
                                "Ad-free reading experience across the entire site",
                                "Exclusive access to premium articles & interviews",
                                "Early access to new product drops",
                                "Special invite-only event notifications"
                            ].map((benefit, i) => (
                                <li key={i} className="flex items-center gap-3">
                                    <div className="w-6 h-6 rounded-full bg-gold-primary/10 flex items-center justify-center text-gold-primary">
                                        <Check className="w-3 h-3" />
                                    </div>
                                    <span className="text-white/80">{benefit}</span>
                                </li>
                            ))}
                        </ul>

                        <div className="pt-4">
                            <button
                                onClick={handleSubscribe}
                                disabled={loading}
                                className="group relative px-8 py-4 bg-gold-primary text-black font-bold uppercase tracking-widest overflow-hidden transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    {loading ? <Spinner /> : <Crown className="w-5 h-5" />}
                                    {loading ? "" : "Join The Club - $25/Year"}
                                </span>
                                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                            </button>
                            <p className="text-xs text-muted-foreground mt-4 text-center md:text-left pl-1">
                                Secure payment via Paystack. Cancel anytime.
                            </p>
                        </div>
                    </div>

                    {/* Right: Visual */}
                    <div className="relative h-[600px] hidden md:block animate-in fade-in duration-1000 delay-200">
                        <div className="absolute top-0 right-0 w-3/4 h-full border border-gold-primary/30 p-4">
                            <div className="w-full h-full relative overflow-hidden bg-zinc-900">
                                <Image
                                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80"
                                    alt="Premium Lifestyle"
                                    fill
                                    className="object-cover opacity-80"
                                />
                            </div>
                        </div>
                        <div className="absolute bottom-12 left-0 w-2/3 h-1/2 bg-black-secondary border border-white/10 p-6 shadow-2xl backdrop-blur-xl">
                            <div className="h-full flex flex-col justify-between">
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-2">The Gold Standard</h3>
                                    <p className="text-xs text-muted-foreground leading-relaxed">
                                        "Modemen Premium isn't just a subscription; it's a statement. It's for the man who demands the best in everything he consumes."
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gray-700 overflow-hidden relative">
                                        <Image
                                            src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100"
                                            alt="Editor"
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-white">Abubakar</p>
                                        <p className="text-[10px] text-gold-primary">Editor-in-Chief</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            <Footer />
        </>
    );
}
