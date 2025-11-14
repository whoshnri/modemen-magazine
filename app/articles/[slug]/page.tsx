'use client'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { ArticleCard } from '@/components/article-card'
import { VerticalAd } from '@/components/vertical-ad'
import { mockArticles, getArticleBySlug, getRelatedArticles } from '@/lib/mock-data'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { use } from 'react'

export default function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const article = getArticleBySlug(slug)
  const relatedArticles = article ? getRelatedArticles(article.id, 3) : []

  if (!article) {
    return (
      <div className="min-h-screen bg-black-primary flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-widest mb-4">Article Not Found</h1>
            <Link href="/articles" className="text-gold-primary hover:text-gold-secondary transition-colors">
              Back to Articles
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

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
          <div className="max-w-4xl mx-auto">
            <Link href="/articles" className="text-sm text-gold-primary hover:text-gold-secondary transition-colors mb-6 inline-block">
              ← BACK TO ARTICLES
            </Link>

            <div className="flex items-center gap-4 mb-6 flex-wrap">
              <span className="text-xs font-bold tracking-widest text-gold-primary uppercase">{article.category}</span>
              <span className="text-xs text-muted-foreground">{article.date}</span>
              <span className="text-xs text-muted-foreground">{article.readTime}</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6 leading-tight text-balance">
              {article.title}
            </h1>

            <div className="flex items-center justify-between pt-6 border-t border-border">
              <div>
                <p className="text-xs font-bold tracking-widest text-muted-foreground uppercase">By</p>
                <p className="text-lg font-bold">{article.author}</p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Featured Image */}
        <motion.section
          className="border-b border-border px-4 sm:px-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="max-w-4xl mx-auto w-full">
            <img
              src={article.image || "/placeholder.svg"}
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
                {article.content.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="text-base sm:text-lg text-foreground leading-relaxed mb-6 text-justify">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            {/* Sidebar Ad */}
            <div className="lg:col-span-1">
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
            <h2 className="text-3xl sm:text-4xl font-bold tracking-widest mb-8 sm:mb-12">READ NEXT</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {relatedArticles.map((relArticle) => (
                <ArticleCard key={relArticle.id} {...relArticle} />
              ))}
            </div>
          </div>
        </motion.section>
      </main>

      <Footer />
    </div>
  )
}
