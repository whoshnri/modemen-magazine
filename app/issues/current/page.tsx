import { getLatestIssue } from "@/app/actions/cms/issues";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, BookOpen, ShoppingBag, Share2 } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export const dynamic = 'force-dynamic';

export default async function CurrentIssueShowcasePage() {
    const latestIssue = await getLatestIssue();

    if (!latestIssue) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center text-white">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">No Current Issue Available</h1>
                    <Link href="/issues" className="text-gold-primary underline">Browse Archive</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-black-primary min-h-screen flex flex-col">
            <Header />

            <main className="flex-1 relative">
                {/* Hero Background - Blurred Cover */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {latestIssue.coverImage && (
                        <div className="absolute inset-0 opacity-20 blur-[100px] scale-125">
                            <Image
                                src={latestIssue.coverImage}
                                alt="Background"
                                fill
                                className="object-cover"
                            />
                        </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black-primary via-black-primary/80 to-transparent" />
                </div>

                <div className="relative z-10 container-responsive pt-12 pb-20">
                    <Link
                        href="/issues"
                        className="inline-flex items-center gap-2 text-xs font-bold tracking-widest text-white/50 hover:text-white mb-12 uppercase transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" /> Issue Archive
                    </Link>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
                        {/* Cover Image - Dominant Visual */}
                        <div className="lg:col-span-5 relative group perspective-1000">
                            <div className="relative aspect-[3/4] w-full transform transition-all duration-700 hover:rotate-y-6 hover:scale-105 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] border border-white/5">
                                {latestIssue.coverImage ? (
                                    <Image
                                        src={latestIssue.coverImage}
                                        alt={latestIssue.title}
                                        fill
                                        className="object-cover"
                                        priority
                                    />
                                ) : (
                                    <div className="w-full h-full bg-neutral-900 flex items-center justify-center text-muted-foreground">
                                        No Cover
                                    </div>
                                )}
                                {/* Flash effect/sheen could go here */}
                                <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                            </div>
                            {/* Reflection effect */}
                            <div className="absolute -bottom-8 left-4 right-4 h-8 bg-black/50 blur-xl rounded-[50%] opacity-60"></div>
                        </div>

                        {/* Content & CTAs */}
                        <div className="lg:col-span-7 space-y-10">
                            <div>
                                <div className="inline-flex items-center gap-3 px-4 py-2 bg-gold-primary/10 border border-gold-primary/20 rounded-full mb-6">
                                    <span className="w-2 h-2 rounded-full bg-gold-primary animate-pulse"></span>
                                    <span className="text-[10px] font-bold tracking-[0.2em] text-gold-primary uppercase">Current Issue</span>
                                </div>
                                <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-white leading-[0.9] tracking-tight mb-6">
                                    {latestIssue.title}
                                </h1>
                                <p className="text-gold-primary text-sm font-bold tracking-[0.25em] uppercase border-l-4 border-gold-primary pl-4">
                                    {new Date(latestIssue.releaseDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} Edition
                                </p>
                            </div>

                            {latestIssue.teaserText && (
                                <blockquote className="text-2xl md:text-3xl text-white/90 font-light font-serif italic leading-relaxed">
                                    "{latestIssue.teaserText}"
                                </blockquote>
                            )}

                            <div className="prose prose-invert prose-lg text-white/60 font-light max-w-2xl border-l border-white/10 pl-6">
                                <p>{latestIssue.description}</p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-6 pt-6 border-t border-white/10">
                                <a
                                    href={latestIssue.viewLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 sm:flex-none flex items-center justify-center gap-3 px-8 py-5 bg-gold-primary text-black font-bold tracking-[0.15em] text-xs uppercase hover:bg-white transition-all duration-300 shadow-[0_0_30px_-10px_rgba(255,215,0,0.3)] hover:shadow-[0_0_40px_-5px_rgba(255,215,0,0.5)]"
                                >
                                    <BookOpen className="w-4 h-4" /> Start Reading
                                </a>
                                {latestIssue.buyLink && (
                                    <a
                                        href={latestIssue.buyLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1 sm:flex-none flex items-center justify-center gap-3 px-8 py-5 bg-transparent border border-white/20 text-white font-bold tracking-[0.15em] text-xs uppercase hover:bg-white/10 hover:border-white/40 transition-all duration-300"
                                    >
                                        <ShoppingBag className="w-4 h-4" /> Buy Print Copy
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
