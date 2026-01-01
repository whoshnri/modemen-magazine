"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getRandomAd } from "@/app/actions/adOps";
import { useSession } from "@/hooks/use-session";

// ...
type Ad = {
    id: string;
    title: string;
    image: string;
    link: string;
};

export const AdBanner = ({ className }: { className?: string }) => {
    const { session } = useSession();
    const [ad, setAd] = useState<Ad | null>(null);

    useEffect(() => {
        // If user is premium, do not fetch ad
        if (session?.subscriptionPlan === "PREMIUM" || session?.subscriptionPlan === "VIP") return;

        const fetchAd = async () => {
            const fetchedAd = await getRandomAd();
            if (fetchedAd) setAd(fetchedAd);
        };
        fetchAd();
    }, [session]);

    if (!ad || session?.subscriptionPlan === "PREMIUM" || session?.subscriptionPlan === "VIP") return null;

    return (
        <div className={`w-full flex flex-col items-center ${className || "my-8"}`}>
            <span className="text-[10px] text-muted-foreground uppercase tracking-widest mb-2 border border-white/10 px-2 py-0.5 rounded-sm">Advertisement</span>
            <Link href={ad.link} className="relative w-full max-w-4xl aspect-21/9 md:aspect-32/9 block group overflow-hidden border border-white/10">
                <Image
                    src={ad.image}
                    alt={ad.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    onError={() => setAd(null)} // Hide if image fails to load
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
                <div className="absolute bottom-4 left-4 bg-black/80 px-4 py-2 backdrop-blur-sm">
                    <p className="text-white font-bold tracking-widest text-sm uppercase">{ad.title}</p>
                </div>
            </Link>
        </div>
    );
};
