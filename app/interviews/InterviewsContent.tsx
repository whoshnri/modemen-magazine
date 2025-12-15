"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import Link from "next/link";
import Image from "next/image";
import { PlaySquare } from "lucide-react";
import { Interview } from "@/lib/generated/prisma/client";
import { useEffect, useState } from "react";
import { getInterViews } from "../actions/interviewOps";


interface InterviewsContentProps {
    initialInterviews: Interview[];
}

export default function InterviewsContent({ initialInterviews = [] }: InterviewsContentProps) {
    const [interviews, setInterviews] = useState<Interview[]>(initialInterviews)

    useEffect(() => {
        if (initialInterviews.length > 0) return;

        const fetchInterviews = async () => {
            const interviews = await getInterViews()
            setInterviews(interviews ?? [])
        }

        fetchInterviews()
    }, [initialInterviews])

    return (
        <div className="min-h-screen bg-black-primary text-foreground flex flex-col">
            <Header />

            <main className="flex-1">
                <section className="relative py-32 px-6 border-b border-border overflow-hidden">
                    <div className="absolute inset-0 z-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src="https://images.unsplash.com/photo-1561491431-71b89da6056a?w=500&auto=format&fit=crop&q=80"
                            alt="Interviews Background"
                            className="w-full h-full object-cover opacity-60"
                        />
                        <div className="absolute inset-0 bg-black-primary/70 z-10 mix-blend-multiply" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black-primary via-transparent to-transparent z-10" />
                    </div>
                    <div className="relative z-20 container-responsive">
                        <h4 className="text-gold-primary tracking-[0.2em] uppercase text-xs font-bold mb-4">Conversations</h4>
                        <h1 className="text-5xl md:text-7xl  text-white mb-6">Icons & Trailblazers</h1>
                        <p className="text-lg text-gray-200 max-w-2xl font-light leading-relaxed">
                            Intimate portraits and long-form conversations with the leaders, artists, athletes, and thinkers moving Africa and the diaspora into the future.
                        </p>
                    </div>
                </section>

                <section className="py-16 bg-black-secondary border-b border-border">
                    <div className="container-responsive grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {interviews.map((interview) => (
                            <Link href={`/interviews/${interview.slug}`} key={interview.id} className="group cursor-pointer">
                                <div className="relative aspect-video w-full overflow-hidden mb-6">
                                    <Image
                                        src={interview.coverImage ?? ""}
                                        alt={interview.title}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                                        <div className="w-12 h-12 bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 group-hover:scale-110 transition-transform duration-300">
                                            <PlaySquare className="w-6 h-6 text-white fill-white/20" />
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-gold-primary text-[10px] font-bold tracking-widest uppercase mb-2">{interview.people}</h4>
                                    <h3 className="text-2xl  text-white group-hover:text-gold-primary transition-colors">{interview.title}</h3>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
