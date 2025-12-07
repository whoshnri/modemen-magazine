"use client";

import { motion, useScroll, useTransform, Variants } from "framer-motion";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import Image from "next/image";
import { useRef } from "react";

const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.8, ease: "easeOut" }
    }
};

const staggerContainer = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.1
        }
    }
};

const TEAM_MEMBERS = [
    { name: "First Last", role: "Editor-in-Chief", image: "" },
    { name: "First Last", role: "Creative Director", image: "" },
    { name: "First Last", role: "Fashion Editor", image: "" },
    { name: "First Last", role: "Digital Director", image: "" },
];

export default function AboutPage() {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    return (
        <div ref={containerRef} className="min-h-screen bg-black-primary text-foreground">
            <Header />

            <main>
                {/* 11. Hero Section */}
                <section className="relative min-h-[80vh] flex items-center justify-center border-b border-white/10 overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gold-primary/10 via-black-primary to-black-primary opacity-50" />

                    <div className="max-w-6xl mx-auto px-6 text-center relative z-10">
                        <motion.h1
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="text-6xl md:text-9xl font-bold tracking-tighter text-white mb-8"
                        >
                            MODE MEN
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5, duration: 1 }}
                            className="text-xl md:text-2xl text-gold-primary tracking-[0.3em] font-serif italic"
                        >
                            DEFINING THE MODERN MAN
                        </motion.p>
                    </div>
                </section>

                {/* 11.1 About Mode Men: History & Branding */}
                <section className="py-24 px-6 border-b border-white/10">
                    <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={staggerContainer}
                            className="space-y-12"
                        >
                            <motion.div variants={fadeInUp as Variants}>
                                <span className="text-gold-primary text-xs font-bold tracking-[0.2em] uppercase mb-4 block">11.1 History</span>
                                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">A LEGACY OF STYLE</h2>
                                <p className="text-muted-foreground leading-relaxed text-lg">
                                    Founded in 2005, Mode Men Magazine has been at the forefront of African luxury, lifestyle, and men's fashion. For two decades, we have chronicled the evolution of the modern gentleman, from boardroom prowess to leisure elegance.
                                </p>
                            </motion.div>

                            <motion.div variants={fadeInUp as Variants}>
                                <span className="text-gold-primary text-xs font-bold tracking-[0.2em] uppercase mb-4 block">Brand Values</span>
                                <ul className="space-y-4 text-white text-lg font-light tracking-wide">
                                    {["Authenticity", "Elegance", "Innovation", "Integrity"].map((val) => (
                                        <li key={val} className="flex items-center gap-4 border-l border-gold-primary pl-6">
                                            {val}
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1 }}
                            className="relative aspect-[3/4] md:aspect-square bg-white/5 border border-white/10 rotate-3"
                        >
                            {/* Placeholder for archival image or collage */}
                            <div className="absolute inset-4 bg-black-secondary flex items-center justify-center border border-white/5">
                                <span className="text-white/20 text-6xl font-serif italic">Est. 2005</span>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* 11.2 Editor's Letter */}
                <section className="py-24 px-6 bg-white text-black-primary">
                    <div className="max-w-4xl mx-auto text-center">
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeInUp as Variants}
                        >
                            <span className="text-black-primary/50 text-xs font-bold tracking-[0.2em] uppercase mb-6 block">11.2 Editor's Letter</span>
                            <h2 className="text-5xl font-serif text-black-primary italic mb-12">"The Gentleman's Renaissance"</h2>

                            <div className="prose prose-lg prose-headings:font-serif mx-auto text-black-primary/80 font-serif leading-loose">
                                <p>
                                    Welcome to the new era of Mode Men. As we embark on this digital journey, we carry with us the weight of tradition and the lightness of innovation.
                                </p>
                                <p>
                                    The modern man is not defined by a single trait but by a tapestry of experiences. He is a leader, a creator, a father, and a visionary. Our mission remains unchanged: to provide the blueprint for a life well-lived.
                                </p>
                                <br />
                                <p className="font-bold not-italic font-sans text-sm tracking-widest uppercase mt-8">
                                    — The Editor
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Editorial Team */}
                <section className="py-24 px-6 border-b border-white/10">
                    <div className="max-w-6xl mx-auto">
                        <motion.h2
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            className="text-3xl font-bold text-white mb-16 text-center tracking-widest uppercase"
                        >
                            Editorial Team
                        </motion.h2>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            {TEAM_MEMBERS.map((member, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="group text-center"
                                >
                                    <div className="aspect-[3/4] bg-white/5 mb-6 relative overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-500">
                                        {/* Placeholder Image */}
                                        <div className="absolute inset-0 flex items-center justify-center text-white/10">
                                            <span className="text-4xl">+</span>
                                        </div>
                                    </div>
                                    <h3 className="text-white font-bold tracking-wide">{member.name}</h3>
                                    <p className="text-gold-primary text-xs uppercase tracking-widest mt-2">{member.role}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 11.3 - 11.5 Contact & Info Grid */}
                <section className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/10 border-b border-white/10">
                    {[
                        {
                            id: "11.3",
                            title: "Contact",
                            content: (
                                <div className="space-y-2 text-muted-foreground">
                                    <p>info@modemenmag.com</p>
                                    <p>+234 800 000 0000</p>
                                    <p>Lagos, Nigeria</p>
                                </div>
                            )
                        },
                        {
                            id: "11.4",
                            title: "Careers",
                            content: (
                                <div className="space-y-4">
                                    <p className="text-muted-foreground">We are always looking for visionary talent.</p>
                                    <a href="mailto:careers@modemenmag.com" className="inline-block border-b border-gold-primary text-white hover:text-gold-primary transition-colors pb-1 text-sm tracking-widest">
                                        VIEW OPENINGS
                                    </a>
                                </div>
                            )
                        },
                        {
                            id: "11.5",
                            title: "Press & Media",
                            content: (
                                <div className="space-y-4">
                                    <p className="text-muted-foreground">For press kits and media enquiries.</p>
                                    <a href="mailto:press@modemenmag.com" className="inline-block border-b border-gold-primary text-white hover:text-gold-primary transition-colors pb-1 text-sm tracking-widest">
                                        DOWNLOAD MEDIA KIT
                                    </a>
                                </div>
                            )
                        }
                    ].map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="p-12 md:p-16 text-center hover:bg-white/5 transition-colors duration-500"
                        >
                            <span className="text-gold-primary text-xs font-bold tracking-[0.2em] mb-4 block">{item.id}</span>
                            <h3 className="text-2xl font-bold text-white mb-6 uppercase tracking-widest">{item.title}</h3>
                            {item.content}
                        </motion.div>
                    ))}
                </section>
            </main>

            <Footer />
        </div>
    );
}
