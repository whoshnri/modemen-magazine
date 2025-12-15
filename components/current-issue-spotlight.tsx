"use client";

import { getLatestIssue } from '@/app/actions/cms/issues';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRef } from 'react';

export function CurrentIssueSpotlight() {
    const [latestIssue, setLatestIssue] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchIssue = async () => {
            try {
                const issue = await getLatestIssue();
                setLatestIssue(issue);
            } catch (error) {
                console.error("Failed to fetch latest issue:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchIssue();
    }, []);

    if (isLoading || !latestIssue) {
        return null;
    }

    return (
        <section className="py-16 md:py-24 bg-mocha-primary/10 border-t border-b border-border">
            <div className="container-responsive">
                <div className="flex flex-col md:flex-row items-center gap-12">
                    {/* Magazine Cover */}
                    <div className="w-full md:w-1/2 lg:w-5/12 flex justify-center md:justify-end">
                        <Link href={`/issues/${latestIssue.id}`} className="relative shadow-2xl group w-3/4 md:w-full max-w-sm block">
                            <div className="absolute inset-0 bg-gold-primary transform rotate-0 group-hover:rotate-6 transition-transform duration-500 ease-out z-0"></div>
                            {latestIssue.coverImage ? (
                                <Image
                                    src={latestIssue.coverImage}
                                    alt={latestIssue.title}
                                    width={500}
                                    height={500}
                                    className="w-full h-full relative z-10 object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                                    priority
                                />
                            ) : (
                                <div className="w-full h-96 relative z-10 bg-[#111] flex items-center justify-center text-muted-foreground border border-white/10">
                                    No Cover Image
                                </div>
                            )}
                        </Link>
                    </div>

                    {/* Issue Details */}
                    <div className="w-full md:w-1/2 lg:w-7/12 text-center md:text-left">
                        <h4 className="text-gold-primary tracking-widest text-xs font-bold mb-4 uppercase">In The Latest Issue</h4>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-foreground mb-6">
                            {latestIssue.title}
                        </h2>
                        {latestIssue.description && (
                            <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto md:mx-0 leading-relaxed font-light">
                                {latestIssue.teaserText || latestIssue.description}
                            </p>
                        )}

                        <div className="flex flex-col sm:flex-row gap-6 justify-center md:justify-start">
                            <a
                                href={latestIssue.viewLink || `/issues/${latestIssue.id}`}
                                className="px-8 py-3 bg-black-primary text-white border border-white/20 hover:bg-white hover:text-black-primary transition-all duration-300 uppercase text-xs font-bold tracking-widest"
                            >
                                Read Issue
                            </a>
                            <Link
                                href="/issues"
                                className="px-8 py-3 bg-gold-primary text-black-primary hover:bg-gold-secondary transition-all duration-300 uppercase text-xs font-bold tracking-widest"
                            >
                                View Archive
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
