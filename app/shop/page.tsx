"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ShopCategorySection } from "@/components/shop-category-section";

const SHOP_CATEGORIES = [
  "New Arrivals",
  "Men's Fashion",
  "Accessories",
  "Grooming & Fragrance",
  "Lifestyle Products",
  "Gift Guides",
  "Brand Collaborations",
  "Advertorial Product Placement"
];

export default function ShopPage() {
  return (
    <div className="min-h-screen bg-black-primary text-foreground flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Shop Hero */}
        <section className="relative py-32 px-6 border-b border-border bg-black-secondary/30 overflow-hidden">
          <div className="absolute inset-0 bg-gold-primary/5 blur-3xl opacity-20" />
          <div className="max-w-6xl mx-auto text-center relative z-10">
            <h1 className="text-6xl md:text-8xl font-bold tracking-widest text-white mb-6">
              THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-primary to-white">SHOP</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-serif italic">
              Curated luxury for the modern connoisseur.
            </p>
          </div>
        </section>

        <div className="space-y-0 bg-black-primary">
          {SHOP_CATEGORIES.map((category, index) => (
            <ShopCategorySection
              key={category}
              title={category}
              categoryName={category}
            />
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
