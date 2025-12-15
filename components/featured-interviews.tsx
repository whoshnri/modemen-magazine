"use client";

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { getFeaturedInterviews } from '@/app/actions/cms/interviews';
import Spinner from './spinner';

export function FeaturedInterviews() {
    const [interviews, setInterviews] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await getFeaturedInterviews();
                if (response.success && response.data) {
                    setInterviews(response.data);
                }
            } catch (error) {
                console.error("Failed to load interviews", error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchData();
    }, []);

    if (isLoading) return <div className="py-24 flex justify-center"><Spinner /></div>;
    if (interviews.length === 0) return null;

    return (
        <section className="py-16 md:py-24 bg-black-secondary border-b border-border">
            <div className="container-responsive">
                <div className="flex flex-col md:flex-row justify-between md:items-end mb-12">
                    <div className="w-full text-left">
                        <h4 className="text-gold-primary tracking-widest text-xs font-bold mb-4 uppercase">Conversations</h4>
                        <h2 className="text-3xl md:text-4xl uppercase text-white">
                            Icons & Trailblazers
                        </h2>
                    </div>
                    <Link
                        href="/interviews"
                        className="hidden md:inline-flex px-6 py-3 border border-border text-white hover:border-gold-primary hover:text-gold-primary transition-colors text-xs font-bold uppercase tracking-widest mt-6 md:mt-0"
                    >
                        View All Interviews
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:group-hover:opacity-50 md:grid-cols-2 gap-8">
                    {interviews.map((interview) => (
                        <Link href={`/interviews/${interview.slug}`} key={interview.id} className="group relative block overflow-hidden border border-border p-5 hover:border-gold-primary transition-colors duration-300">
                            <div className="relative aspect-video w-full overflow-hidden">
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ duration: 0.5 }}
                                    className="w-full h-full"
                                >
                                    {interview.coverImage ? (
                                        <Image
                                            src={interview.coverImage}
                                            alt={interview.title}
                                            fill
                                            className="object-cover transition-all duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-[#111] flex items-center justify-center text-muted-foreground">
                                            No Image
                                        </div>
                                    )}
                                </motion.div>
                            </div>

                            <div className="mt-6">
                                <h4 className="text-gold-primary text-xs font-bold tracking-widest uppercase mb-2">{interview.tagline || interview.title}</h4>
                                <h3 className="text-2xl  text-white group-hover:text-gold-primary transition-colors">
                                    {interview.people ? `${interview.people}: ` : ''}{interview.title}
                                </h3>
                            </div>
                        </Link>
                    ))}
                </div>
                <div className="mt-8 text-center md:hidden">
                    <Link
                        href="/interviews"
                        className="inline-flex px-6 py-3 border border-border text-white hover:border-gold-primary hover:text-gold-primary transition-colors text-xs font-bold uppercase tracking-widest"
                    >
                        View All Interviews
                    </Link>
                </div>
            </div>
        </section>
    );
}
