'use client'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { ArticleCard } from '@/components/article-card'
import { HorizontalAd } from '@/components/horizontal-ad'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { mockArticles } from '@/lib/mock-data'

const categories = ['All', 'Fashion', 'Lifestyle', 'Beauty', 'Culture', 'Watches', 'Travel']

export default function ArticlesPage() {
  const [selectedCategory, setSelectedCategory] = useState('All')

  const filteredArticles = selectedCategory === 'All'
    ? mockArticles
    : mockArticles.filter(article => article.category === selectedCategory)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <div className="min-h-screen bg-black-primary flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="border-b border-border px-4 sm:px-6 py-8 sm:py-16">
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-widest mb-4">ARTICLES</h1>
            <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto text-balance">
              Explore our curated collection of articles on fashion, lifestyle, beauty, and culture.
            </p>
          </div>
        </section>

        {/* Ad Section */}
        <section className="border-b border-border px-4 sm:px-6 py-8 sm:py-12">
          <div className="max-w-6xl mx-auto">
            <HorizontalAd
              title="Featured Partner"
              description="Discover premium content and exclusive insights"
              image="/placeholder.svg?key=rg03k"
              link="#"
            />
          </div>
        </section>

        {/* Filter Section */}
        <section className="border-b border-border px-4 sm:px-6 py-6 sm:py-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-wrap gap-3 sm:gap-4">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm font-bold tracking-widest transition-all ${
                    selectedCategory === category
                      ? 'bg-gold-primary text-black-primary'
                      : 'border border-border text-foreground hover:border-gold-primary'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Articles Grid */}
        <motion.section
          className="border-b border-border px-4 sm:px-6 py-8 sm:py-12"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <div className="max-w-6xl mx-auto">
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
              variants={containerVariants}
            >
              {filteredArticles.map((article) => (
                <motion.div key={article.id} variants={itemVariants}>
                  <ArticleCard {...article} />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.section>

        {/* Empty State */}
        {filteredArticles.length === 0 && (
          <section className="border-b border-border px-4 sm:px-6 py-12 sm:py-16">
            <div className="max-w-6xl mx-auto text-center">
              <p className="text-muted-foreground">No articles found in this category.</p>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  )
}
