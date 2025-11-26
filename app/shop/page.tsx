"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { useShop, ShopProvider, Products } from "@/components/shop-context";
import { LoginDialog } from "@/components/LoginModal";
import { useToast } from "@/components/toast/use-toast";
import { mockMagazineIssues, MagazineIssue } from "@/lib/mock-data";
import { useSession } from "@/hooks/use-session";
import { ProductCard } from "@/components/product-card";
import Spinner from "@/components/spinner";

const MagazineItemCard = ({ issue }: { issue: MagazineIssue }) => {
  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(issue.price);
  return (
    <div className="group flex flex-col">
      <Link
        href={`/shop/magazine/${issue.id}`}
        className="block relative overflow-hidden  transition-transform duration-300 group-hover:-translate-y-2"
      >
        <div className="aspect-3/4 relative">
          <Image
            src={issue.image}
            alt={issue.title}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black" />
        </div>
        <div className="absolute bottom-0 left-0 w-full p-4 text-left">
          <p className="text-xs font-bold text-gold-primary tracking-widest mb-1">
            ISSUE {issue.issueNumber}
          </p>
          <h3 className="text-lg font-bold text-white leading-tight">
            {issue.title}
          </h3>
        </div>
      </Link>
      <div className="mt-4 flex justify-between items-center px-2">
        <span className="text-sm text-muted-foreground">Digital Copy</span>
        <span className="text-gold-primary font-bold tracking-widest">
          {formattedPrice}
        </span>
      </div>
    </div>
  );
};

export default function ShopPage() {
  const { shopItems, loading } = useShop();
  const categories = new Set(
    shopItems?.flatMap((item) => item.categories.map((cat) => cat.name))
  );

  return (
    <>
      <div className="min-h-screen bg-black-primary flex flex-col">
        <Header />
        <main className="flex-1">
          <section className="relative py-24 px-6 border-b border-border bg-black-secondary/30">
            <div className="max-w-6xl mx-auto text-center">
              <h1 className="text-5xl md:text-7xl font-bold tracking-widest text-foreground mb-6">
                THE <span className="text-gold-primary">COLLECTION</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Curated essentials for the modern gentleman. From bespoke
                grooming to timeless accessories.
              </p>
            </div>
          </section>

          <section className="px-6 py-20 bg-[#0f0f0f] border-b border-border">
            <div className="max-w-6xl mx-auto">
              <div className="flex flex-col md:flex-row justify-between items-end mb-12">
                <div>
                  <h2 className="text-3xl font-bold tracking-widest text-white">
                    DIGITAL ISSUES
                  </h2>
                  <p className="text-muted-foreground mt-2">
                    Instant access to our latest editorials.
                  </p>
                </div>
                <Link
                  href="/shop/magazine"
                  className="hidden md:block text-gold-primary text-sm tracking-widest hover:underline underline-offset-4"
                >
                  VIEW ARCHIVE
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-12">
                {mockMagazineIssues.map((issue) => (
                  <div key={issue.id}>
                    <MagazineItemCard issue={issue} />
                  </div>
                ))}
              </div>
            </div>
          </section>

          <div className="space-y-20 py-20">
            {[...categories].map((category) => {
              const categoryProducts =
                shopItems?.filter((p) =>
                  p.categories.some((cat) => cat.name === category)
                ) || [];

              // Optional: Skip empty categories
              if (categoryProducts.length === 0) return null;

              return (
                <section key={category} className="px-6">
                  <div className="max-w-6xl mx-auto">
                    <div className="flex items-center gap-4 mb-12">
                      <h2 className="text-3xl font-bold tracking-widest text-foreground uppercase">
                        {category}
                      </h2>
                      <div className="h-px flex-1 bg-border" />
                      <Link
                        href={`/shop/category/${category
                          .toLowerCase()
                          .replace(/\s+/g, "-")}`}
                        className="text-xs text-muted-foreground hover:text-gold-primary tracking-widest"
                      >
                        VIEW ALL
                      </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                      {categoryProducts.map((product) => (
                        <div key={product.id}>
                          <ProductCard item={product} />
                        </div>
                      ))}
                    </div>

                    {categoryProducts.length === 0 && (
                      <p className="text-muted-foreground text-center py-12">
                        No products in this category yet.
                      </p>
                    )}
                  </div>
                </section>
              );
            })}

            {/* Loading state */}
            {loading && (
              <div className="flex justify-center py-20">
                <Spinner />
              </div>
            )}

            {/* Empty state */}
            {!loading && shopItems && shopItems.length === 0 && (
              <section className="px-6 py-20 text-center">
                <p className="text-muted-foreground">
                  No products available at this time.
                </p>
              </section>
            )}
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}
