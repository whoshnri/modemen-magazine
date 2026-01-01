"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { CookieBanner } from "@/components/cookie-banner";
import { NewsletterPopup } from "@/components/newsletter-popup";
import { PageLoader } from "@/components/page-loader";
import { ArticleCard } from "@/components/article-card";
import { RecommendedItems } from "@/components/recommended-items";
import { HorizontalAd } from "@/components/horizontal-ad";
import { VerticalAd } from "@/components/vertical-ad";
import { SingleAd } from "@/components/single-ad";
import BigArticlePreview from "@/components/big-article-preview";
import { ArticleListCompact } from "@/components/article-list-compact";
import { FeaturedStories } from "@/components/featured-stories";
import { motion } from "framer-motion";
import { useEffect, useState, useCallback } from "react";
import { fetchHomePageArticles } from "./actions/fetchArticles";
import { Article } from "@/lib/generated/prisma/client";
import { NewsletterSection } from "@/components/newsletter-section";
import { Products, useShop } from "@/components/shop-context";
import Spinner from "@/components/spinner";
import ModeMenAnniversary from "@/components/mode-men-anniversary";
import { CurrentIssueSpotlight } from "@/components/current-issue-spotlight";
import { useSession } from "@/hooks/use-session";
import { $Enums, Ad } from "@/lib/generated/prisma/client";
// import { FeaturedInterviews } from "@/components/featured-interviews";
// import FeaturedEvents from "@/components/featured-events";

const ArticleCardSkeleton = () => (
  <div className="bg-black-secondary/30 animate-pulse overflow-hidden">
    <div className="w-full aspect-video bg-muted-foreground/30"></div>
    <div className="p-4 sm:p-6">
      <div className="h-4 bg-muted-foreground/30 rounded w-1/4 mb-3"></div>
      <div className="h-6 bg-muted-foreground/30 rounded w-3/4 mb-4"></div>
      <div className="h-4 bg-muted-foreground/30 rounded w-full"></div>
      <div className="h-4 bg-muted-foreground/30 rounded w-5/6 mt-2"></div>
    </div>
  </div>
);

const SectionSkeleton = ({ title }: { title: string }) => (
  <motion.section className="border-b border-border px-4 sm:px-6 py-8 sm:py-12">
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8 sm:mb-12">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-widest">
          {title}
        </h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
        <ArticleCardSkeleton />
        <ArticleCardSkeleton />
        <ArticleCardSkeleton />
      </div>
    </div>
  </motion.section>
);

