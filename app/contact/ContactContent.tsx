"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { motion } from "framer-motion";
import { Mail, MapPin, Phone } from "lucide-react";

export default function ContactContent() {
    return (
        <div className="min-h-screen bg-black-primary text-foreground flex flex-col">
            <Header />

            <main className="flex-1">
                {/* Hero */}
                <section className="relative py-24 px-6 border-b border-white/10">
                    <div className="max-w-6xl mx-auto text-center">
                        <motion.span
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-gold-primary text-xs font-bold tracking-[0.2em] uppercase mb-4 block"
                        >
                            Get in Touch
                        </motion.span>
                        <motion.h1
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8 }}
                            className="text-5xl md:text-7xl font-serif text-white mb-6"
                        >
                            Contact Us
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="text-xl text-muted-foreground font-light max-w-2xl mx-auto"
                        >
                            We value your feedback and inquiries. Reach out to the Mode Men team.
                        </motion.p>
                    </div>
                </section>

                <section className="grid grid-cols-1 lg:grid-cols-2 min-h-[60vh]">
                    {/* Contact Info */}
                    <div className="p-12 md:p-24 border-b lg:border-b-0 lg:border-r border-white/10 flex flex-col justify-center bg-black-secondary/30">
                        <div className="space-y-12 max-w-md mx-auto lg:mx-0">
                            <div className="space-y-6">
                                <h3 className="text-2xl font-serif text-white">Headquarters</h3>
                                <div className="flex items-start gap-4 text-muted-foreground">
                                    <MapPin className="w-6 h-6 text-gold-primary shrink-0" />
                                    <p className="leading-relaxed">
                                        123 Adetokunbo Ademola Street,<br />
                                        Victoria Island, Lagos,<br />
                                        Nigeria
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <h3 className="text-2xl font-serif text-white">Direct Lines</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4 text-muted-foreground">
                                        <Mail className="w-5 h-5 text-gold-primary" />
                                        <a href="mailto:info@modemenmag.com" className="hover:text-white transition-colors">info@modemenmag.com</a>
                                    </div>
                                    <div className="flex items-center gap-4 text-muted-foreground">
                                        <Phone className="w-5 h-5 text-gold-primary" />
                                        <span>+234 800 000 0000</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="p-12 md:p-24 flex items-center justify-center">
                        <form className="w-full max-w-md space-y-8">
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label htmlFor="name" className="text-xs uppercase tracking-widest font-bold text-gold-primary">Name</label>
                                        <input
                                            type="text"
                                            id="name"
                                            className="w-full bg-transparent border-b border-white/20 py-3 text-white focus:outline-none focus:border-gold-primary transition-colors"
                                            placeholder="Enter your name"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="email" className="text-xs uppercase tracking-widest font-bold text-gold-primary">Email</label>
                                        <input
                                            type="email"
                                            id="email"
                                            className="w-full bg-transparent border-b border-white/20 py-3 text-white focus:outline-none focus:border-gold-primary transition-colors"
                                            placeholder="Enter your email"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="subject" className="text-xs uppercase tracking-widest font-bold text-gold-primary">Subject</label>
                                    <select
                                        id="subject"
                                        className="w-full bg-black-primary border-b border-white/20 py-3 text-white focus:outline-none focus:border-gold-primary transition-colors appearance-none"
                                    >
                                        <option>General Inquiry</option>
                                        <option>Editorial Submission</option>
                                        <option>Advertising / Partnership</option>
                                        <option>Press</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="message" className="text-xs uppercase tracking-widest font-bold text-gold-primary">Message</label>
                                    <textarea
                                        id="message"
                                        rows={6}
                                        className="w-full bg-transparent border-b border-white/20 py-3 text-white focus:outline-none focus:border-gold-primary transition-colors resize-none"
                                        placeholder="Write your message here..."
                                    ></textarea>
                                </div>
                            </div>

                            <button type="submit" className="w-full py-4 bg-white text-black-primary font-bold uppercase tracking-widest hover:bg-gold-primary transition-colors duration-300">
                                Send Message
                            </button>
                        </form>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
