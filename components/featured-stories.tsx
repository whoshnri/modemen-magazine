"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FeaturedStoryCard } from "./featured-story-card";
import { Article } from "@/lib/generated/prisma/client";
import Link from "next/link";

interface FeaturedStoriesProps {
    articles: Article[];
}

export function FeaturedStories({ articles }: FeaturedStoriesProps) {
    const [visibleCount, setVisibleCount] = useState(4);

    const visibleArticles = articles.slice(1, visibleCount);
    const hasMore = visibleCount < articles.length;

    const handleLoadMore = () => {
        setVisibleCount((prev) => prev + 4);
    };

    return (
        <motion.section className="px-3 sm:px-6 py-8 sm:py-12">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-3xl sm:text-4xl font-bold tracking-widest mb-8 sm:mb-12">
                    FROM OUR WORLD
                </h2>

                <div className="flex flex-col gap-12 sm:gap-16">
                    {visibleArticles.map((article, idx) => (
                        <FeaturedStoryCard
                            key={article.id}
                            id={article.id}
                            title={article.title}
                            image={
                                article.bannerImage
                                    ? article.bannerImage
                                    : "/luxury-lifestyle-products.jpg"
                            }
                            category={article.category}
                            subcategory={article.subcategory}
                            date={article.publicationDate}
                            author={article.writtenBy}
                            slug={article.slug}
                            excerpt={article.body}
                            idx={idx}
                        />
                    ))}
                </div>

                {hasMore && (
                    <div className="flex justify-center mt-12 sm:mt-16">
                        <button
                            onClick={handleLoadMore}
                            className="px-8 py-4 bg-black-primary text-white border border-white font-bold tracking-widest hover:bg-white hover:text-black-primary transition-colors duration-300 uppercase text-sm"
                        >
                            Load More
                        </button>
                    </div> 
                )}
                {!hasMore && (
                    <div className="flex justify-center mt-12 sm:mt-16">
                    <Link
                        href={"/articles"}
                        className="px-8 py-4 bg-black-primary text-white border border-white font-bold tracking-widest hover:bg-white hover:text-black-primary transition-colors duration-300 uppercase text-sm"
                    >
                        explore more
                    </Link>
                </div>
                )}
            </div>
        </motion.section>
    );
}
