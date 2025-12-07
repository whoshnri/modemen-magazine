"use client";

import Link from "next/link";
import { useState } from "react";

interface ArticleCardProps {
  id: string;
  title: string;
  category: { name: string }[];
  image: string;
  date: Date;
  slug: string;
  author: string;
  featured?: boolean;
}

export function ArticleCard({
  id,
  title,
  category,
  image,
  date,
  author,
  slug,
  featured = false,
}: ArticleCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link href={`/articles/${category[0]?.name.toLocaleLowerCase()}/${slug}`}>
      <div
        className="border border-border transition-all duration-300 cursor-pointer"
        style={{
          borderColor: isHovered ? "#d4af37" : "#2a2a2a",
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          className={featured ? "h-96" : "h-48"}
          style={{ overflow: "hidden" }}
        >
          <img
            src={image || "/placeholder.svg"}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500"
            style={{
              transform: isHovered ? "scale(1.05)" : "scale(1)",
            }}
          />
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold tracking-widest text-gold-primary uppercase">
              {category.map((cat) => cat.name.replace("_", " ")).join(", ")}
            </span>
          </div>
          <h3
            className={`font-bold tracking-wide mb-3 leading-tight ${
              featured ? "text-2xl" : "text-lg"
            }`}
          >
            {title}
          </h3>
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <span className="text-xs text-muted-foreground uppercase">
              {author}
            </span>
            <span className="text-gold-primary text-sm font-bold">→</span>
          </div>
          {/* <span className="text-sm text-muted-foreground">{date.toLocaleDateString()}</span> */}
        </div>
      </div>
    </Link>
  );
}
