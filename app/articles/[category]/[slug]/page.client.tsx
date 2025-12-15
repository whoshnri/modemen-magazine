"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ArticleCard } from "@/components/article-card";
import { VerticalAd } from "@/components/vertical-ad";
import { motion } from "framer-motion";
import Link from "next/link";
import { use, useEffect, useState } from "react";

import {
    getArticleBySlug,
    getRelatedArticles,
} from "@/app/actions/fetchArticles";
import { ArticleRenderer } from "@/components/article-renderer";
import { HorizontalAd } from "@/components/horizontal-ad";
import SaveModal from "@/components/hovering-save";
import Spinner from "@/components/spinner";
import { addToReadingHistory } from "@/app/actions/history";
import { InlineSubscribePrompt, EndOfArticleCTA } from "@/components/inline-subscribe";
import { ProductHoverPopup } from "@/components/product-hover-popup"; // Need to create this too? User asked for it.

import { SubscriptionPopup } from "@/components/subscription-popup";
import { LoginDialog } from "@/components/LoginModal";
import { useSession } from "@/hooks/use-session";
import { Article } from "@/lib/generated/prisma/client";

export default function ArticlePageClient({
    slug,
}: {
    slug: string;
}) {
    const [article, setArticles] = useState<Article | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const { session } = useSession();
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isUpgradeOpen, setIsUpgradeOpen] = useState(false);

    useEffect(() => {
        const fectchArticle = async () => {
            const fetchedArticle = await getArticleBySlug(slug);
            if (fetchedArticle.data !== null) {
                setArticles(fetchedArticle.data);
                if (fetchedArticle.data.isPremium && (!session || session.subscriptionPlan === 'FREE')) {
                    // Optional: Could trigger something here, but we handle it in render
                }

                // Track history
                addToReadingHistory({
                    title: fetchedArticle.data.title,
                    slug: fetchedArticle.data.slug,
                    category: fetchedArticle.data.category || "General"
                })
            }
            setLoading(false);
        };
        fectchArticle();
    }, [slug, session]); // Re-run if session changes (e.g. login)

    const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);

    useEffect(() => {
        const fetchRelatedArticles = async () => {
            if (article) {
                // cast to any or fix types if generated types conflict with manual types
                const articleTags = article.category;
                const fetchedRelatedArticles = await getRelatedArticles(articleTags, 0);
                if (fetchedRelatedArticles.data.length > 0) {
                    setRelatedArticles(fetchedRelatedArticles.data);
                }
            }
        };
        fetchRelatedArticles();
    }, [article]);

    if (!article && !loading) {
        return (
            <div className="min-h-screen bg-black-primary flex flex-col">
                <Header />
                <main className="flex-1 flex items-center justify-center p-10">
                    <div className="text-center">
                        <h1 className="text-3xl sm:text-4xl font-bold tracking-widest mb-4">
                            Article Not Found
                        </h1>
                        <Link
                            href="/articles"
                            className="text-gold-primary hover:text-gold-secondary transition-colors"
                        >
                            Back to Articles
                        </Link>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }
    if (loading || !article) {
        return (
            <div className="min-h-screen bg-black-primary flex flex-col">
                <Header />
                <main className="flex-1 flex items-center justify-center p-10">
                    <Spinner />
                </main>
                <Footer />
            </div>
        );
    }

    // Determine access
    const isPremium = article.isPremium || false;
    const canAccess = !isPremium || (session?.subscriptionPlan === 'PREMIUM' || session?.subscriptionPlan === 'VIP');

    const adsToInject = [
        <HorizontalAd
            key="ad-1"
            title="STYLE UPGRADE"
            description="Discover our new collection of timeless watches and premium leather goods."
            image="/ads/watch-collection.jpg"
            link="/shop/collections/watches"
            backgroundColor="#0a0a0a"
            borderColor="#2a2a2a"
            textColor="#f5f5f5"
        />,
        <div key="inline-sub" className="my-8"><InlineSubscribePrompt /></div>,

    ];

    return (
        <div className="min-h-screen bg-black-primary flex flex-col">
            <Header />

            <main className="flex-1">
                {/* Hero Section */}
                <motion.section
                    className="border-b border-border px-4 sm:px-6 py-8 sm:py-12"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="max-w-4xl mx-auto gap-5 grid">
                        <HorizontalAd />
                        <div className="flex items-center gap-4 mb-6 flex-wrap">
                            <span className="text-sm font-bold tracking-widest text-gold-primary uppercase">
                                {article.category.replace(/_/g, " ")} / <span className="text-sm font-bold tracking-widest text-muted-foreground ">
                                    {article.subcategory.replace(/_/g, " ").toLocaleLowerCase()}
                                    </span> 
                            </span>
                            {isPremium && <span className="bg-gold-primary text-black-primary text-[10px] font-bold px-2 py-1 uppercase tracking-widest">Premium</span>}
                            <span className="text-sm font-bold text-muted-foreground">
                                {/* {article.publicationDate.toDateString()} */}
                            </span>
                        </div>

                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6 leading-tight text-balance">
                            {article.title}
                        </h1>

                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs  font-bold tracking-widest text-muted-foreground uppercase">
                                    By
                                </p>
                                <p className="text-lg font-bold">{article.writtenBy}</p>
                            </div>
                        </div>
                    </div>
                </motion.section>

                {/* Featured Image */}
                <motion.section
                    className="border-b border-border p-4 sm:px-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                >
                    <div className="max-w-4xl mx-auto w-full">
                        <img
                            src={
                                article.bannerImage ||
                                `/placeholders/${article.category.toLowerCase()}.svg`
                            }
                            alt={article.title}
                            className="w-full h-64 sm:h-96 md:h-[500px] object-cover"
                        />
                    </div>
                </motion.section>

                {/* Article Content */}
                <motion.section
                    className="border-b border-border px-4 sm:px-6 py-8 sm:py-12"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-12">
                        {/* Main Content */}
                        <div className="lg:col-span-2">
                            <div className="prose prose-invert max-w-none prose-p:leading-relaxed prose-lg">
                                <ArticleRenderer
                                    htmlContent={article.body}
                                    ads={adsToInject}
                                    isPremium={isPremium}
                                    canAccess={canAccess}
                                    onLogin={() => setIsLoginOpen(true)}
                                    onUpgrade={() => setIsUpgradeOpen(true)}
                                />
                            </div>
                            {canAccess && <EndOfArticleCTA />}
                        </div>

                        {/* Sidebar Ad */}
                        <div className="lg:col-span-1 flex flex-col gap-5">
                            <VerticalAd
                                title="Exclusive"
                                description="Premium content and exclusive insights"
                                image="/placeholder.svg?key=4dan0"
                                width="w-full"
                            />
                            <VerticalAd
                                title="VIP Access"
                                description="Join the club."
                                image="/placeholder.svg?key=4dan1"
                                width="w-full"
                            />
                        </div>
                    </div>
                </motion.section>

                {/* Read Next Section */}
                <motion.section
                    className="border-b border-border px-4 sm:px-6 py-8 sm:py-12"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                >
                    <div className="max-w-6xl mx-auto">
                        <h2 className="text-3xl sm:text-4xl font-bold tracking-widest mb-8 sm:mb-12">
                            READ NEXT
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                            {relatedArticles.map((article) => (
                                <ArticleCard
                                    title={article.title}
                                    category={article.category}
                                    subcategory={article.subcategory}
                                    slug={article.slug}
                                    id={article.id}
                                    image={
                                        article.bannerImage
                                            ? article.bannerImage
                                            : `/placeholders/${article.category.toLocaleLowerCase()}.svg`
                                    }
                                    date={article.publicationDate}
                                    author={article.writtenBy}
                                />
                            ))}
                        </div>
                    </div>
                </motion.section>
            </main>
            <SaveModal type="article" contentID={article.id} />
            <Footer />

            <LoginDialog
                isOpen={isLoginOpen}
                onClose={() => setIsLoginOpen(false)}
                header={!session ? "SIGN IN" : "WELCOME"}
                text={!session ? "Sign in to access premium content." : "Get full access."}
            />

            <SubscriptionPopup
                trigger={"ARTICLE"}
                isVisible={isUpgradeOpen}
                onClose={() => setIsUpgradeOpen(false)}
            />
        </div>
    );
}
