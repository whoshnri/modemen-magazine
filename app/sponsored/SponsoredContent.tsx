"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";

export default function SponsoredContent() {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Mock data - replace with fetch from Sponsored model
    const sponsoredItems = [
        {
            id: "1",
            title: "The Rolls-Royce Spectre",
            description: "Defining the new era of electric luxury. Experience silence, redefined.",                                           
            // Using placeholder from external source or local if available, ensuring it looks good
            image: "https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=2070&auto=format&fit=crop",
            type: "ITEM",
            link: "#"
        },
        {
            id: "2",
            title: "UBA: Building Africa",
            description: "How one bank is connecting the continent through strategic vision and unwavering commitment.",
            image: "https://images.unsplash.com/photo-1541746972996-4e0b0f43e02a?q=80&w=2070&auto=format&fit=crop", // Abstract architecture
            type: "PERSON",
            link: "#"
        },
        {
            id: "3",
            title: "Patek Philippe: The Nautilus",
            description: "A timeless masterpiece that bridges generations. The definition of sporting elegance.",
            image: "https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?q=80&w=2574&auto=format&fit=crop",
            type: "ITEM",
            link: "#"
        },
        {
            id: "4",
            title: "Visit Rwanda",
            description: "Experience the land of a thousand hills. Luxury eco-tourism meets breathtaking landscapes.",
            image: "https://images.unsplash.com/photo-1579208030886-b93796d860d5?q=80&w=2070&auto=format&fit=crop",
            type: "EVENT",
            link: "#"
        },
        {
            id: "5",
            title: "Macallan 1926",
            description: "The most valuable whisky ever sold. A taste of history in every drop.",
            image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=2070&auto=format&fit=crop",
            type: "ITEM",
            link: "#"
        }
    ];

    const currentItem = sponsoredItems[currentIndex];

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % sponsoredItems.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev === 0 ? sponsoredItems.length - 1 : prev - 1));
    };

    // Auto slide
    useEffect(() => {
        const timer = setInterval(nextSlide, 10000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="min-h-screen bg-black-primary text-foreground flex flex-col">
            <Header />

            <main className="flex-1 flex flex-col">
                {/* Hero / Sponsored Item */}
                <section className="relative flex-1 min-h-[85vh] flex items-center overflow-hidden">
                    <AnimatePresence initial={false}>
                        <motion.div
                            key={currentItem.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 1.5, ease: "easeInOut" }}
                            className="absolute inset-0 z-0"
                        >
                            <Image
                                src={currentItem.image}
                                alt={currentItem.title}
                                fill
                                className="object-cover"
                                priority
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black-primary via-black-primary/60 to-transparent"></div>
                            <div className="absolute inset-0 bg-gradient-to-r from-black-primary via-black-primary/40 to-transparent"></div>
                        </motion.div>
                    </AnimatePresence>

                    <div className="container-responsive relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div className="max-w-3xl">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentItem.id} // content- key prefix not strictly needed if ID is unique
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <span className="inline-block px-3 py-1 bg-white text-black-primary text-[10px] font-bold uppercase tracking-widest mb-6 start-slide-anim">Sponsored Feature</span>
                                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl text-white mb-6 leading-tight">
                                        {currentItem.title}
                                    </h1>
                                    <p className="text-lg md:text-xl text-gray-200 font-light leading-relaxed mb-10 max-w-xl">
                                        {currentItem.description}
                                    </p>

                                    <div className="flex flex-col sm:flex-row gap-6">
                                        <a
                                            href={currentItem.link}
                                            className="px-8 py-4 bg-gold-primary text-black-primary w-fit font-bold tracking-widest uppercase hover:bg-gold-secondary transition-colors"
                                        >
                                            {currentItem.type === 'EVENT' ? 'Get Tickets' : currentItem.type === 'ITEM' ? 'Shop Now' : 'Discover More'}
                                        </a>
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Navigation */}
                    <div className="absolute bottom-20 md:bottom-12 right-[50%] max-md:translate-x-1/2 md:right-12 z-20 flex gap-4">
                        <button
                            onClick={prevSlide}
                            className="w-12 h-12 border border-white/20 hover:bg-white hover:text-black-primary text-white flex items-center justify-center transition-colors backdrop-blur-sm"
                        >
                            <ArrowRight className="w-5 h-5 rotate-180" />
                        </button>
                        <button
                            onClick={nextSlide}
                            className="w-12 h-12 border border-white/20 hover:bg-white hover:text-black-primary text-white flex items-center justify-center transition-colors backdrop-blur-sm"
                        >
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Slide Indicators - Centered */}
                    <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                        {sponsoredItems.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentIndex(idx)}
                                className={`h-1 transition-all duration-300 ${idx === currentIndex ? 'w-12 bg-gold-primary' : 'w-4 bg-white/30 hover:bg-white'}`}
                            />
                        ))}
                    </div>
                </section>

                {/* Partner With Mode Men Section - Redesigned */}
                <section className="py-24 border-t border-border relative overflow-hidden">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-black-primary via-black-primary/95 to-black-secondary/80"></div>

                    <div className="container-responsive relative z-10">
                        <div className="max-w-4xl mx-auto text-center">
                            <h3 className="text-sm font-bold tracking-[0.3em] text-gold-primary mb-6 uppercase">Corporate Partnerships</h3>
                            <h2 className="text-4xl md:text-6xl text-white mb-8">
                                Elevate Your Brand<br />
                                <span className="italic text-gold-primary">With Mode Men</span>
                            </h2>
                            <p className="text-xl text-gray-300 mb-12 leading-relaxed max-w-2xl mx-auto font-light">
                                Align your narrative with the voice of authority in African luxury.
                                Join an exclusive network of brands shaping the future.
                            </p>

                            <Link
                                href="/subscription"
                                className="inline-flex items-center gap-3 px-12 py-5 bg-gold-primary text-black-primary font-bold tracking-[0.15em] uppercase hover:bg-white transition-all transform hover:scale-105 duration-300 shadow-[0_0_20px_rgba(212,175,55,0.3)]"
                            >
                                Join VIP to Partner
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
