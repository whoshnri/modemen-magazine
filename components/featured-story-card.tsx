"use client";

import Link from "next/link";
import { useState } from "react";
import parse from "html-react-parser"
import { $Enums } from "@/lib/generated/prisma/client";

interface FeaturedStoryCardProps {
    id: string;
    title: string;
    category: $Enums.Tag;
    subcategory?: $Enums.SubTags;
    image: string;
    date: Date;
    slug: string;
    author: string;
    excerpt: string
    idx : number

}

export function FeaturedStoryCard({
    id,
    title,
    category,
    subcategory,
    image,
    date,
    author,
    slug,
    excerpt,
    idx
}: FeaturedStoryCardProps) {
    const [isHovered, setIsHovered] = useState(false);
    const parsed = parse(excerpt)

    return (
        <Link href={`/articles/${category.toLowerCase()}/${slug}`}>
            <div
                className={`group flex flex-col md:flex-row ${idx % 2 !== 0 ? "md:flex-row-reverse" : ""} gap-6 items-start cursor-pointer`}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* Image Section */}
                <div className="w-full md:w-1/2 aspect-[5/3] overflow-hidden bg-muted-foreground/10">
                    <img
                        src={image || "/placeholder.svg"}
                        alt={title}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                </div>

                {/* Content Section */}
                <div className="w-full md:w-1/2 justify-center aspect-[5/3] flex flex-col p-2 ">
                    <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight mb-4 group-hover:text-gold-primary transition-colors duration-300">
                        {title}
                    </h3>

                    <div className="line-clamp-4  mt-2 text-muted-foreground">{parsed}</div>

                    <div className="mt-auto space-y-1">
                        <div className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
                            {category.replace(/_/g, " ")} {subcategory && ` / ${subcategory.replace(/_/g, " ")}`}
                        </div>
                        <div className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
                            {author} /
                            {/* {date.toLocaleDateString()} */}
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
