"use client";

import Link from "next/link";
import { useState } from "react";
import { Article, Tag, SubTags } from "@/lib/generated/prisma/client";

// Define the type locally if not easily importable, or import if possible.
interface ArticleWithCategory extends Article {
}

interface BigArticlePreviewProps {
  article: ArticleWithCategory;
}

export default function BigArticlePreview({ article }: BigArticlePreviewProps) {
  const [isHovered, setIsHovered] = useState(false);

  if (!article) return null;

  return (
    <section className="relative w-full h-[85vh] overflow-hidden group">
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full">
        <img
          src={article.bannerImage || "/placeholder.svg"}
          alt={article.title}
          className="w-full h-full object-cover transition-transform duration-1000 ease-out"
          style={{
            transform: isHovered ? "scale(1.05)" : "scale(1)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black-primary via-black-primary/60 to-transparent opacity-90" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full max-w-6xl mx-auto px-4 sm:px-6 flex flex-col justify-end pb-16 sm:pb-24">
        <div
          className="max-w-3xl"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Category/Tags */}
          <div className="flex flex-wrap gap-2 mb-4 ">
            <span
              className="px-3 py-1 bg-gold-primary text-black-primary text-xs font-bold tracking-widest uppercase"
            >
              {article.category.replace(/_/g, " ")}
            </span>
            {article.subcategory && (
              <span
                className="px-3 py-1 border border-gold-primary text-gold-primary text-xs font-bold tracking-widest uppercase"
              >
                {article.subcategory.replace(/_/g, " ")}
              </span>
            )}
          </div>

          {/* Title */}

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight  transition-colors duration-300">
            {article.title}
          </h1>

          {/* Meta Info */}
          <div className="flex items-center gap-6 text-sm sm:text-base text-gray-300 mb-8">
            <span className="uppercase tracking-wider font-medium">
              By {article.writtenBy}
            </span>
            <span className="w-1 h-1 bg-gold-primary rounded-full" />
            <span className="uppercase tracking-wider">
              {new Date(article.publicationDate).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
          </div>

          {/* Action Button */}
          <Link
            href={`/articles/${article.category.toLowerCase()}/${article.slug}`}
            className="inline-flex border border-gold-primary items-center gap-3 text-gold-primary font-bold tracking-widest uppercase group/btn p-3 hover:text-black hover:bg-gold-primary transition-colors duration-300"
          >
            Read Full Story
          </Link>
        </div>
      </div>
    </section>
  );
}
