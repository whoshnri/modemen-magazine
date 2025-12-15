import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import Image from "next/image";
import Link from "next/link";
import { PlaySquare } from "lucide-react";
import { getSpecificInterview, loadMoreInterviews } from "@/app/actions/interviewOps";
import { notFound } from "next/navigation";
import { Metadata } from "next";

type Props = {
    params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params
    const interview = await getSpecificInterview(slug)

    if (!interview) {
        return {
            title: 'Interview Not Found',
        }
    }

    return {
        title: `${interview.title} - ${interview.people} | Mode Men Magazine`,
        description: interview.excerpt || `Read our exclusive interview with ${interview.people}.`,
        openGraph: {
            images: [interview.coverImage || ''],
        },
    }
}


export default async function InterviewDetailPage({ params }: Props) {
    const { slug } = await params
    const interview = await getSpecificInterview(slug);

    if (!interview) {
        notFound();
    }

    const moreInterviews = await loadMoreInterviews(slug, 0);

    return (
        <div className="min-h-screen bg-black-primary text-foreground flex flex-col">
            <Header />

            <main className="flex-1">
                {/* Hero */}
                <section className="relative h-[80vh] w-full">
                    <Image
                        src={interview.coverImage || ''}
                        alt={interview.title}
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black-primary via-black-primary/30 to-transparent"></div>

                    <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 z-10">
                        <div className="container-responsive">
                            <div className="max-w-4xl animate-in fade-in slide-in-from-bottom-10 duration-1000">
                                <span className="inline-block py-1 px-3 border border-gold-primary text-gold-primary text-[10px] uppercase font-bold tracking-[0.2em] mb-4">
                                    The Interview
                                </span>
                                <h1 className="text-5xl md:text-8xl text-white mb-4 leading-tight">
                                    {interview.people}
                                </h1>
                                <h2 className="text-2xl md:text-4xl font-light text-white/90 mb-8 italic">
                                    &quot;{interview.title}&quot;
                                </h2>


                                <div className="flex items-center gap-6">
                                    <a href={interview.videoUrl  ?? "" } target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 bg-white text-black-primary px-6 py-3 font-bold uppercase tracking-widest text-xs hover:bg-gold-primary transition-colors">
                                        <PlaySquare className="w-5 h-5" />
                                        Watch Film
                                    </a>
                                </div>

                            </div>
                        </div>
                    </div>
                </section>

                {/* Content */}
                <section className="py-16 md:py-24 px-6">
                    <div className="max-w-3xl mx-auto">
                        <div className="flex items-center justify-between border-b border-border pb-8 mb-12">
                            <div>
                                <p className="text-gold-primary text-xs uppercase tracking-widest font-bold mb-1">Subject</p>
                                <p className="text-white text-xl">{interview.people}</p>
                            </div>
                            <div>
                                <p className="text-gold-primary text-xs uppercase tracking-widest font-bold mb-1">Role</p>
                                <p className="text-white text-xl">{interview.tagline}</p>
                            </div>
                            <div>
                                <p className="text-gold-primary text-xs uppercase tracking-widest font-bold mb-1">Date</p>
                                <p className="text-white text-xl">{new Date(interview.publishedAt).toLocaleDateString()}</p>
                            </div>
                        </div>

                        <div className="prose prose-invert prose-lg max-w-none prose-headings prose-headings:font-normal prose-p:font-light prose-p:leading-relaxed prose-blockquote:border-gold-primary prose-blockquote:text-gold-primary prose-blockquote:italic">
                            <div dangerouslySetInnerHTML={{ __html: interview.content }} />
                        </div>
                    </div>
                </section>

                {/* Recommendations */}
                {moreInterviews && moreInterviews.length > 0 && (
                    <section className="py-16 bg-black-secondary border-t border-border">
                        <div className="container-responsive">
                            <h3 className="text-2xl text-white mb-8 border-b border-border pb-4 uppercase">More Conversations</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {moreInterviews.map((item) => (
                                    <Link href={`/interviews/${item.slug}`} key={item.id} className="group cursor-pointer">
                                        <div className="relative aspect-video w-full overflow-hidden mb-4">
                                            <Image
                                                src={item.coverImage ?? ""}
                                                alt={item.title}
                                                fill
                                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                            />
                                            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                                                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                                                    <PlaySquare className="w-5 h-5 text-white/80" />
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="text-gold-primary text-[10px] font-bold tracking-widest uppercase mb-1">{item.people}</h4>
                                            <h3 className="text-lg text-white group-hover:text-gold-primary transition-colors line-clamp-2">{item.title}</h3>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </section>
                )}
            </main>

            <Footer />
        </div>
    )
}
