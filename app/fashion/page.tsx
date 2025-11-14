'use client'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { ArticleCard } from '@/components/article-card'

const fashionArticles = [
  {
    id: '1',
    title: 'The Art of Minimalist Fashion',
    excerpt: 'Exploring how less becomes more in contemporary style.',
    category: 'Fashion',
    image: '/placeholder.svg?key=q2w8h',
    date: 'Nov 14, 2025',
    author: 'Sarah Mitchell',
    featured: true
  },
  {
    id: '2',
    title: 'Sustainable Luxury',
    excerpt: 'How high-end brands embrace eco-consciousness.',
    category: 'Fashion',
    image: '/placeholder.svg?key=r3x9i',
    date: 'Nov 4, 2025',
    author: 'Isabella Romano',
    featured: false
  },
]

export default function FashionPage() {
  return (
    <div className="min-h-screen bg-black-primary flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="border-b border-border px-6 py-20">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-5xl font-bold tracking-widest mb-6">FASHION</h1>
            <p className="text-lg text-muted-foreground">Curated stories on style, trends, and luxury fashion.</p>
          </div>
        </section>

        <section className="px-6 py-12">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {fashionArticles.map((article) => (
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
