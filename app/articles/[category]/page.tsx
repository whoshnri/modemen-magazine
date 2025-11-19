"use client";

import { useState, useEffect, useMemo, use } from "react";
import { $Enums, Article } from "@prisma/client";
import { motion } from "framer-motion";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ArticleCard } from "@/components/article-card";
import { fetchSpecArticles } from "@/app/actions/fetchArticles";

export type ArticleWithTags = Article & { tags: { name: string }[] };

const PAGE_SIZE = 9;

const SkeletonCard = () => (
  <div className="w-full space-y-4">
    <div className="aspect-video w-full bg-black-secondary animate-pulse" />
    <div className="space-y-3 px-1">
      <div className="h-4 w-1/4 bg-black-secondary animate-pulse rounded" />
      <div className="h-6 w-full bg-black-secondary animate-pulse rounded" />
      <div className="h-4 w-5/6 bg-black-secondary animate-pulse rounded" />
    </div>
  </div>
);

const ArticleGridSkeleton = ({ count = 6 }: { count?: number }) => (
  <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    {Array.from({ length: count }).map((_, index) => (
      <SkeletonCard key={index} />
    ))}
  </div>
);

export default function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = use(params);
  const tag = category?.toUpperCase().replace("-", "_") as $Enums.Tag;
  const [articles, setArticles] = useState<ArticleWithTags[]>([]);
  const [offset, setOffset] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const [isInitialLoading, setIsInitialLoading] = useState<boolean>(true);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);

  const [showNewestFirst, setShowNewestFirst] = useState<boolean>(true);

  useEffect(() => {
    if (!tag) {
      return;
    }
    const fetchInitialArticles = async () => {
      setIsInitialLoading(true);
      setArticles([]);
      setOffset(0);

      const response = await fetchSpecArticles(tag, 0);

      if (response.data) {
        setArticles(response.data);
        setOffset(response.data.length);
        setHasMore(response.data.length === PAGE_SIZE);
      } else {
        setHasMore(false);
      }
      setIsInitialLoading(false);
    };

    fetchInitialArticles();
  }, [category]);

  const loadMoreArticles = async () => {
    if (isLoadingMore || !hasMore) return;

    setIsLoadingMore(true);
    const response = await fetchSpecArticles(tag, offset);

    if (response.data && response.data.length > 0) {
      setArticles((prev) => [...prev, ...response.data]);
      setOffset((prev) => prev + response.data.length);
      setHasMore(response.data.length === PAGE_SIZE);
    } else {
      setHasMore(false);
    }
    setIsLoadingMore(false);
  };

  const sortedArticles = useMemo(() => {
    return [...articles].sort((a, b) => {
      const dateA = new Date(a.publicationDate).getTime();
      const dateB = new Date(b.publicationDate).getTime();
      return showNewestFirst ? dateB - dateA : dateA - dateB;
    });
  }, [articles, showNewestFirst]);

  const renderContent = () => {
    if (isInitialLoading) {
      return <ArticleGridSkeleton />;
    }

    if (articles.length === 0) {
      return (
        <div className="text-center py-20 col-span-1 md:col-span-2 lg:col-span-3">
          <h2 className="text-2xl font-bold tracking-widest text-gold-primary">
            NO ARTICLES FOUND
          </h2>
          <p className="text-muted-foreground mt-2">
            There are currently no articles in the "{tag.replace("-", " ")}"
            category.
          </p>
        </div>
      );
    }

    const containerVariants = {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
    };

    return (
      <>
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
              category={article.tags}
              slug={article.slug} 
              id={article.id}
              image={
                article.bannerImage || `/placeholders/${tag.toLowerCase()}.svg`
              }
              date={new Date(article.publicationDate).toDateString()}
              author={article.writtenBy}
            />
          ))}
        </motion.div>

        <div className="max-w-6xl mx-auto mt-16 text-center">
          {hasMore && (
            <button
              onClick={loadMoreArticles}
              disabled={isLoadingMore}
              className="w-full max-w-xs py-3 bg-gold-primary text-black-primary font-bold tracking-widest hover:bg-gold-secondary transition-colors disabled:opacity-50"
            >
              {isLoadingMore ? "LOADING..." : "LOAD MORE"}
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
  };

  return (
    <div className="min-h-screen bg-black-primary flex flex-col">
      <Header />
      <main className="flex-1">
        {/* --- Hero Section --- */}
        <section className="border-b border-border px-6 py-20">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-5xl font-bold tracking-widest mb-6">{tag}</h1>
            <p className="text-lg text-muted-foreground">
              Explore our curated collection of articles focused on {category}.
              Stay updated with the latest trends, tips, and insights.
            </p>
          </div>
        </section>

        {/* --- Main Content Section --- */}
        <section className="px-6 py-12">
          {/* Sorting Controls - only show if there's content to sort */}
          {!isInitialLoading && articles.length > 0 && (
            <div className="max-w-6xl mx-auto mb-12 flex justify-end">
              <button
                onClick={() => setShowNewestFirst(!showNewestFirst)}
                className="px-4 py-2 text-sm border border-border text-muted-foreground hover:bg-black-secondary transition-colors"
              >
                Sort by: {showNewestFirst ? "Newest First" : "Oldest First"}
              </button>
            </div>
          )}

          {renderContent()}
        </section>
      </main>
      <Footer />
    </div>
  );
}
