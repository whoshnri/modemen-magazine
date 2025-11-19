"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ArticleCard } from "@/components/article-card";
import { HorizontalAd } from "@/components/horizontal-ad";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { fetchAllArticles } from "../actions/fetchArticles";
import { Article } from "@prisma/client";
import { SingleAd } from "@/components/single-ad";

const categories = [
  "All",
  "POLITICS",
  "FASHION",
  "BUSINESS",
  "ENTERTAINMENT",
  "EVENTS",
  "HEALTH",
  "SPORTS",
  "LIFESTYLE",
  "MENS_INTEREST",
  "SELF_IMPROVEMENT",
];

type ArticleWithTags = Article & { tags: { name: string }[] };

export default function ArticlesPage() {
  const [offset, setOffset] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [hasMore, setHasMore] = useState(true);
  const [articles, setArticles] = useState<ArticleWithTags[]>([]);
  const [loading, setLoading] = useState(false);


  async function fetchArticles() {
    if (loading || !hasMore) return;
    setLoading(true);

    const response = await fetchAllArticles(offset);
    if (!response.data) {
      setHasMore(false);
      setLoading(false);
      return;
    }

    setArticles((prev) => [...prev, ...response.data]);
    setOffset((prev) => prev + 20);

    if (response.data.length < 20) setHasMore(false);
    setLoading(false);
  }

  useEffect(() => {
    fetchArticles();
  }, []);

  const filteredArticles =
    selectedCategory === "All"
      ? articles
      : articles.filter((article) =>
          article.tags.some((tag) => tag.name === selectedCategory)
        );

  return (
    <div className="min-h-screen bg-black-primary flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="border-b border-border px-4 sm:px-6 py-8 sm:py-16">
          <div className="max-w-6xl mx-auto text-center">
            <motion.h1
              className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-widest mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              ARTICLES
            </motion.h1>
            <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto">
              Explore our curated collection of articles on fashion, lifestyle,
              beauty, and culture.
            </p>
          </div>
        </section>

        {/* Filter Section */}
        <section className="border-b border-border px-4 sm:px-6 py-6 sm:py-8">
          <div className="max-w-6xl mx-auto">
            <motion.div
              className="flex flex-wrap gap-3 sm:gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm font-bold tracking-widest transition-all ${
                    selectedCategory === category
                      ? "bg-gold-primary text-black-primary"
                      : "border border-border text-foreground hover:border-gold-primary"
                  }`}
                >
                  {category}
                </button>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Articles Grid */}
        <motion.section
          className="border-b border-border px-4 sm:px-6 py-8 sm:py-12"
         
        >
          <div className="max-w-6xl mx-auto">
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
            >
              {filteredArticles.map((article) => (
                <motion.div key={article.id} >
                  <ArticleCard
                    title={article.title}
                    category={article.tags}
                    id={article.id}
                    image={article.bannerImage || "/placeholder.svg"}
                    date={article.publicationDate.toDateString()}
                    author={article.writtenBy}
                    slug={article.slug}
                  />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.section>

      <section className="px-4 sm:px-6 py-8 sm:py-12">
          <div className="max-w-6xl mx-auto">
            <SingleAd />
          </div>
        </section>

        {/* Load More Button */}
        {hasMore && (
          <div className="text-center py-6">
            <button
              onClick={fetchArticles}
              className="px-6 py-3 border text-sm tracking-widest hover:border-gold-primary"
            >
              {loading ? "Loading..." : "Load More"}
            </button>
          </div>
        )}

        
      </main>

      <Footer />
    </div>
  );
}
