"use client";

import { motion, Variants } from "framer-motion";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2,
        },
    },
};

export default function AdvertisePage() {
    return (
        <div className="min-h-screen bg-black-primary text-foreground selection:bg-gold-primary selection:text-black-primary">
            <Header />

            <main className="flex-1">
                {/* Hero Section */}
                <section className="relative min-h-[60vh] flex items-center justify-center border-b border-border px-4 sm:px-6">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={fadeInUp as Variants}
                        className="text-center max-w-4xl mx-auto"
                    >
                        <h1 className="text-5xl sm:text-7xl md:text-9xl font-bold tracking-tighter mb-6 text-white">
                            ADVERTISE
                        </h1>
                        <p className="text-xl sm:text-2xl text-muted-foreground tracking-widest uppercase font-light">
                            Connecting Premium Brands with the Pulse of Modern Masculinity
                        </p>
                    </motion.div>
                </section>

                {/* 10.1 Media Kit */}
                <motion.section
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={staggerContainer as Variants}
                    className="border-b border-border px-4 sm:px-6 py-20 sm:py-32"
                >
                    <div className="max-w-6xl mx-auto space-y-24">
                        {/* Header */}
                        <motion.div variants={fadeInUp as Variants} className="flex flex-col md:flex-row justify-between items-start gap-8">
                            <div>
                                <span className="text-gold-primary font-mono text-sm tracking-widest mb-2 block">10.1</span>
                                <h2 className="text-4xl sm:text-5xl font-bold tracking-wide text-white">MEDIA KIT</h2>
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-8 py-4 border border-white text-white font-bold tracking-widest hover:bg-white hover:text-black-primary transition-colors uppercase text-sm"
                            >
                                Download PDF
                            </motion.button>
                        </motion.div>

                        {/* Audience Stats */}
                        <motion.div variants={fadeInUp as Variants} className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                            {[
                                { label: "Monthly Unique Visitors", value: "2.5M+" },
                                { label: "Social Media Reach", value: "1.2M" },
                                { label: "Newsletter Subscribers", value: "850K" },
                            ].map((stat, index) => (
                                <div key={index} className="space-y-4 p-8 border border-border/50 hover:border-gold-primary/50 transition-colors duration-500">
                                    <h3 className="text-5xl sm:text-6xl font-bold text-white">{stat.value}</h3>
                                    <p className="text-sm tracking-widest text-muted-foreground uppercase">{stat.label}</p>
                                </div>
                            ))}
                        </motion.div>

                        {/* Advertising Formats */}
                        <motion.div variants={fadeInUp as Variants} className="space-y-12">
                            <h3 className="text-2xl font-bold tracking-widest text-white mb-8 border-b border-border pb-4 inline-block">ADVERTISING FORMATS</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
                                {[
                                    { title: "Display Advertising", desc: "Premier placement across our high-traffic pages with responsive, high-impact units." },
                                    { title: "Native Content", desc: "Seamlessly integrated storytelling that resonates with our audience's lifestyle." },
                                    { title: "Social Amplification", desc: "Strategic distribution across our social channels to maximize engagement." },
                                    { title: "Custom Video", desc: "Cinematic quality video production and distribution for immersive brand experiences." },
                                ].map((format, idx) => (
                                    <div key={idx} className="group cursor-pointer">
                                        <h4 className="text-xl font-bold text-white mb-4 group-hover:text-gold-primary transition-colors flex items-center gap-4">
                                            <span className="w-2 h-2 bg-gold-primary opacity-0 group-hover:opacity-100 transition-opacity rounded-full" />
                                            {format.title}
                                        </h4>
                                        <p className="text-muted-foreground leading-relaxed pl-6 border-l border-border group-hover:border-gold-primary transition-colors duration-300">
                                            {format.desc}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </motion.section>

                {/* 10.2 Sponsor With Us */}
                <motion.section
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={staggerContainer as Variants}
                    className="border-b border-border px-4 sm:px-6 py-20 sm:py-32 bg-black-secondary/20"
                >
                    <div className="max-w-6xl mx-auto space-y-24">
                        {/* Header */}
                        <motion.div variants={fadeInUp as Variants}>
                            <span className="text-gold-primary font-mono text-sm tracking-widest mb-2 block">10.2</span>
                            <h2 className="text-4xl sm:text-5xl font-bold tracking-wide text-white mb-8">SPONSOR WITH US</h2>
                            <p className="text-xl text-muted-foreground max-w-2xl font-light leading-relaxed">
                                Partner with us to create defining moments. From digital dominance to exclusive events.
                            </p>
                        </motion.div>

                        {/* Partnership Tiers */}
                        <motion.div variants={fadeInUp as Variants} className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                                { name: "SILVER", price: "Starts at $5K", features: ["Standard Display Units", "Social Mention", "Newsletter Feature"] },
                                { name: "GOLD", price: "Starts at $15K", features: ["Premium Display Units", "Dedicated Email Blast", "Native Article", "Social Campaign"] },
                                { name: "PLATINUM", price: "Custom", features: ["Homepage Takeover", "Custom Video Series", "Event Sovereignty", "360° Campaign"] },
                            ].map((tier, idx) => (
                                <div key={idx} className="bg-black-primary border border-border p-8 hover:border-gold-primary transition-all duration-500 hover:-translate-y-2 group">
                                    <h3 className="text-2xl font-bold text-white mb-2 tracking-widest">{tier.name}</h3>
                                    <p className="text-gold-primary font-mono text-sm mb-8">{tier.price}</p>
                                    <ul className="space-y-4">
                                        {tier.features.map((feature, fIdx) => (
                                            <li key={fIdx} className="text-muted-foreground text-sm flex items-center gap-3">
                                                <span className="w-1.5 h-1.5 bg-border group-hover:bg-gold-primary transition-colors rounded-full" />
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                    <button className="w-full mt-12 py-3 border border-border text-xs font-bold tracking-widest uppercase hover:bg-white hover:text-black-primary transition-colors">
                                        Inquire
                                    </button>
                                </div>
                            ))}
                        </motion.div>

                        {/* Anniversary Campaign */}
                        <motion.div variants={fadeInUp as Variants} className="border border-gold-primary/30 p-8 sm:p-12 relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gold-primary/5 group-hover:bg-gold-primary/10 transition-colors duration-700" />
                            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                                <div className="space-y-4">
                                    <h3 className="text-3xl font-bold text-white tracking-widest">20TH ANNIVERSARY CAMPAIGN</h3>
                                    <p className="text-muted-foreground max-w-xl">
                                        Join our upcoming 20th anniversary celebration. Exclusive sponsorship opportunities for our biggest event of the decade.
                                    </p>
                                </div>
                                <button className="px-8 py-4 bg-gold-primary text-black-primary font-bold tracking-widest hover:bg-white transition-colors uppercase text-sm whitespace-nowrap">
                                    View Opportunities
                                </button>
                            </div>
                        </motion.div>
                    </div>
                </motion.section>

                {/* 10.3 Content Collaborations */}
                <motion.section
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={staggerContainer as Variants}
                    className="border-b border-border px-4 sm:px-6 py-20 sm:py-32"
                >
                    <div className="max-w-6xl mx-auto space-y-24">
                        {/* Header */}
                        <motion.div variants={fadeInUp as Variants}>
                            <span className="text-gold-primary font-mono text-sm tracking-widest mb-2 block">10.3</span>
                            <h2 className="text-4xl sm:text-5xl font-bold tracking-wide text-white mb-8">CONTENT COLLABORATIONS</h2>
                            <p className="text-xl text-muted-foreground max-w-2xl font-light leading-relaxed">
                                Authentic storytelling that integrates your brand into our editorial voice.
                            </p>
                        </motion.div>

                        <motion.div variants={fadeInUp as Variants} className="grid grid-cols-1 md:grid-cols-3 gap-12">
                            {[
                                { title: "Sponsored Articles", desc: "Deep-dive features written by our editors that highlight your brand's unique narrative." },
                                { title: "Product Placements", desc: "Organic integration into our curated shopping guides and lifestyle editorials." },
                                { title: "Native Advertising", desc: "Custom content hubs designed to educate and engage our audience." }
                            ].map((item, idx) => (
                                <div key={idx} className="space-y-6 group">
                                    <div className="h-1 w-12 bg-gold-primary/50 group-hover:w-full transition-all duration-700 ease-out" />
                                    <h3 className="text-3xl font-bold text-white group-hover:text-gold-primary transition-colors">{item.title}</h3>
                                    <p className="text-muted-foreground leading-relaxed">
                                        {item.desc}
                                    </p>
                                </div>
                            ))}
                        </motion.div>
                    </div>
                </motion.section>
            </main>

            <Footer />
        </div>
    );
}
