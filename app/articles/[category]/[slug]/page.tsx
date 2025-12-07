"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ArticleCard } from "@/components/article-card";
import { VerticalAd } from "@/components/vertical-ad";
import { motion } from "framer-motion";
import Link from "next/link";
import { use, useEffect, useState } from "react";
import { Tag } from "@prisma/client";
import { ArticleWithTags } from "@/app/articles/[category]/page";
import {
  getArticleBySlug,
  getRelatedArticles,
} from "@/app/actions/fetchArticles";
import { ArticleRenderer } from "@/components/article-renderer";
import { HorizontalAd } from "@/components/horizontal-ad";
import SaveModal from "@/components/hovering-save";
import Spinner from "@/components/spinner";

export default function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const [article, setArticles] = useState<ArticleWithTags | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fectchArticle = async () => {
      const fetchedArticle = await getArticleBySlug(slug);
      if (fetchedArticle.data !== null) {
        setArticles(fetchedArticle.data);
      }
      setLoading(false);
    };
    fectchArticle();
  }, [slug]);

  const [relatedArticles, setRelatedArticles] = useState<ArticleWithTags[]>([]);

  useEffect(() => {
    const fetchRelatedArticles = async () => {
      if (article) {
        const articleTags = article.tags.map((tag) => tag.name as Tag);
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

  const adsToInject = [
    <HorizontalAd
      key="ad-1"
      title="STYLE UPGRADE"
      description="Discover our new collection of timeless watches and premium leather goods. Perfect for the modern man."
      image="/ads/watch-collection.jpg"
      link="/shop/collections/watches"
      backgroundColor="#0a0a0a"
      borderColor="#2a2a2a"
      textColor="#f5f5f5"
    />,
    <HorizontalAd
      key="ad-2"
      title="WATCH COLLECTION"
      description="Upgrade your timekeeping aesthetic with our exclusive watch collection."
      image="/ads/watch-collection.jpg"
      link="/shop/collections/watches"
      backgroundColor="#0a0a0a"
      borderColor="#2a2a2a"
      textColor="#f5f5f5"
    />,
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
                {article.tags.map((tag) => tag.name).join(", ")}
              </span>
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
                `/placeholders/${article.tags[0].name.toLowerCase()}.svg`
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
              <div className="prose prose-invert max-w-none">
                <ArticleRenderer htmlContent={article.body} ads={adsToInject} />
              </div>
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
                title="Exclusive"
                description="Premium content and exclusive insights"
                image="/placeholder.svg?key=4dan0"
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
                  category={article.tags}
                  slug={article.slug}
                  id={article.id}
                  image={
                    article.bannerImage
                      ? article.bannerImage
                      : `/placeholders/${article.tags[0].name.toLocaleLowerCase()}.svg`
                  }
                  date={article.publicationDate}
                  author={article.writtenBy}
                />
              ))}
            </div>
          </div>
        </motion.section>
      </main>
      <SaveModal type="article" contentID={article.id}/>
      <Footer />
    </div>
  );
}
