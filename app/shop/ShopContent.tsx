"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ShopCategorySection } from "@/components/shop-category-section";
import { VerticalAd } from "@/components/vertical-ad";

export default function ShopContent() {
    return (
        <div className="min-h-screen bg-black-primary text-foreground flex flex-col">
            <Header />

            <main className="flex-1">
                {/* Shop Hero */}
                <section className="relative py-24 md:py-32 px-6 border-b border-border bg-black-primary overflow-hidden">
                    <div className="absolute inset-0 z-0">
                        <div className="absolute inset-0 bg-black-primary/80 z-10" />
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="https://images.unsplash.com/photo-1674965430133-4b92fae30450?w=500&auto=format&fit=crop&q=6" alt="Shop Background" className="w-full h-full object-cover opacity-80" />
                    </div>
                    <div className="absolute inset-0 bg-gold-primary/5 blur-[100px] opacity-20 pointer-events-none z-10" />
                    <div className="max-w-6xl mx-auto text-left relative z-20 grid grid-cols-1 md:grid-cols-2 gap-12 items-end">
                        <div>
                            <h4 className="text-gold-primary tracking-[0.2em] uppercase text-xs font-bold mb-4">The Collection</h4>
                            <h1 className="text-5xl md:text-7xl font-serif text-white mb-6 leading-tight">
                                Curated Essentials
                            </h1>
                        </div>
                        <div>
                            <p className="text-lg text-muted-foreground font-light leading-relaxed mb-6 border-l border-gold-primary/30 pl-6">
                                No mass listings. No noise. <br />
                                Just the pieces we believe in, selected with intention, tested for quality, and presented with the context that matters.
                            </p>
                        </div>
                    </div>
                </section>

                {/* 6.1 Editor's Picks */}
                <section id="editors-picks" className="py-20 border-b border-border">
                    <div className="container-responsive mb-12">
                        <div className="max-w-3xl">
                            <h2 className="text-3xl md:text-4xl font-serif text-white mb-4">Editor's Picks</h2>
                            <p className="text-muted-foreground font-light">
                                A monthly selection of standout items chosen for their craft, longevity, and quiet confidence.
                            </p>
                        </div>
                    </div>
                    <ShopCategorySection
                        title=""
                        categoryName="New Arrivals"
                        limit={5}
                    />
                </section>

                {/* 6.2 Gift Guide (Seasonal) */}
                <section id="gift-guide" className="py-20 border-b border-border bg-black-secondary/20">
                    <div className="container-responsive mb-12 flex flex-col md:flex-row justify-between items-end gap-8">
                        <div className="max-w-3xl">
                            <div className="inline-block px-3 py-1 border border-gold-primary text-gold-primary text-[10px] uppercase font-bold tracking-widest mb-4">Holiday Season</div>
                            <h2 className="text-3xl md:text-4xl font-serif text-white mb-4">Gift Guide</h2>
                            <p className="text-muted-foreground font-light">
                                Thoughtful, timeless gifts for the men who appreciate detail and quality.
                            </p>
                        </div>
                    </div>
                    <ShopCategorySection
                        title=""
                        categoryName="Gift Guides"
                        limit={4}
                    />
                </section>

                {/* 6.3 Brand Collaborations */}
                <section id="brand-collaborations" className="py-20 border-b border-border">
                    <div className="container-responsive mb-12">
                        <div className="max-w-3xl">
                            <h2 className="text-3xl md:text-4xl font-serif text-white mb-4">Brand Collaborations</h2>
                            <p className="text-muted-foreground font-light">
                                Exclusive products and limited collections crafted in partnership with brands we trust.
                            </p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 container-responsive">
                        <div className="lg:col-span-1">
                            <VerticalAd
                                title="Mode Men x Rolex"
                                description="Coming Soon"
                                image="/placeholders/collab-rolex.jpg"
                                width="w-full"
                                backgroundColor="#1a1a1a"
                                textColor="#fff"
                            />
                        </div>
                        <div className="lg:col-span-3">
                            <ShopCategorySection
                                title=""
                                categoryName="Brand Collaborations"
                                limit={3}
                            />
                        </div>
                    </div>
                </section>

                {/* Others */}
                <section className="py-20">
                    <ShopCategorySection title="Accessories" categoryName="Accessories" limit={4} />
                    <div className="h-12"></div>
                    <ShopCategorySection title="Grooming" categoryName="Grooming & Fragrance" limit={4} />
                </section>

            </main>

            <Footer />
        </div>
    );
}
