import { Article, $Enums } from "@/lib/generated/prisma/client";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { fetchSpecArticles } from "@/app/actions/fetchArticles";
import CategoryPageClient from "./page.client";
import { Metadata } from "next";

// Define banners mapping
const CATEGORY_BANNERS: Record<string, string> = {
  style: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=1600&auto=format&fit=crop&q=80",
  culture: "https://images.unsplash.com/photo-1760552973934-8f749999a906?w=500&auto=format&fit=crop&q=80",
  business_and_money: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1600&auto=format&fit=crop&q=80",
};

interface Props {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { category } = await params;
  const { subcategory } = await searchParams;
  const catName = category.replace(/-/g, " ").replace(/_/g, " ").toUpperCase();
  const subName = typeof subcategory === 'string' ? subcategory.replace(/-/g, " ").replace(/_/g, " ").toUpperCase() : "";

  const title = subName ? `${subName} | ${catName} | Mode Men` : `${catName} | Mode Men`;
  const description = `Explore our curated articles on ${subName ? subName + " within " : ""}${catName}.`;

  return {
    title,
    description,
  };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { category } = await params;
  const resolvedSearchParams = await searchParams;
  const subcategory = typeof resolvedSearchParams.subcategory === 'string' ? resolvedSearchParams.subcategory : undefined;

  // Use the new fetchSpecArticles (which accepts string slugs)
  const initialData = await fetchSpecArticles(category, 0, subcategory);
  const initialArticles = initialData.data || [];
  const initialHasMore = initialArticles.length === 9; // Assuming page size 9

  // Determine Banner
  const bannerKey = category.toLowerCase().replace(/-/g, "_");
  const bannerImage = CATEGORY_BANNERS[bannerKey] || CATEGORY_BANNERS["style"];

  const catName = category.replace(/-/g, " ").replace(/_/g, " ");
  const subName = subcategory ? subcategory.replace(/-/g, " ").replace(/_/g, " ") : "";

  return (
    <div className="min-h-screen bg-black-primary flex flex-col">
      <Header />
      <main className="flex-1">
        {/* --- Hero Section (Server Rendered) --- */}
        <section className="relative px-6 py-32 border-b border-border overflow-hidden">
          {bannerImage && (
            <>
              <div className="absolute inset-0 z-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={bannerImage}
                  alt={category}
                  className="w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-black-primary/70 z-10 mix-blend-multiply" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black-primary via-transparent to-transparent z-10" />
            </>
          )}
          <div className="relative z-20 max-w-6xl mx-auto">
            <div className="flex flex-col gap-2">
              {subcategory && <span className="text-gold-primary tracking-widest text-sm font-bold uppercase">{catName}</span>}
              <h1 className="text-5xl md:text-7xl font-bold tracking-widest mb-6 text-white uppercase">
                {subName || catName}
              </h1>
            </div>

            <p className="text-xl text-gray-200 max-w-2xl font-light leading-relaxed">
              Explore our curated collection of articles focused on <span className="capitalize">{subName || catName}</span>.
              Stay updated with the latest trends, tips, and insights.
            </p>
          </div>
        </section>

        {/* --- Main Content Section --- */}
        <section className="px-6 py-12">
          <CategoryPageClient
            initialArticles={initialArticles}
            category={category}
            subcategory={subcategory}
            initialHasMore={initialHasMore}
          />
        </section>
      </main>
      <Footer />
    </div>
  );
}
