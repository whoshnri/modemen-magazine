import { getInterviews } from "@/app/actions/cms/interviews";
import Link from "next/link";
import { Plus, Edit, User } from "lucide-react";

export default async function InterviewsPage() {
    const { data: interviews } = await getInterviews();

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between pb-8 border-b border-white/10">
                <h2 className="text-3xl font-bold tracking-widest text-white">INTERVIEWS</h2>
                <Link
                    href="/cms/interviews/new"
                    className="flex items-center gap-2 bg-gold-primary text-black-primary px-6 py-3 font-bold text-xs uppercase tracking-widest hover:bg-gold-secondary transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    <span>Add Interview</span>
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {interviews?.map((interview) => (
                    <div key={interview.id} className="bg-[#0a0a0a] border border-white/10 group overflow-hidden flex flex-col">
                        <div className="relative h-48 bg-white/5">
                            {interview.coverImage ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={interview.coverImage} alt={interview.title} className="w-full h-full object-cover" />
                            ) : (
                                <div className="flex items-center justify-center h-full text-muted-foreground">No Cover Image</div>
                            )}
                            {interview.featured && (
                                <div className="absolute top-2 right-2 bg-gold-primary text-black-primary text-[10px] font-bold px-2 py-1 uppercase tracking-widest">
                                    Featured
                                </div>
                            )}
                        </div>
                        <div className="p-6 flex-1 flex flex-col">
                            <div className="flex items-center gap-2 text-xs text-gold-primary font-bold uppercase tracking-widest mb-2">
                                <User className="w-3 h-3" />
                                {interview.people || "Unknown Guest"}
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2 leading-tight">{interview.title}</h3>
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">
                                {interview.excerpt || interview.tagline}
                            </p>
                            <div className="pt-4 border-t border-white/10 flex justify-end items-center">
                                <Link
                                    href={`/cms/interviews/${interview.id}`}
                                    className="text-gold-primary hover:text-white transition-colors"
                                >
                                    <Edit className="w-4 h-4" />
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
