"use client";

import { useState, useMemo } from "react";
import { Article } from "@/lib/generated/prisma/client";
import { motion } from "framer-motion";
import { ArticleCard } from "@/components/article-card";
import { fetchSpecArticles } from "@/app/actions/fetchArticles";
import Spinner from "@/components/spinner";
import Link from "next/link";

interface CategoryPageClientProps {
    initialArticles: Article[];
    category: string;
    subcategory?: string;
    initialHasMore: boolean;
}

const RECOMMENDED_LINKS = [
    { name: "Style", href: "/articles/style" },
    { name: "Culture", href: "/articles/culture" },
    { name: "Business & Money", href: "/articles/business-and-money" },
];

export default function CategoryPageClient({
    initialArticles,
    category,
    subcategory,
    initialHasMore,
}: CategoryPageClientProps) {
    const [articles, setArticles] = useState<Article[]>(initialArticles);
    const [offset, setOffset] = useState<number>(initialArticles.length);
    const [hasMore, setHasMore] = useState<boolean>(initialHasMore);
    const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
    const [showNewestFirst, setShowNewestFirst] = useState<boolean>(true);

    const loadMoreArticles = async () => {
        if (isLoadingMore || !hasMore) return;

        setIsLoadingMore(true);
        try {
            const response = await fetchSpecArticles(category, offset, subcategory);

            if (response.data && response.data.length > 0) {
                setArticles((prev) => [...prev, ...response.data]);
                setOffset((prev) => prev + response.data.length);
                // Assuming page size is 9 based on server action
                setHasMore(response.data.length === 9);
            } else {
                setHasMore(false);
            }
        } catch (err) {
            console.warn("Retrying load more:", err);
        } finally {
            setIsLoadingMore(false);
        }
    };

    const sortedArticles = useMemo(() => {
        return [...articles].sort((a, b) => {
            const dateA = new Date(a.publicationDate).getTime();
            const dateB = new Date(b.publicationDate).getTime();
            return showNewestFirst ? dateB - dateA : dateA - dateB;
        });
    }, [articles, showNewestFirst]);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
    };

    if (articles.length === 0) {
        return (
            <div className="text-center py-20 col-span-1 md:col-span-2 lg:col-span-3">
                <h2 className="text-2xl font-bold tracking-widest text-gold-primary">
                    NO ARTICLES FOUND
                </h2>
                <p className="text-muted-foreground mt-4 mb-12">
                    No articles found for  <span className="text-white font-bold">{subcategory ? `${subcategory} in ` : ""}</span>
                    <span className="uppercase">{category.replaceAll("_", " ")}</span>.
                </p>

                <h3 className="text-sm font-bold text-white mb-6 uppercase tracking-widest">Explore Other Categories</h3>
                <div className="flex flex-wrap justify-center gap-4">
                    {RECOMMENDED_LINKS.map(link => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="px-6 py-3 bg-black-secondary hover:bg-gold-primary hover:text-black-primary transition-colors text-sm uppercase tracking-widest"
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <>
            {/* Sorting Controls */}
            <div className="max-w-6xl mx-auto mb-12 flex justify-end">
                <button
                    onClick={() => setShowNewestFirst(!showNewestFirst)}
                    className="px-4 py-2 text-sm border border-border text-muted-foreground hover:bg-black-secondary transition-colors"
                >
                    Sort by: {showNewestFirst ? "Newest First" : "Oldest First"}
                </button>
            </div>

            <motion.div
                className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {sortedArticles.map((article) => (
                    <ArticleCard
                        key={article.id}
                        title={article.title}
                        category={article.category}
                        subcategory={article.subcategory}
                        slug={article.slug}
                        id={article.id}
                        image={article.bannerImage || `/placeholders/${category.toLowerCase()}.svg`}
                        date={new Date(article.publicationDate)}
                        author={article.writtenBy}
                    />
                ))}
            </motion.div>

            <div className="max-w-6xl mx-auto mt-16 text-center">
                {hasMore && (
                    <button
                        onClick={loadMoreArticles}
                        disabled={isLoadingMore}
                        className="w-full max-w-xs py-3 bg-gold-primary text-black-primary font-bold tracking-widest hover:bg-gold-secondary transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {isLoadingMore ? <Spinner /> : "LOAD MORE"}
                    </button>
                )}
                {!hasMore && (
                    <p className="text-muted-foreground tracking-widest">
                        END OF RESULTS
                    </p>
                )}
            </div>
        </>
    );
}
