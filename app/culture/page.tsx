'use client'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { ArticleCard } from '@/components/article-card'

const cultureArticles = [
  {
    id: '1',
    title: 'Contemporary Art Collectors',
    excerpt: 'Meet the visionaries reshaping the art world.',
    category: 'Culture',
    image: '/placeholder.svg?key=v7b3m',
    date: 'Nov 8, 2025',
    author: 'Marcus Chapman',
    featured: true
  },
]

export default function CulturePage() {
  return (
    <div className="min-h-screen bg-black-primary flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="border-b border-border px-6 py-20">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-5xl font-bold tracking-widest mb-6">CULTURE</h1>
            <p className="text-lg text-muted-foreground">Exploring art, design, and cultural excellence.</p>
          </div>
        </section>

        <section className="px-6 py-12">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {cultureArticles.map((article) => (
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
