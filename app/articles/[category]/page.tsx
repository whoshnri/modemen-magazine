"use client";

import { useState, useEffect, useMemo, use } from "react";
import { $Enums, Article } from "@prisma/client";
import { motion } from "framer-motion";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ArticleCard } from "@/components/article-card";
import { fetchSpecArticles } from "@/app/actions/fetchArticles";
import Spinner from "@/components/spinner";
import Link from "next/link";

export type ArticleWithTags = Article & { tags: { name: string }[] };

const PAGE_SIZE = 9;

// Recommendations for empty/error states
const RECOMMENDED_LINKS = [
  { name: "Style", href: "/articles/style" },
  { name: "Culture", href: "/articles/culture" },
  { name: "Grooming", href: "/articles/grooming" },
  { name: "Home", href: "/" },
];

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
  const [error, setError] = useState<string | null>(null);

  const [showNewestFirst, setShowNewestFirst] = useState<boolean>(true);

  // Update document title deeply
  useEffect(() => {
    document.title = `${tag.replace("_", " ")} | Modemen Magazine`;
  }, [tag]);

  useEffect(() => {
    if (!tag) {
      return;
    }
    const fetchInitialArticles = async () => {
      setIsInitialLoading(true);
      setError(null);
      setArticles([]);
      setOffset(0);

      try {
        const response = await fetchSpecArticles(tag, 0);

        if (!response.data) {
          setError("Failed to fetch articles");
          return;
        }

        if (response.data) {
          setArticles(response.data);
          setOffset(response.data.length);
          setHasMore(response.data.length === PAGE_SIZE);
        } else {
          setHasMore(false);
        }
      } catch (err) {
        console.error("Failed to fetch articles:", err);
        setError("We encountered an issue retrieving these stories.");
      } finally {
        setIsInitialLoading(false);
      }
    };

    fetchInitialArticles();
  }, [category, tag]);

  const loadMoreArticles = async () => {
    if (isLoadingMore || !hasMore) return;

    setIsLoadingMore(true);
    try {
      const response = await fetchSpecArticles(tag, offset);

      if (response.data && response.data.length > 0) {
        setArticles((prev) => [...prev, ...response.data]);
        setOffset((prev) => prev + response.data.length);
        setHasMore(response.data.length === PAGE_SIZE);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      // Allow retry on load more validation failure without blocking UI
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

  const renderContent = () => {
    if (isInitialLoading) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[40vh]">
          <Spinner />
          <p className="mt-4 text-muted-foreground animate-pulse">Curating articles...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-20 col-span-1 md:col-span-2 lg:col-span-3 space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-widest text-red-500">
              SOMETHING WENT WRONG
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              {error} Please try refreshing the page or explore our other sections.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 border border-white/20 hover:bg-white hover:text-black-primary transition-colors text-sm uppercase tracking-widest"
            >
              Try Again
            </button>
          </div>

          <div className="pt-12 border-t border-white/10 max-w-2xl mx-auto">
            <h3 className="text-lg font-bold text-gold-primary mb-6 uppercase tracking-widest">You might also like</h3>
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
        </div>
      );
    }

    if (articles.length === 0) {
      return (
        <div className="text-center py-20 col-span-1 md:col-span-2 lg:col-span-3">
          <h2 className="text-2xl font-bold tracking-widest text-gold-primary">
            NO ARTICLES FOUND
          </h2>
          <p className="text-muted-foreground mt-4 mb-12">
            There are currently no articles in the "{tag.replace("_", " ")}" category.
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
  };

  return (
    <div className="min-h-screen bg-black-primary flex flex-col">
      <Header />
      <main className="flex-1">
        {/* --- Hero Section --- */}
        <section className="border-b border-border px-6 py-20">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-5xl font-bold tracking-widest mb-6">{tag.replace("_", " ")}</h1>
            <p className="text-lg text-muted-foreground">
              Explore our curated collection of articles focused on {category}.
              Stay updated with the latest trends, tips, and insights.
            </p>
          </div>
        </section>

        {/* --- Main Content Section --- */}
        <section className="px-6 py-12">
          {/* Sorting Controls - only show if there's content to sort */}
          {!isInitialLoading && !error && articles.length > 0 && (
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
