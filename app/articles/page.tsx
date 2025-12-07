"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ArticleCard } from "@/components/article-card";
import { SingleAd } from "@/components/single-ad";
import { motion, AnimatePresence } from "framer-motion";
import { Suspense, useEffect, useState, useTransition } from "react";
import { fetchAllArticles } from "../actions/fetchArticles";
import { Article, Tag } from "@prisma/client";
import { useSearchParams, useRouter } from "next/navigation";
import Spinner from "@/components/spinner";

const categories: (Tag | "All")[] = [
  "All", "STYLE", "GROOMING", "CULTURE", "BUSINESS_MONEY", "LIFE", "TECH_INNOVATION"
];

type ArticleWithTags = Article & { tags: { name: string }[] };

export default function ArticlesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  return (
    <Page router={router} searchParams={searchParams} />
  );
}

interface PageProps {
  router: ReturnType<typeof useRouter>;
  searchParams: ReturnType<typeof useSearchParams>;
}

function Page({ router, searchParams }: PageProps) {


  const [articles, setArticles] = useState<ArticleWithTags[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Tag | "All">(
    (searchParams.get("category") as Tag) || "All"
  );
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || ""
  );

  const term = searchParams.get("search") || ""

  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isPending, startTransition] = useTransition();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false)

  // Main data fetching logic, now uses the live searchTerm state
  const loadArticles = async (type: "initial" | "append") => {
    if (isPending || (type === "append" && !hasMore)) return;

    startTransition(async () => {
      const currentOffset = type === "initial" ? 0 : offset;
      const response = await fetchAllArticles(
        currentOffset, 20, searchTerm, selectedCategory
      );

      if (response.data) {
        setArticles(response.data)
        setOffset(currentOffset + response.data.length);
        setHasMore(response.data.length === 20);
      } else {
        setHasMore(false);
      }
    });
    setMounted(true)

  };

  const loadArticles2 = async (val: string) => {
    if (isPending && !hasMore) return;

    startTransition(async () => {
      const response = await fetchAllArticles(
        0, 20, val, selectedCategory
      );

      if (response.data) {
        setArticles(response.data)
        setOffset(0 + response.data.length);
        setHasMore(response.data.length === 20);
      } else {
        setHasMore(false);
      }
    });
    setMounted(true)

  };

  // --- REFACTORED: Handle search on form submission ---
  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    const params = new URLSearchParams(window.location.search);
    params.delete("search");
    if (searchTerm) {
      params.set("search", searchTerm);
    } else {
      params.delete("search");
    }
    if (selectedCategory !== "All") {
      params.set("category", selectedCategory);
    } else {
      params.delete("category");
    }
    router.replace(`/articles?${encodeURI(params.toString())}`);
    loadArticles("initial");
  };

  useEffect(() => {
    const term = searchParams.get("search")
    if (term && (term !== searchTerm)) {
      loadArticles2(term)
      setSearchTerm(term)
    }
  }, [searchParams])



  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (selectedCategory && selectedCategory !== "All") {
      params.set("category", selectedCategory);
      setMounted(false)
    } else {
      params.delete("category");
    }
    router.replace(`/articles?${encodeURIComponent(params.toString())}`);
    loadArticles("initial");
  }, [selectedCategory, router]);

  useEffect(() => {
    loadArticles("initial");
  }, []);

  return (
    <>
      <div className="min-h-screen bg-black-primary flex flex-col">
        <Header />
        <main className="flex-1">
          <section className="border-b border-border px-4 sm:px-6 py-8 sm:py-16">
            <div className="max-w-6xl mx-auto text-center">
              <motion.h1 className="text-4xl sm:text-6xl font-bold tracking-widest mb-4">ARTICLES</motion.h1>
            </div>
          </section>

          {/* --- REFACTORED: Search and Filter Section with Form --- */}
          <section className="border-b border-border px-4 sm:px-6 py-6 sticky top-0 z-10 bg-black-primary/80 backdrop-blur-sm">
            <form
              onSubmit={handleSearch}
              className="max-w-6xl mx-auto flex gap-4"
            >
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search articles and press Enter..."
                className="grow bg-black-secondary border border-border p-3 text-sm focus:border-gold-primary focus:outline-none"
              />
              <button
                type="submit"
                className="px-6 py-3 text-sm font-bold tracking-widest bg-gold-primary text-black-primary hover:bg-gold-secondary"
              >
                SEARCH
              </button>
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="px-6 py-3 text-sm font-bold tracking-widest border border-border hover:border-gold-primary"
              >
                {selectedCategory === "All" ? "FILTER" : selectedCategory}
              </button>
            </form>
          </section>

          <motion.section className="px-4 sm:px-6 py-8 sm:py-12">

            <div className="max-w-6xl mx-auto">
              {term && (
                <p className="text-sm text-muted-foreground mb-6">
                  Showing results for "<span className="italic">{term}</span>"
                </p>
              )}
              <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {articles.map((article) => (
                  <motion.div key={article.id}>
                    <ArticleCard
                      title={article.title} category={article.tags} id={article.id}
                      image={article.bannerImage || "/placeholder.svg"}
                      date={new Date(article.publicationDate)}
                      author={article.writtenBy} slug={article.slug}
                    />
                  </motion.div>
                ))}
              </motion.div>
              {isPending && articles.length === 0 && <div className="text-center text-muted-foreground mt-12"><Spinner /></div>}
              {!isPending && articles.length === 0 && <p className="text-center text-muted-foreground mt-12">No articles found.</p>}
            </div>
          </motion.section>

          <section className="px-4 sm:px-6 py-8 sm:py-12">
            <div className="max-w-6xl mx-auto">
              <SingleAd />
            </div>
          </section>

          {hasMore && (
            <div className="text-center py-6">
              <button
                onClick={() => loadArticles("append")}
                disabled={isPending}
                className="px-6 py-3 border text-sm tracking-widest hover:border-gold-primary disabled:cursor-not-allowed disabled:text-muted-foreground"
              >
                {isPending ? "LOADING..." : "LOAD MORE"}
              </button>
            </div>
          )}
        </main>
        <Footer />
      </div>

      <FilterModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />
    </>
  );
}

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: (Tag | "All")[];
  selectedCategory: Tag | "All";
  onSelectCategory: (category: Tag | "All") => void;
}

const FilterModal = ({
  isOpen,
  onClose,
  categories,
  selectedCategory,
  onSelectCategory,
}: FilterModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="bg-black-secondary border border-border w-full max-w-lg m-4 p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold tracking-widest mb-6">
              FILTER BY CATEGORY
            </h3>
            <div className="flex flex-wrap gap-3">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => {
                    onSelectCategory(category);
                    onClose();
                  }}
                  className={`px-4 py-2 text-xs font-bold tracking-widest transition-all ${selectedCategory === category
                    ? "bg-gold-primary text-black-primary"
                    : "border border-border text-foreground hover:border-gold-primary"
                    }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
