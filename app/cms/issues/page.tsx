import { getIssues } from "@/app/actions/cms/issues";
import Link from "next/link";
import { Plus, Edit, BookOpen } from "lucide-react";

export default async function IssuesPage() {
    const { data: issues } = await getIssues();

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between pb-8 border-b border-white/10">
                <h2 className="text-3xl font-bold tracking-widest text-white">ISSUES</h2>
                <Link
                    href="/cms/issues/new"
                    className="flex items-center gap-2 bg-gold-primary text-black-primary px-6 py-3 font-bold text-xs uppercase tracking-widest hover:bg-gold-secondary transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    <span>Create Issue</span>
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {issues?.map((issue) => (
                    <div key={issue.id} className="bg-[#0a0a0a] border border-white/10 group overflow-hidden flex flex-col">
                        <div className="relative h-64 bg-white/5">
                            {issue.coverImage ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={issue.coverImage} alt={issue.title} className="w-full h-full object-cover" />
                            ) : (
                                <div className="flex items-center justify-center h-full text-muted-foreground">No Cover Image</div>
                            )}
                        </div>
                        <div className="p-6 flex-1 flex flex-col">
                            <h3 className="text-xl font-bold text-white mb-2 leading-tight">{issue.title}</h3>
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">
                                {issue.description}
                            </p>
                            <div className="pt-4 border-t border-white/10 flex justify-end items-center">
                                <Link
                                    href={`/cms/issues/${issue.id}`}
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
