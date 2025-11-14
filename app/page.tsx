'use client'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { CookieBanner } from '@/components/cookie-banner'
import { NewsletterPopup } from '@/components/newsletter-popup'
import { PageLoader } from '@/components/page-loader'
import { ArticleCard } from '@/components/article-card'
import { RecommendedItems } from '@/components/recommended-items'
import { HorizontalAd } from '@/components/horizontal-ad'
import { VerticalAd } from '@/components/vertical-ad'
import { SingleAd } from '@/components/single-ad'
import { motion } from 'framer-motion'
import { mockArticles, mockProducts, getFeaturedArticles } from '@/lib/mock-data'

export default function HomePage() {
  const featuredArticles = getFeaturedArticles()
  const allCategories = ['Fashion', 'Lifestyle', 'Beauty', 'Culture', 'Watches', 'Travel']

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 3.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8 }
    }
  }

  return (
    <div className="min-h-screen bg-black-primary flex flex-col">
      <PageLoader />
      <CookieBanner />
      <NewsletterPopup />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <Header />

        <main className="flex-1">
          {/* Hero Section */}
          <motion.section variants={itemVariants} className="border-b border-border px-4 sm:px-6 py-12 sm:py-24">
            <div className="max-w-6xl mx-auto text-center">
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-widest mb-6 sm:mb-8 leading-tight text-balance">
                THE ART OF<br />
                <span className="text-gold-primary">LUXURY</span>
              </h1>
              <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto mb-8 text-balance">
                Discover curated stories on fashion, lifestyle, beauty, and culture from the world's most compelling voices.
              </p>
              <a
                href="/articles"
                className="inline-block px-6 sm:px-8 py-3 sm:py-4 bg-gold-primary text-black-primary font-bold tracking-widest hover:bg-gold-secondary transition-colors text-sm sm:text-base"
              >
                EXPLORE NOW
              </a>
            </div>
          </motion.section>

          {/* Horizontal Ad */}
          <motion.section variants={itemVariants} className="border-b border-border px-3 sm:px-6 py-3 sm:py-6">
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
          <motion.section variants={itemVariants} className="border-b border-border px-3 sm:px-6 py-3 sm:py-6">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-widest mb-8 sm:mb-12">FEATURED STORIES</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                {featuredArticles.map((article) => (
                  <ArticleCard key={article.id} {...article} featured={true} />
                ))}
              </div>
            </div>
          </motion.section>

          {/* Single Ad Full Width */}
          <motion.section variants={itemVariants} className="border-b border-border px-3 sm:px-6 py-3 sm:py-6">
            <div className="max-w-6xl mx-auto w-full">
              <SingleAd
                image="/luxury-fashion-runway-show.jpg"
                height="h-64 sm:h-96 md:h-screen"
              >
                <div className="text-center text-white">
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-widest">LIMITED COLLECTION</h3>
                  <p className="text-xs sm:text-sm tracking-widest mt-2">Exclusively Curated</p>
                </div>
              </SingleAd>
            </div>
          </motion.section>

          {allCategories.map((category) => {
            const categoryArticles = mockArticles
              .filter(article => article.category === category)
              .slice(0, 6)

            if (categoryArticles.length === 0) return null

            return (
              <motion.section key={category} variants={itemVariants} className="border-b border-border px-4 sm:px-6 py-8 sm:py-12">
                <div className="max-w-6xl mx-auto">
                  <div className="flex items-center justify-between mb-8 sm:mb-12">
                    <h2 className="text-3xl sm:text-4xl font-bold tracking-widest">{category.toUpperCase()}</h2>
                    <a href={`/${category.toLowerCase()}`} className="text-sm text-gold-primary hover:text-gold-secondary transition-colors font-bold tracking-widest">
                      VIEW ALL →
                    </a>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
                    {categoryArticles.map((article) => (
                      <ArticleCard key={article.id} {...article} />
                    ))}
                  </div>
                </div>
              </motion.section>
            )
          })}

          {/* Recommended Products with Vertical Ads */}
          <motion.section variants={itemVariants} className="border-b border-border px-4 sm:px-6 py-8 sm:py-12">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-widest mb-8 sm:mb-12">CURATED SELECTION</h2>
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 sm:gap-8">
                {/* Vertical Ad Sidebar */}
                <div className="lg:col-span-1 grid gap-3  ">
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

                {/* Products Grid */}
                <div className="lg:col-span-3">
                  <RecommendedItems items={mockProducts} columns={3} />
                </div>
              </div>
            </div>
          </motion.section>

          {/* Newsletter CTA */}
          <motion.section variants={itemVariants} className="border-b border-border px-4 sm:px-6 py-8 sm:py-12">
            <div className="max-w-6xl mx-auto">
              <div className="border border-border p-8 sm:p-12 text-center">
                <h2 className="text-3xl sm:text-4xl font-bold tracking-widest mb-4">DON&apos;T MISS OUT</h2>
                <p className="text-muted-foreground mb-8 max-w-2xl mx-auto text-sm sm:text-base text-balance">
                  Subscribe to receive exclusive stories, insider tips, and the latest in luxury lifestyle directly to your inbox.
                </p>
                <a
                  href="#newsletter"
                  className="inline-block px-6 sm:px-8 py-3 sm:py-4 bg-gold-primary text-black-primary font-bold tracking-widest hover:bg-gold-secondary transition-colors text-sm sm:text-base"
                >
                  SUBSCRIBE
                </a>
              </div>
            </div>
          </motion.section>
        </main>

        <Footer />
      </motion.div>
    </div>
  )
}
