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
import { ArticleWithTags } from "./articles/[category]/page";
import { NewsletterSection } from "@/components/newsletter-section";
import { Products, useShop } from "@/components/shop-context";
import Spinner from "@/components/spinner";

const ArticleCardSkeleton = () => (
  <div className="bg-black-secondary/30 animate-pulse rounded-lg overflow-hidden">
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
  const [isLoading, setIsLoading] = useState(true);
  const { shopItems, loading } = useShop()
  const [featuredArticles, setFeaturedArticles] = useState<ArticleWithTags[]>(
    []
  );
  const [isError, setIsError] = useState(false);
  const [showNewsletter, setShowNewsletter] = useState(false)
  const [categoryArticlesMap, setCategoryArticlesMap] = useState<{
    [key: string]: ArticleWithTags[];
  }>({});
  const [products, setProducts] = useState<Products[] | null>(null)

  const allCategories = [
    "STYLE",
    "GROOMING",
    "CULTURE",
    "BUSINESS_MONEY",
    "LIFE",
    "TECH_INNOVATION",
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 3.2 },
    },
  };

  const handleNewsletterClose = () => {
    setShowNewsletter(false)
  }

  const loadArticles = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const response = await fetchHomePageArticles();
      if (response.data) {
        setFeaturedArticles(response.data.featuredArticles || []);
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
          !localStorage.getItem('newsletter-dismissed') &&
          !(
            localStorage.getItem("remind-later") === "true" &&
            (localStorage.getItem("show-again-timestamp") === null ||
              Date.now() < parseInt(localStorage.getItem("show-again-timestamp")!)
            )
          )
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
          {isError && (
            <div className="bg-red-900/20 border-b border-red-500/50 px-4 py-3">
              <div className="max-w-6xl mx-auto flex items-center justify-between">
                <p className="text-red-400 text-xs sm:text-sm font-bold tracking-widest uppercase">
                  Unable to load some content.
                </p>
                <button
                  onClick={loadArticles}
                  disabled={isLoading}
                  className="px-4 py-2 bg-red-600 text-white font-bold text-[10px] uppercase tracking-widest hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {isLoading ? "RETRYING..." : "RETRY"}
                </button>
              </div>
            </div>
          )}
          {/* Hero Section */}
          {featuredArticles.length > 0 ? (
            <BigArticlePreview article={featuredArticles[0]} />
          ) : (
            <motion.section className="border-b border-border px-4 sm:px-6 py-12 sm:py-24">
              <div className="max-w-6xl mx-auto text-center">
                <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-widest mb-6 sm:mb-8 leading-tight text-balance">
                  THE ART OF
                  <br />
                  <span className="text-gold-primary">LUXURY</span>
                </h1>
                <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto mb-8 text-balance">
                  Discover curated stories on fashion, lifestyle, beauty, and
                  culture from the world's most compelling voices.
                </p>
                <a
                  href="/articles"
                  className="inline-block px-6 sm:px-8 py-3 sm:py-4 bg-gold-primary text-black-primary font-bold tracking-widest hover:bg-gold-secondary transition-colors text-sm sm:text-base"
                >
                  EXPLORE NOW
                </a>
              </div>
            </motion.section>
          )}

          {/* Horizontal Ad */}
          <motion.section className="border-b border-border px-3 sm:px-6 py-3 sm:py-6">
            <div className="max-w-6xl mx-auto">
              <HorizontalAd
                title="Discover Elegance"
                description="Explore our curated collection of premium lifestyle products and exclusive editorial content."
                image="/luxury-lifestyle-collection.jpg"
                link="#"
              />
            </div>
          </motion.section>

          {/* Featured Stories */}
          {isLoading || isError ? (
            <SectionSkeleton title="FROM OUR WORLD" />
          ) : (
            featuredArticles.length > 0 && (
              <FeaturedStories articles={featuredArticles} />
            )
          )}

          {/* Trending / Latest Compact List */}
          {featuredArticles.length > 3 && (
            <motion.section className="border-b border-border px-4 sm:px-6 py-8 sm:py-12 bg-black-secondary/20">
              <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <ArticleListCompact
                    title="Trending Now"
                    articles={featuredArticles.slice(1, 4)}
                  />
                  <ArticleListCompact
                    title="Editor's Picks"
                    articles={featuredArticles.slice(2, 5)}
                  />
                </div>
              </div>
            </motion.section>
          )}

          {/* Single Ad Full Width */}
          <motion.section className="border-b border-border px-3 sm:px-6 py-3 sm:py-6">
            <div className="max-w-6xl mx-auto w-full">
              <SingleAd
                image="/luxury-fashion-runway-show.jpg"
                height="h-64 sm:h-96 md:h-screen"
              >
                <div className="text-center text-white">
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-widest">
                    LIMITED COLLECTION
                  </h3>
                  <p className="text-xs sm:text-sm tracking-widest mt-2">
                    Exclusively Curated
                  </p>
                </div>
              </SingleAd>
            </div>
          </motion.section>

          {/* Category Sections */}
          {isLoading || isError
            ? allCategories.map((category) => (
              <SectionSkeleton
                key={category}
                title={category.toUpperCase()}
              />
            ))
            : allCategories.map((category) => {
              const categoryArticles = categoryArticlesMap[category] || [];
              if (categoryArticles.length === 0) return null;

              return (
                <>
                  <motion.section
                    key={category}
                    className="border-b border-border px-4 sm:px-6 py-8 sm:py-12"
                  >
                    <div className="max-w-6xl mx-auto">
                      <div className="flex items-center justify-between mb-8 sm:mb-12">
                        <h2 className="text-3xl sm:text-4xl font-bold tracking-widest">
                          {category.toUpperCase().replace("_", " ")}
                        </h2>
                        <a
                          href={`/${category.toLowerCase()}`}
                          className="text-sm text-gold-primary hover:text-gold-secondary transition-colors font-bold tracking-widest"
                        >
                          VIEW ALL →
                        </a>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
                        {categoryArticles.map((article) => (
                          <ArticleCard
                            key={article.id}
                            id={article.id}
                            title={article.title}
                            image={
                              article.bannerImage
                                ? article.bannerImage
                                : "/luxury-lifestyle-products.jpg"
                            }
                            category={article.tags}
                            date={article.publicationDate}
                            author={article.writtenBy}
                            slug={article.slug}
                          />
                        ))}
                      </div>
                    </div>
                    {category === "EVENTS" && (
                      <motion.section className=" px-3 sm:px-6 py-3 sm:py-6">
                        <div className="max-w-6xl mx-auto w-full">
                          <SingleAd
                            image="/luxury-fashion-runway-show.jpg"
                            height="h-64 sm:h-96 md:h-screen"
                          >
                            <div className="text-center text-white">
                              <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-widest">
                                LIMITED COLLECTION
                              </h3>
                              <p className="text-xs sm:text-sm tracking-widest mt-2">
                                Exclusively Curated
                              </p>
                            </div>
                          </SingleAd>
                        </div>
                      </motion.section>
                    )}
                  </motion.section>
                  {category === "LIFESTYLE" && (
                    <motion.section className="px-3 border-b sm:px-6 py-3 sm:py-10">
                      <div className="max-w-6xl mx-auto">
                        <NewsletterSection />
                      </div>
                    </motion.section>
                  )}
                </>
              );
            })}

          {/* Recommended Products & Ads */}
          <motion.section className="border-b border-border px-4 sm:px-6 py-8 sm:py-12">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-widest mb-8 sm:mb-12">
                CURATED SELECTION
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 sm:gap-8">
                <div className="lg:col-span-1 grid gap-3">
                  {/* Vertical Ads */}
                  <VerticalAd
                    title="Premium"
                    description="Explore our exclusive collection of luxury items."
                    image="/luxury-premium-products.jpg"
                    width="w-full"
                    backgroundColor=""
                    textColor="#0a0a0a"
                  />
                  <VerticalAd
                    title="Limited Edition"
                    description="Last chance to own these exclusive pieces."
                    image="/luxury-premium-products.jpg"
                    width="w-full"
                    backgroundColor=""
                    textColor="#0a0a0a"
                  />
                  <VerticalAd
                    title="Old School Luxury"
                    description="From watches to trench coats, get vintage, right here."
                    image="/luxury-premium-products.jpg"
                    width="w-full"
                    backgroundColor=""
                    textColor="#0a0a0a"
                  />
                </div>
                <div className="lg:col-span-3">
                  {shopItems && <RecommendedItems items={shopItems} columns={3} />}
                  {!shopItems && loading && <><Spinner /></>}
                </div>
              </div>
            </div>
          </motion.section>

          {/* Newsletter CTA */}
          {/* <motion.section className="px-4 sm:px-6 py-8 sm:py-12">
            <div className="max-w-6xl mx-auto">
              <NewsletterSection
                heading="STAY IN THE LOOP"
                tagline="Subscribe to our newsletter for the latest in luxury lifestyle."
                buttonText="SUBSCRIBE"
                messageUnderInput="No spam, we promise. Unsubscribe anytime."
                showRemindLater={false}
              />
            </div>
          </motion.section> */}
        </main>

        <Footer />
      </motion.div>
    </div>
  );
}
