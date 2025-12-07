"use client";

import Link from "next/link";
import { Article, ArticleTag } from "@prisma/client";

interface ArticleWithTags extends Article {
  tags: { name: string; }[]
}

interface ArticleListCompactProps {
  title?: string;
  articles: ArticleWithTags[];
  className?: string;
}

export function ArticleListCompact({ title, articles, className = "" }: ArticleListCompactProps) {
  if (!articles || articles.length === 0) return null;

  return (
    <div className={`flex flex-col ${className}`}>
      {title && (
        <h3 className="text-xl font-bold tracking-widest mb-6 border-l-4 border-gold-primary pl-4 uppercase">
          {title}
        </h3>
      )}
      
      <div className="flex flex-col gap-6">
        {articles.map((article) => (
          <Link 
            key={article.id} 
            href={`/articles/${article.tags[0]?.name.toLowerCase()}/${article.slug}`}
            className="group flex gap-4 items-start"
          >
            {/* Thumbnail */}
            <div className="w-24 h-24 flex-shrink-0 overflow-hidden relative">
               <img
                src={article.bannerImage || "/placeholder.svg"}
                alt={article.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold text-gold-primary uppercase tracking-wider">
                  {article.tags[0]?.name.replace("_", " ")}
                </span>
              </div>
              
              <h4 className="text-base font-bold leading-snug mb-2 line-clamp-2 group-hover:text-gold-primary transition-colors">
                {article.title}
              </h4>
              
              <span className="text-xs text-muted-foreground uppercase tracking-wide">
                {new Date(article.publicationDate).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric'
                })}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
