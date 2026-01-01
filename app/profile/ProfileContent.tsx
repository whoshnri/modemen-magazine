"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { useSession } from "@/hooks/use-session";
import { redirect, useSearchParams } from "next/navigation";
import { getUserProfilePageData } from "@/app/actions/profileOps";
import { ProfileClient, ProfileUser } from "@/components/ProfileClient";
import { Suspense, useEffect, useState } from "react";
import { $Enums, Address, Order } from "@/lib/generated/prisma/client"
import Spinner from "@/components/spinner";

type useData = {
    cart: {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
    } | null;
    savedArticles: {
        id: string;
        title: string;
        slug: string;
        body: string;
        bannerImage: string | null;
        featured: boolean;
        writtenBy: string;
        publicationDate: Date;
        createdAt: Date;
        updatedAt: Date;
    }[];
    savedProducts: {
        name: string;
        id: string;
        desc: string | null;
        price: number;
        stock: number;
        image: string;
    }[];
    newsletterSubscription: {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string | null;
        email: string;
        isSubscribed: boolean;
    } | null;
    readList: {
        id: string;
        title: string;
        createdAt: Date;
        updatedAt: Date;
        releaseDate: Date;
    }[];
    addresses: Address[];
    orders: Order[];
} & {
    name: string | null;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    email: string;
    password: string;
    subscriptionPlan: $Enums.SubscriptionPlan;
    role: $Enums.Role
};

export default function ProfileContent() {
    const params = useSearchParams();
    const { session } = useSession();
    const activeTab = params.get("tab") || "orders";

    return (
        <Suspense fallback={<div>Loading profile...</div>}>
            <Body activeTab={activeTab} session={session} />
        </Suspense>
    );
}

type User = {
    id: string;
    email: string;
    name?: string | null | undefined;
} | null;

export function Body({
    activeTab,
    session,
}: {
    activeTab: string;
    session: User;
}) {
    const [user, setUser] = useState<ProfileUser | null>(null);
    const [message, setMessage] = useState<string | null>(null);


    const [isLoading, setIsLoading] = useState(true);

    if (!session) {
        redirect("/login?redirect=/profile");
    }

    useEffect(() => {
        async function fetchData() {
            if (!session) return;
            try {
                const { data: user, message } = await getUserProfilePageData(session.id);
                setUser(user);
                setMessage(message);
            } catch (error) {
                console.error("Failed to load profile", error);
                setMessage("An unexpected error occurred.");
            } finally {
                setIsLoading(false);
            }
        }
        fetchData();
    }, [session]);

    if (isLoading) {
        return (
            <div className="flex flex-col min-h-screen bg-black-primary text-white p-4">
                <Header />
                <main className="flex-1 flex flex-col items-center justify-center gap-4">
                    <Spinner />
                    <p className="text-muted-foreground text-sm uppercase tracking-widest animate-pulse">Loading Profile...</p>
                </main>
                <Footer />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex flex-col min-h-screen bg-black-primary">
                <Header />
                <main className="flex-1 flex items-center justify-center">
                    <p className="text-muted-foreground">
                        {message || "Could not load user profile."}
                    </p>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="bg-black-primary flex flex-col min-h-screen">
            <Header />
            <main className="flex-1">
                <div className="border-b border-border bg-black-secondary/30 py-16">
                    <div className="max-w-6xl mx-auto px-6">
                        <h1 className="text-5xl font-bold tracking-widest text-foreground">
                            MY <span className="text-gold-primary">ACCOUNT</span>
                        </h1>
                        <p className="text-muted-foreground mt-2">
                            Welcome back, {user.name || "Valued Member"}.
                        </p>
                    </div>
                </div>

                <ProfileClient user={user} sessionId={session.id} />
            </main>
            <Footer />
        </div>
    );
}
