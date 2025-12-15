import { getIssues } from "@/app/actions/cms/issues";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export const dynamic = 'force-dynamic';

export default async function IssuesPage() {
    const { data: issues } = await getIssues();

    return (
        <>
        <Header/>
        <div className="min-h-screen bg-[#050505] text-white selection:bg-gold-primary/30 pt-24 pb-20">
            <div className="max-w-[1600px] mx-auto px-6 sm:px-12">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-6">
                    <div>
                        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4">
                            MODEMEN <span className="text-gold-primary">ISSUES</span>
                        </h1>
                        <p className="text-muted-foreground max-w-xl text-lg">
                            Explore our archive of curated stories, interviews, and editorials defining the modern African gentleman.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {issues?.map((issue) => (
                        <div key={issue.id} className="group relative bg-[#0a0a0a] border border-white/10 overflow-hidden flex flex-col h-full hover:border-gold-primary/50 transition-colors">
                            {/* Issue Cover */}
                            <div className="relative aspect-[3/4] overflow-hidden">
                                {issue.coverImage ? (
                                    <Image
                                        src={issue.coverImage}
                                        alt={issue.title}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-white/5 flex items-center justify-center text-muted-foreground">
                                        No Cover
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />

                                <div className="absolute bottom-0 left-0 p-6 w-full">
                                    <p className="text-gold-primary text-xs font-bold tracking-widest uppercase mb-2">
                                        {new Date(issue.releaseDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                    </p>
                                    <h3 className="text-xl font-bold text-white mb-2 leading-tight">
                                        {issue.title}
                                    </h3>
                                    {issue.teaserText && (
                                        <p className="text-sm text-gray-300 line-clamp-2">
                                            {issue.teaserText}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="p-6 mt-auto border-t border-white/10 flex items-center justify-between gap-4">
                                <Link
                                    href={`/issues/${issue.id}`}
                                    className="flex-1 flex items-center justify-center gap-2 bg-white text-black font-bold py-3 text-xs tracking-widest hover:bg-gold-primary transition-colors"
                                >
                                    DETAILS
                                </Link>
                                {issue.buyLink && (
                                    <a
                                        href={issue.buyLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center w-12 h-12 border border-white/20 text-white hover:border-gold-primary hover:text-gold-primary transition-colors"
                                    >
                                        <ArrowUpRight className="w-4 h-4" />
                                    </a>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
        <Footer/>
        </>
    );
}
