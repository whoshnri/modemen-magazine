'use client'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { ArticleCard } from '@/components/article-card'

const lifestyleArticles = [
  {
    id: '1',
    title: 'Luxury Travel Guide 2025',
    excerpt: 'Discover the world\'s most exclusive destinations.',
    category: 'Lifestyle',
    image: '/placeholder.svg?key=s4y0j',
    date: 'Nov 12, 2025',
    author: 'James Sterling',
    featured: true
  },
  {
    id: '2',
    title: 'Master Watchmaking',
    excerpt: 'The heritage behind luxury timepieces.',
    category: 'Lifestyle',
    image: '/placeholder.svg?key=t5z1k',
    date: 'Nov 6, 2025',
    author: 'Christopher Bond',
    featured: false
  },
]

export default function LifestylePage() {
  return (
    <div className="min-h-screen bg-black-primary flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="border-b border-border px-6 py-20">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-5xl font-bold tracking-widest mb-6">LIFESTYLE</h1>
            <p className="text-lg text-muted-foreground">Stories on luxury living, travel, and sophistication.</p>
          </div>
        </section>

        <section className="px-6 py-12">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {lifestyleArticles.map((article) => (
                <ArticleCard key={article.id} {...article} />
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
