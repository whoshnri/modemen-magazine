"use client";

import { useState, useEffect } from "react";
import { Product } from "@prisma/client";
import { motion } from "framer-motion";
import { fetchProductsByCategory } from "@/app/actions/shopOps";
import Spinner from "@/components/spinner";
import Image from "next/image";
import { ProductCard } from "./product-card";

interface ShopCategorySectionProps {
    title: string;
    categoryName: string;
}

export function ShopCategorySection({ title, categoryName }: ShopCategorySectionProps) {
    const [products, setProducts] = useState<Product[]>([]);
    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);

    useEffect(() => {
        const loadInitial = async () => {
            setLoading(true);
            const res = await fetchProductsByCategory(categoryName, 0, 4);
            setProducts(res.data);
            setHasMore(res.hasMore);
            setOffset(res.data.length);
            setLoading(false);
        };
        loadInitial();
    }, [categoryName]);

    const loadMore = async () => {
        if (loadingMore || !hasMore) return;
        setLoadingMore(true);
        const res = await fetchProductsByCategory(categoryName, offset, 4);
        if (res.data.length > 0) {
            setProducts((prev) => [...prev, ...res.data]);
            setOffset((prev) => prev + res.data.length);
            setHasMore(res.hasMore);
        } else {
            setHasMore(false);
        }
        setLoadingMore(false);
    };

    return (
        <section className="py-16 border-b border-white/10 last:border-0">
            <div className="max-w-7xl mx-auto px-6">
                <h2 className="text-3xl md:text-4xl font-bold tracking-widest text-white mb-12 uppercase">
                    <span className="text-gold-primary mr-2">/</span>
                    {title}
                </h2>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <Spinner />
                    </div>
                ) : products.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 sm:gap-8">
                            {products.map((product) => (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    key={product.id}
                                    className="group"
                                >
                                    <ProductCard item={product} />
                                </motion.div>
                            ))}
                        </div>

                        {hasMore && (
                            <div className="mt-16 text-center">
                                <button
                                    onClick={loadMore}
                                    disabled={loadingMore}
                                    className="inline-flex items-center gap-2 px-8 py-3 border border-white/20 text-xs font-bold tracking-[0.2em] uppercase text-white hover:bg-gold-primary hover:text-black-primary hover:border-gold-primary transition-all disabled:opacity-50"
                                >
                                    {loadingMore ? <Spinner /> : "Load More"}
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="py-24 text-center border border-white/5 bg-white/[0.02]">
                        <p className="text-gold-primary tracking-[0.2em] text-sm uppercase mb-2">Coming Soon</p>
                        <p className="text-muted-foreground/50">Our curators are currently selecting items for {title}.</p>
                    </div>
                )}
            </div>
        </section>
    );
}
