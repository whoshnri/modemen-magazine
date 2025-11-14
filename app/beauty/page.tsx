'use client'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { ArticleCard } from '@/components/article-card'

const beautyArticles = [
  {
    id: '1',
    title: 'The Science of Skincare',
    excerpt: 'What actually works in your beauty routine.',
    category: 'Beauty',
    image: '/placeholder.svg?key=u6a2l',
    date: 'Nov 10, 2025',
    author: 'Dr. Emma Wilson',
    featured: true
  },
]

export default function BeautyPage() {
  return (
    <div className="min-h-screen bg-black-primary flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="border-b border-border px-6 py-20">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-5xl font-bold tracking-widest mb-6">BEAUTY</h1>
            <p className="text-lg text-muted-foreground">Premium beauty insights and skincare expertise.</p>
          </div>
        </section>

        <section className="px-6 py-12">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {beautyArticles.map((article) => (
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
