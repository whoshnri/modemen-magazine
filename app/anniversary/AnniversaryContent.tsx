"use client";

import { motion, Variants } from "framer-motion";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { CountdownTimer } from "@/components/countdown-timer";

const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2,
        },
    },
};

export default function AnniversaryContent() {
    return (
        <div className="min-h-screen bg-black-primary text-foreground selection:bg-gold-primary selection:text-black-primary overflow-x-hidden">
            <Header />

            <main className="flex-1">
                {/* Hero Section - Preserved */}
                <section className="relative min-h-screen flex flex-col items-center justify-center px-4 text-center border-b border-border overflow-hidden">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="relative z-10"
                    >
                        <div className="absolute -inset-20 bg-gold-primary/10 blur-[120px] rounded-full opacity-60 pointer-events-none" />
                        <h1 className="relative text-7xl sm:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-gold-primary tracking-tighter mb-6">
                            20 YEARS
                        </h1>
                        <p className="relative text-xl sm:text-3xl text-gold-primary tracking-[0.5em] uppercase font-light">
                            Of Defining Style
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1, duration: 1 }}
                        className="absolute bottom-12 flex flex-col items-center gap-2"
                    >
                        <span className="text-xs uppercase tracking-widest text-muted-foreground">The Celebration Begins</span>
                        <div className="w-[1px] h-12 bg-gradient-to-b from-gold-primary to-transparent" />
                    </motion.div>
                </section>

                {/* 8.1 Countdown Page */}
                <motion.section
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={staggerContainer}
                    className="py-24 sm:py-32 px-4 sm:px-6 border-b border-border bg-black-secondary/30 relative overflow-hidden"
                >
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold-primary to-transparent opacity-20" />

                    <div className="max-w-6xl mx-auto text-center space-y-16 relative z-10">
                        <motion.div variants={fadeInUp}>
                            <span className="text-gold-primary font-mono text-sm tracking-widest mb-4 block">8.1</span>
                            <h2 className="text-3xl sm:text-4xl font-bold tracking-widest text-white mb-2">COUNTDOWN TO APRIL 2026</h2>
                            <p className="text-muted-foreground">The era of excellence continues.</p>
                        </motion.div>

                        <CountdownTimer targetDate="2026-04-01T00:00:00" />
                    </div>
                </motion.section>

                {/* 8.2 Anniversary Events */}
                <motion.section
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={staggerContainer}
                    className="py-24 sm:py-32 px-4 sm:px-6 border-b border-border"
                >
                    <div className="max-w-6xl mx-auto space-y-20">
                        <motion.div variants={fadeInUp} className="text-center md:text-left">
                            {/* <span className="text-gold-primary font-mono text-sm tracking-widest mb-2 block">8.2</span> */}
                            <h2 className="text-5xl sm:text-6xl font-bold tracking-wide text-white">EVENTS</h2>
                        </motion.div>

                        <motion.div variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                                { title: "THE GALA", date: "April 01, 2026", desc: "A black-tie evening celebrating two decades of influence.", action: "Reserve Seat" },
                                { title: "MEDIA BRUNCH", date: "April 02, 2026", desc: "An intimate gathering with our editors and partners.", action: "Register Interest" },
                                { title: "RETROSPECTIVE EXHIBITION", date: "April 03-10, 2026", desc: "20 years of covers, fashion, and culture on display.", action: "Get Tickets" },
                            ].map((event, idx) => (
                                <motion.div
                                    key={idx}
                                    variants={fadeInUp}
                                    className="group relative bg-black-primary border border-border overflow-hidden"
                                >
                                    <div className="absolute top-0 left-0 w-full h-0.5 bg-gold-primary transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-in-out" />
                                    <div className="p-10 space-y-6">
                                        <span className="text-xs font-mono text-gold-primary border border-gold-primary/30 px-2 py-1 tracking-widest">{event.date}</span>
                                        <h3 className="text-3xl font-bold text-white group-hover:text-gold-primary transition-colors mt-6">{event.title}</h3>
                                        <p className="text-muted-foreground leading-relaxed min-h-[5rem]">{event.desc}</p>
                                        <button className="text-sm font-bold tracking-widest uppercase text-white hover:text-gold-primary relative inline-flex items-center gap-2 group-hover:gap-4 transition-all">
                                            {event.action}
                                            <span className="text-xl">→</span>
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </motion.section>

                {/* 8.3 20-Year Archive */}
                <motion.section
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={staggerContainer}
                    className="py-24 sm:py-32 px-4 sm:px-6 border-b border-border bg-black-primary text-white"
                >
                    <div className="max-w-7xl mx-auto space-y-20">
                        <div className="flex flex-col md:flex-row justify-between items-start gap-8 border-b border-border pb-8">
                            <motion.div variants={fadeInUp}>
                                <span className="text-gold-primary font-mono text-sm tracking-widest mb-2 block">8.3</span>
                                <h2 className="text-5xl sm:text-6xl font-bold tracking-wide text-white">THE ARCHIVE</h2>
                            </motion.div>
                            <motion.button
                                variants={fadeInUp}
                                className="px-8 py-4 border border-white text-white font-bold tracking-widest hover:bg-gold-primary hover:text-black-primary hover:border-gold-primary transition-colors uppercase text-sm"
                            >
                                View Full Archive
                            </motion.button>
                        </div>

                        <motion.div variants={staggerContainer} className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8">
                            {[2005, 2010, 2015, 2020].map((year, idx) => (
                                <motion.div key={idx} variants={fadeInUp} className="space-y-4 group cursor-pointer">
                                    <div className="aspect-[3/4] bg-neutral-900 relative overflow-hidden border border-white/10 group-hover:border-gold-primary/50 transition-colors">
                                        {/* Placeholder for Cover Image */}
                                        <div className="absolute inset-0 flex items-center justify-center bg-black-primary/5 text-white/10 text-4xl font-bold group-hover:scale-105 transition-transform duration-700">
                                            {year}
                                        </div>
                                        <div className="absolute inset-0 bg-gold-primary/0 group-hover:bg-gold-primary/5 transition-colors duration-300" />
                                    </div>
                                    <div className="flex justify-between items-center border-t border-white/10 pt-4">
                                        <span className="font-bold tracking-widest text-white group-hover:text-gold-primary transition-colors">{year}</span>
                                        <span className="text-xs uppercase text-white/50">Issue 0{idx + 1}</span>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>

                        <motion.div variants={fadeInUp} className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-12 border-t border-border">
                            <div className="p-8 border border-white/10 hover:border-gold-primary transition-colors cursor-pointer group">
                                <h4 className="text-2xl font-bold mb-4 text-white group-hover:text-gold-primary transition-colors">Editors' Notes</h4>
                                <p className="text-muted-foreground mb-6">Reflections from the voices that shaped two decades of editorial excellence.</p>
                                <span className="underline decoration-1 underline-offset-4 uppercase text-xs font-bold text-white group-hover:text-gold-primary">Read Notes</span>
                            </div>
                            <div className="p-8 border border-white/10 hover:border-gold-primary transition-colors cursor-pointer group">
                                <h4 className="text-2xl font-bold mb-4 text-white group-hover:text-gold-primary transition-colors">Notable Interviews</h4>
                                <p className="text-muted-foreground mb-6">Revisiting our most impactful conversations with icons of industry.</p>
                                <span className="underline decoration-1 underline-offset-4 uppercase text-xs font-bold text-white group-hover:text-gold-primary">Explore Conversations</span>
                            </div>
                        </motion.div>
                    </div>
                </motion.section>

                {/* 8.5 Anniversary Edition Magazine */}
                <motion.section
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={staggerContainer}
                    className="py-24 sm:py-32 px-4 sm:px-6 border-b border-border bg-gold-primary text-black-primary relative overflow-hidden"
                >
                    <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-16 relative z-10">
                        <motion.div variants={fadeInUp} className="flex-1 space-y-8">
                            <span className="font-mono text-sm tracking-widest border border-black-primary px-3 py-1 inline-block">8.5</span>
                            <h2 className="text-5xl sm:text-7xl font-bold tracking-tighter leading-none">
                                THE <br /> PLATINUM <br /> ISSUE
                            </h2>
                            <p className="text-xl font-medium max-w-md">
                                Pre-order the limited edition 20th Anniversary Box Set. Includes archival prints and exclusive backstage access.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                <button className="px-10 py-4 bg-black-primary text-white font-bold tracking-widest hover:bg-white hover:text-black-primary transition-colors uppercase text-sm">
                                    Pre-Order Now
                                </button>
                                <button className="px-10 py-4 border border-black-primary text-black-primary font-bold tracking-widest hover:bg-black-primary hover:text-white transition-colors uppercase text-sm">
                                    Watch Teaser
                                </button>
                            </div>
                        </motion.div>

                        <motion.div variants={fadeInUp} className="flex-1 w-full max-w-md">
                            <div className="aspect-[3/4] bg-black-primary/10 border-2 border-black-primary p-4 rotate-3 hover:rotate-0 transition-transform duration-500">
                                <div className="w-full h-full bg-black-primary flex items-center justify-center text-gold-primary p-8 text-center border border-gold-primary/30">
                                    <span className="uppercase tracking-[0.5em] text-xs">Cover Reveal <br /> April 01</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </motion.section>

                {/* 8.4 Partners & Sponsors */}
                <motion.section
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={staggerContainer}
                    className="py-24 sm:py-32 px-4 sm:px-6"
                >
                    <div className="max-w-6xl mx-auto text-center space-y-16">
                        <motion.div variants={fadeInUp}>
                            <span className="text-gold-primary font-mono text-sm tracking-widest mb-2 block">8.4</span>
                            <h2 className="text-3xl font-bold tracking-widest text-white mb-8">PARTNERS & SPONSORS</h2>
                            <p className="text-muted-foreground max-w-2xl mx-auto">
                                Powered by those who define the future.
                            </p>
                        </motion.div>

                        <motion.div variants={fadeInUp} className="grid grid-cols-2 md:grid-cols-4 gap-8 opacity-50">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="h-24 border border-white/20 flex items-center justify-center hover:border-gold-primary hover:opacity-100 transition-all cursor-pointer">
                                    <span className="text-xs uppercase tracking-widest">Partner {i}</span>
                                </div>
                            ))}
                        </motion.div>

                        <motion.button
                            variants={fadeInUp}
                            className="px-8 py-3 border border-border text-muted-foreground text-xs font-bold tracking-widest uppercase hover:text-white hover:border-white transition-colors"
                        >
                            Download Sponsorship Deck
                        </motion.button>
                    </div>
                </motion.section>

                {/* Bonus: Timeline of Excellence */}
                {/* Bonus: Timeline of Excellence */}
                <motion.section
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={staggerContainer}
                    className="py-24 sm:py-32 px-4 sm:px-6 border-b border-border bg-black-secondary/20 overflow-hidden"
                >
                    <div className="max-w-6xl mx-auto space-y-24">
                        <motion.div variants={fadeInUp} className="text-center">
                            <span className="text-gold-primary font-mono text-sm tracking-widest mb-2 block">BONUS</span>
                            <h2 className="text-3xl font-bold tracking-widest text-white mb-8">TIMELINE OF EXCELLENCE</h2>
                        </motion.div>

                        <div className="relative border-l border-gold-primary/30 ml-4 md:mx-auto md:w-full md:border-l-0 md:border-t-0 space-y-24 md:space-y-24">
                            {/* Desktop Center Line */}
                            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gold-primary/30 -translate-x-1/2" />


                            {[
                                { year: "2005", title: "The Inception", desc: "Modemen launches as a quarterly print journal, establishing a new voice in men's fashion." },
                                { year: "2010", title: "Digital Expansion", desc: "The launch of modemenmag.com and global distribution brings our vision to the world." },
                                { year: "2015", title: "Decade of Dominance", desc: "Hosting the first Men of Style Awards, celebrating the icons of our generation." },
                                { year: "2020", title: "New Era", desc: "Reimagining the brand for a post-digital world, focusing on multimedia storytelling." },
                                { year: "2025", title: "Platinum Age", desc: "Setting the standard for the next 20 years with our most ambitious projects yet." },
                            ].map((item, idx) => (
                                <motion.div
                                    key={idx}
                                    variants={fadeInUp}
                                    className={`relative pl-12 md:pl-0 flex flex-col md:flex-row items-center gap-6 md:gap-12 ${idx % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
                                >
                                    {/* Dot - Mobile Left, Desktop Center */}
                                    <div className="absolute left-[-5px] md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 w-2.5 h-2.5 bg-gold-primary rounded-full ring-4 ring-black-primary z-10" />

                                    <div className={`w-full md:w-1/2 ${idx % 2 === 0 ? 'md:pl-20 text-left' : 'md:pr-20 md:text-right'}`}>
                                        <span className="text-5xl md:text-6xl font-bold text-white/10 block mb-4">{item.year}</span>
                                        <h3 className="text-2xl font-bold text-white mb-3 text-gold-primary">{item.title}</h3>
                                        <p className="text-muted-foreground leading-loose text-sm md:text-base">{item.desc}</p>
                                    </div>
                                    <div className="hidden md:block md:w-1/2" />
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.section>
            </main>

            <Footer />
        </div>
    );
}
