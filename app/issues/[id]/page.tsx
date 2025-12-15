import { getIssueById } from "@/app/actions/cms/issues";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, BookOpen, ShoppingBag } from "lucide-react";
import { notFound } from "next/navigation";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";

export const dynamic = 'force-dynamic';

export default async function IssueDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const issue = await getIssueById(id);

    if (!issue) {
        notFound();
    }

    return (
        <>
        <Header/>
        <div className="min-h-screen bg-[#050505] text-white pt-10 pb-20">
            <div className="max-w-6xl mx-auto px-6">
                <Link
                    href="/issues"
                    className="inline-flex items-center gap-2 text-xs font-bold tracking-widest text-muted-foreground hover:text-gold-primary mb-12 uppercase transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" /> Back to Issues
                </Link>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-20">
                    {/* Left: Cover Image */}
                    <div className="md:col-span-5 lg:col-span-4">
                        <div className="relative aspect-[3/4] w-full bg-[#111] border border-white/10 shadow-2xl shadow-black/50">
                            {issue.coverImage && (
                                <Image
                                    src={issue.coverImage}
                                    alt={issue.title}
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            )}
                        </div>

                        {/* Mobile Actions (Visible only on small screens) */}
                        <div className="flex flex-col gap-3 mt-6 md:hidden">
                            <a
                                href={issue.viewLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full bg-gold-primary text-black font-bold py-4 text-xs tracking-widest text-center hover:bg-white transition-colors flex items-center justify-center gap-2"
                            >
                               READ ISSUE
                            </a>
                            {issue.buyLink && (
                                <a
                                    href={issue.buyLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full border border-white/20 text-white font-bold py-4 text-xs tracking-widest text-center hover:border-gold-primary hover:text-gold-primary transition-colors flex items-center justify-center gap-2"
                                >
                                    <ShoppingBag className="w-4 h-4" /> BUY PRINT COPY
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Right: Content */}
                    <div className="md:col-span-7 lg:col-span-8 flex flex-col justify-center">
                        <div className="mb-2">
                            <span className="inline-block px-3 py-1 bg-white/5 border border-white/10 text-[10px] font-bold tracking-widest text-gold-primary uppercase mb-6">
                                {new Date(issue.releaseDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} Issue
                            </span>
                        </div>

                        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-8 leading-tight text-white">
                            {issue.title}
                        </h1>

                        {issue.teaserText && (
                            <h2 className="text-xl md:text-2xl text-white/80 font-light mb-8 italic border-l-2 border-gold-primary pl-6">
                                "{issue.teaserText}"
                            </h2>
                        )}

                        <div className="prose prose-invert prose-lg text-muted-foreground mb-12 max-w-none">
                            <p>{issue.description}</p>
                        </div>

                        {/* Desktop Actions */}
                        <div className="hidden md:flex items-center gap-4">
                            <a
                                href={issue.viewLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-gold-primary text-black font-bold py-4 px-6 text-xs tracking-widest hover:bg-gold-secondary transition-colors flex items-center gap-2"
                            >
                                READ ISSUE
                            </a>
                            {issue.buyLink && (
                                <a
                                    href={issue.buyLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="border border-white/20 text-white font-bold py-4 px-10 text-xs tracking-widest hover:border-gold-primary hover:text-gold-primary transition-colors flex items-center gap-2"
                                >
                                    <ShoppingBag className="w-4 h-4" /> BUY PRINT COPY
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <Footer/>
        </>
    );
}
