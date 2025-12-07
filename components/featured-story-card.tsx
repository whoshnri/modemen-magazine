"use client";

import Link from "next/link";
import { useState } from "react";
import parse from "html-react-parser"

interface FeaturedStoryCardProps {
    id: string;
    title: string;
    category: { name: string }[];
    image: string;
    date: Date;
    slug: string;
    author: string;
    excerpt: string 

}

export function FeaturedStoryCard({
    id,
    title,
    category,
    image,
    date,
    author,
    slug,
    excerpt,
}: FeaturedStoryCardProps) {
    const [isHovered, setIsHovered] = useState(false);
    const parsed = parse(excerpt)

    return (
        <Link href={`/articles/${category[0]?.name.toLocaleLowerCase()}/${slug}`}>
            <div
                className="group flex flex-col md:flex-row gap-6 items-start cursor-pointer"
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
                            {category.map((cat) => cat.name.replace("_", " ")).join(", ")}
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
