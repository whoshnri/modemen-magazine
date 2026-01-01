"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Products, useShop } from "@/components/shop-context";
import { ProductCard } from "@/components/product-card";
import { useState, useMemo } from "react";
import Spinner from "@/components/spinner";

const TYPE_DISPLAY_NAMES: { [key: string]: string } = {
    'BAGS': 'Bespoke Bags',
    'BELTS': 'Designer Belts',
    'BLAZERS': 'Tailored Blazers',
    'CAPS': 'Executive Caps',
    'JEANS': 'Luxury Denim',
    'JOGGERS': 'Refined Joggers',
    'PERFUMES': 'Signature Fragrances',
    'SUNGLASSES': 'Premium Eyewear',
    'FRAMES': 'Optical Frames',
    'SHIRTS': 'Formal Shirts',
    'POLOS': 'Classic Polos',
    'SHOES': 'Luxury Footwear',
    'SHORTS': 'Tailored Shorts',
    'SWEATERS': 'Knitwear',
    'TSHIRTS': 'Essential Tees',
    'WALLETS': 'Leather Goods',
    'OTHER': 'Curated Collection'
};

export default function ShopContent() {
    const { shopItems, loading } = useShop();
    const [visibleCounts, setVisibleCounts] = useState<{ [key: string]: number }>({});

    // Group items by itemType
    const groupedItems = useMemo(() => {
        if (!shopItems) return {};
        const groups: { [key: string]: Products[] } = {};
        shopItems.forEach(item => {
            const type = item.itemType || 'OTHER';
            if (!groups[type]) groups[type] = [];
            groups[type].push(item);
        });
        return groups;
    }, [shopItems]);

    const handleLoadMore = (type: string) => {
        setVisibleCounts(prev => ({
            ...prev,
            [type]: (prev[type] || 4) + 4
        }));
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black-primary text-foreground flex flex-col items-center justify-center">
                <Spinner />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black-primary text-foreground flex flex-col">
            <Header />

            <main className="flex-1">
                {/* Shop Hero */}
                <section className="relative py-24 md:py-32 px-6 border-b border-border bg-black-primary overflow-hidden">
                    <div className="absolute inset-0 z-0">
                        <div className="absolute inset-0 bg-black-primary/80 z-10" />
                        <img src="https://images.unsplash.com/photo-1674965430133-4b92fae30450?w=500&auto=format&fit=crop&q=6" alt="Shop Background" className="w-full h-full object-cover opacity-80" />
                    </div>
                    <div className="absolute inset-0 bg-gold-primary/5 blur-[100px] opacity-20 pointer-events-none z-10" />
                    <div className="max-w-6xl mx-auto text-left relative z-20 grid grid-cols-1 md:grid-cols-2 gap-12 items-end">
                        <div>
                            <h4 className="text-gold-primary tracking-[0.2em] uppercase text-xs font-bold mb-4">The Collection</h4>
                            <h1 className="text-5xl md:text-7xl font-serif text-white mb-6 leading-tight uppercase">
                                Curated Essentials
                            </h1>
                        </div>
                        <div>
                            <p className="text-lg text-muted-foreground font-light leading-relaxed mb-6 border-l border-gold-primary/30 pl-6">
                                Precision in tailoring. Intention in accessories. <br />
                                A ritual of quality that speaks before you do.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Grouped Sections */}
                <div className="py-12">
                    {Object.entries(groupedItems)
                      .sort(([a], [b]) => {
                        // Keep OTHER at the end, everything else alphabetical
                        if (a === 'OTHER') return 1;
                        if (b === 'OTHER') return -1;
                        return a.localeCompare(b);
                      })
                      .map(([type, items]) => {
                        const visibleCount = visibleCounts[type] || 4;
                        const visibleItems = items.slice(0, visibleCount);
                        const hasMore = items.length > visibleCount;
                        const displayName = TYPE_DISPLAY_NAMES[type] || type.replace(/_/g, ' ');

                        return (
                            <section key={type} className="py-16 border-b border-white/5 last:border-0">
                                <div className="container-responsive">
                                    <div className="flex justify-between items-baseline mb-12 border-b border-gold-primary/20 pb-4">
                                        <h2 className="text-2xl md:text-3xl font-serif text-white uppercase tracking-widest font-bold">
                                            {displayName}
                                        </h2>
                                        <div className="flex items-center gap-4">
                                            <span className="text-[10px] text-gold-primary/60 font-mono tracking-tighter">
                                                {items.length} PIECES IN STOCK
                                            </span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                                        {visibleItems.map(item => (
                                            <ProductCard key={item.id} item={item} />
                                        ))}
                                    </div>

                                    {hasMore && (
                                        <div className="mt-16 text-center">
                                            <button 
                                                onClick={() => handleLoadMore(type)}
                                                className="px-10 py-4 border border-white/10 text-white text-[10px] font-bold uppercase tracking-[0.3em] hover:border-gold-primary hover:text-gold-primary transition-all duration-500 bg-white/5 hover:bg-white/10"
                                            >
                                                Load More
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </section>
                        );
                    })}
                </div>
            </main>

            <Footer />
        </div>
    );
}