export default function HomePage() {
  const { shopItems, loading } = useShop()
  const [featuredArticles, setFeaturedArticles] = useState<Article[]>([]);
  const [isError, setIsError] = useState(false);
  const [showNewsletter, setShowNewsletter] = useState(false)
  const [categoryArticlesMap, setCategoryArticlesMap] = useState<{
    [key: string]: Article[];
  }>({});
  const [products, setProducts] = useState<Products[] | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [ourWorldOffset, setOurWorldOffset] = useState(5)

  const { session } = useSession();
  const [ads, setAds] = useState<Ad[]>([]);

  useEffect(() => {
    const fetchAds = async () => {
      const { getRandomAdByType } = await import("@/app/actions/adOps");
      const fetchedAds = await getRandomAdByType([] as $Enums.Tag[], 5);
      setAds(fetchedAds);
    };
    fetchAds();
  }, []);

  const isPremium = session?.subscriptionPlan === 'PREMIUM' || session?.subscriptionPlan === 'VIP';

  const allCategories = [
    "STYLE",
    "CULTURE",
    "BUSINESS_MONEY",
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.5 },
    },
  };

  const handleNewsletterClose = () => {
    setShowNewsletter(false)
  }

  const loadArticles = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    // Note: Using existing fetch action, might need update if schema changed significantly for return types
    try {
      const response = await fetchHomePageArticles();
      if (response.data) {
        setFeaturedArticles(response.data.featuredArticles || []);
        setOurWorldOffset(response.data.featuredArticles.length);
        setCategoryArticlesMap(response.data.featuredArticlesByTag || {});
      }
    } catch (error) {
      console.error("Failed to fetch articles:", error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadArticles();
  }, [loadArticles]);


  // use effect to show the popup
  useEffect(() => {
    const handleScroll = () => {
      const scrollPercentage =
        (window.scrollY /
          (document.documentElement.scrollHeight - window.innerHeight)) * 100;

      requestAnimationFrame(() => {
        if (
          scrollPercentage > 30 &&
          !showNewsletter &&
          !localStorage.getItem('newsletter-dismissed')
        ) {
          setShowNewsletter(true);
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [showNewsletter]);

  return (
    <div className="min-h-screen bg-black-primary flex flex-col">
      <PageLoader />
      <CookieBanner />
      <NewsletterPopup isVisible={showNewsletter} setIsVisible={handleNewsletterClose} />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <Header />

        <main className="flex-1">
          {/* Hero Section */}
          {isLoading ? (
            <SectionSkeleton title="LOADING..." />
          ) : featuredArticles.length > 0 ? (
            <BigArticlePreview article={featuredArticles[0]} />
          ) : (
            // Fallback Hero
            <motion.section className="relative px-4 sm:px-6 py-24 sm:py-32 bg-black-primary">
              <div className="max-w-6xl mx-auto text-center relative z-10">
                <h4 className="text-gold-primary tracking-[0.3em] uppercase text-xs font-bold mb-6">The Authority on African Luxury</h4>
                <h1 className="text-5xl sm:text-6xl md:text-8xl font-serif font-medium mb-8 leading-tight tracking-tight text-white">
                  ELEGANCE <br /><span className=" font-light opacity-80">WITH INTENTION</span>
                </h1>
                <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed font-light">
                  Precision in tailoring. Intention in accessories. A grooming ritual that speaks before you do.
                </p>
                <a
                  href="/articles/style"
                  className="inline-block px-10 py-4 bg-gold-primary text-black-primary font-bold tracking-widest hover:bg-white transition-colors text-xs uppercase"
                >
                  Explore Style
                </a>
              </div>
              {/* Background decoration */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[radial-gradient(circle_at_center,#3B2F2F_0%,transparent_60%)] opacity-20 pointer-events-none"></div>
            </motion.section>
          )}

          {/* Current Issue Spotlight (New) */}
          <CurrentIssueSpotlight />

          {/* Featured Stories */}
          <div className="pb-10 ">
            {isLoading || isError ? (
              <SectionSkeleton title="LATEST" />
            ) : (
              featuredArticles.length > 0 && (
                <div className="flex flex-col gap-12 sm:gap-16">
                  <FeaturedStories articles={featuredArticles.slice(1)} />
                </div>
              )
            )}
          </div>

          {/* <FeaturedEvents /> */}

          {/* Anniversary Component */}
          <ModeMenAnniversary />

          {/* <FeaturedInterviews /> */}
          {/* Shop Preview with Ads */}
          <div className="py-16 bg-black-primary">
            <div className="container-responsive mb-12">
              <div className="flex justify-between items-end mb-8">
                <h2 className="text-3xl md:text-4xl text-white uppercase">Curated Essentials</h2>
                <a href="/shop" className="text-gold-primary border border-gold-primary p-3 uppercase text-xs font-bold tracking-widest hover:text-black hover:bg-gold-primary transition-colors">Visit Shop</a>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-1">
                  {!isPremium && (
                    <VerticalAd
                      title={ads[0]?.title || "The Gold Standard"}
                      description={ads[0]?.title ? "" : "Timeless pieces for the modern collector."}
                      image={ads[0]?.image || "/images/watch-ad.jpg"}
                      width="w-full"
                      backgroundColor="#0a0a0a"
                      textColor="#fff"
                      link={ads[0]?.link}
                    />
                  )}
                </div>
                <div className={isPremium ? "lg:col-span-4" : "lg:col-span-3"}>
                  {shopItems ? <RecommendedItems items={shopItems.slice(0, isPremium ? 12 : 10)} columns={isPremium ? 4 : 3} /> : <div className="text-white/50 text-center py-12"><Spinner /></div>}
                </div>
              </div>
            </div>
          </div>

          {/* Horizontal Ad */}
          {!isPremium && (
            <section className="py-8 border-y border-border">
              <div className="container-responsive">
                <HorizontalAd
                  title={ads[1]?.title || "Legacy of Taste"}
                  description=""
                  image={ads[1]?.image || "/images/horizontal-ad-placeholder.jpg"}
                  link={ads[1]?.link || "/sponsored"}
                />
              </div>
            </section>
          )}
        </main>

        <Footer />
      </motion.div>
    </div>
  );
}
