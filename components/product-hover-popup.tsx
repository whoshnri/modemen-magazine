"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ShoppingBag, ArrowRight } from "lucide-react";

interface ProductHoverPopupProps {
    productName: string;
    productImage: string;
    productPrice: string;
    productLink: string;
    children: React.ReactNode;
}

export function ProductHoverPopup({
    productName,
    productImage,
    productPrice,
    productLink,
    children
}: ProductHoverPopupProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <span
            className="relative inline-block"
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
        >
            <span className="cursor-pointer border-b border-gold-primary/50 hover:border-gold-primary hover:bg-gold-primary/10 transition-colors px-0.5">
                {children}
            </span>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 z-50 w-64 bg-black-primary border border-border shadow-2xl"
                    >
                        <div className="relative aspect-square w-full">
                            <Image
                                src={productImage}
                                alt={productName}
                                fill
                                className="object-cover"
                            />
                            <div className="absolute top-2 right-2 bg-black/80 text-gold-primary text-xs font-bold px-2 py-1">
                                {productPrice}
                            </div>
                        </div>

                        <div className="p-4 bg-black-secondary border-t border-border">
                            <h4 className="text-white font-serif text-sm font-bold mb-1 truncate">{productName}</h4>
                            <div className="flex gap-2 mt-3">
                                <Link
                                    href={productLink}
                                    className="flex-1 bg-gold-primary text-black-primary text-[10px] uppercase font-bold tracking-widest py-2 flex items-center justify-center gap-1 hover:bg-gold-secondary transition-colors"
                                >
                                    <ShoppingBag className="w-3 h-3" />
                                    Shop
                                </Link>
                                <Link
                                    href={productLink}
                                    className="flex-1 border border-white/20 text-white text-[10px] uppercase font-bold tracking-widest py-2 flex items-center justify-center hover:bg-white hover:text-black-primary transition-colors"
                                >
                                    Details
                                </Link>
                            </div>
                        </div>

                        {/* Arrow */}
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-black-secondary w-0 h-0"></div>
                    </motion.div>
                )}
            </AnimatePresence>
        </span>
    );
}
