import { getArticles, deleteArticle } from "@/app/actions/cms/articles";
import Link from "next/link";
import { DeleteArticleButton } from "./components/delete-button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function ArticlesPage({
    searchParams,
}: {
    searchParams?: { page?: string, search?: string };
}) {
    const { page: pageParam, search: searchParam } = await searchParams || {};
    const page = Number(pageParam) || 1;
    const search = searchParam || "";
    const { articles, total, pages } = await getArticles(page, search);

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl sm:text-3xl font-bold tracking-widest mb-2">ARTICLES</h2>
                    <p className="text-muted-foreground text-xs uppercase tracking-widest">
                        {total} Total Articles
                    </p>
                </div>
                <Link
                    href="/cms/articles/new"
                    className="px-6 py-3 bg-gold-primary text-black font-bold text-xs uppercase tracking-widest hover:bg-white transition-colors text-center"
                >
                    Create New
                </Link>
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block border border-white/10 bg-[#0a0a0a] overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="border-b border-white/10 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                        <tr>
                            <th className="p-4">Title</th>
                            <th className="p-4">Author</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Date</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {articles.map((article) => (
                            <tr key={article.id} className="group hover:bg-white/5 transition-colors">
                                <td className="p-4">
                                    <div className="font-bold uppercase text-sm text-white mb-1 group-hover:text-gold-primary transition-colors">
                                        {article.title}
                                    </div>
                                    <div className="text-[10px] text-muted-foreground tracking-wider">
                                        /{article.slug}
                                    </div>
                                </td>
                                <td className="p-4 text-xs text-muted-foreground font-medium uppercase tracking-wider">
                                    {article.writtenBy}
                                </td>
                                <td className="p-4">
                                    {article.featured ? (
                                        <span className="inline-block px-2 py-1 bg-gold-primary/10 text-gold-primary text-[10px] font-bold uppercase tracking-widest border border-gold-primary/20">
                                            Featured
                                        </span>
                                    ) : (
                                        <span className="inline-block px-2 py-1 bg-white/5 text-muted-foreground text-[10px] font-bold uppercase tracking-widest">
                                            Standard
                                        </span>
                                    )}
                                </td>
                                <td className="p-4 text-xs text-muted-foreground font-mono">
                                    {new Date(article.createdAt).toLocaleDateString()}
                                </td>
                                <td className="p-4 text-right space-x-4">
                                    <Link
                                        href={`/cms/articles/${article.slug}`}
                                        className="text-xs font-bold uppercase tracking-widest text-white hover:text-gold-primary transition-colors"
                                    >
                                        Edit
                                    </Link>
                                    <DeleteArticleButton id={article.id} />
                                </td>
                            </tr>
                        ))}
                        {articles.length === 0 && (
                            <tr>
                                <td colSpan={5} className="p-12 text-center text-muted-foreground text-xs uppercase tracking-widest">
                                    No articles found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-4">
                {articles.map((article) => (
                    <div key={article.id} className="border border-white/10 bg-[#0a0a0a] p-4 space-y-3">
                        <div>
                            <h3 className="font-bold uppercase text-sm text-white mb-1">
                                {article.title}
                            </h3>
                            <p className="text-[10px] text-muted-foreground tracking-wider">
                                /{article.slug}
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-2 text-xs">
                            <div className="flex items-center gap-2">
                                <span className="text-muted-foreground uppercase text-[10px]">Author:</span>
                                <span className="text-white font-medium">{article.writtenBy}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-muted-foreground uppercase text-[10px]">Date:</span>
                                <span className="text-white font-mono text-[10px]">{new Date(article.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-white/5">
                            <div>
                                {article.featured ? (
                                    <span className="inline-block px-2 py-1 bg-gold-primary/10 text-gold-primary text-[10px] font-bold uppercase tracking-widest border border-gold-primary/20">
                                        Featured
                                    </span>
                                ) : (
                                    <span className="inline-block px-2 py-1 bg-white/5 text-muted-foreground text-[10px] font-bold uppercase tracking-widest">
                                        Standard
                                    </span>
                                )}
                            </div>
                            <div className="flex gap-3">
                                <Link
                                    href={`/cms/articles/${article.slug}`}
                                    className="text-xs font-bold uppercase tracking-widest text-white hover:text-gold-primary transition-colors"
                                >
                                    Edit
                                </Link>
                                <DeleteArticleButton id={article.id} />
                            </div>
                        </div>
                    </div>
                ))}
                {articles.length === 0 && (
                    <div className="border border-dashed border-white/10 p-12 text-center text-muted-foreground text-xs uppercase tracking-widest">
                        No articles found.
                    </div>
                )}
            </div>

            {/* Basic Pagination */}
            <div className="flex justify-center items-center gap-4 pt-8">
                <Link
                    href={`/cms/articles?page=${Math.max(1, page - 1)}`}
                    className={`flex items-center gap-2 px-4 py-2 border border-white/10 text-xs font-bold uppercase tracking-widest transition-colors ${page <= 1 ? 'pointer-events-none opacity-50' : 'hover:border-gold-primary hover:text-gold-primary'}`}
                >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                </Link>
                <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                    Page {page} of {pages}
                </div>
                <Link
                    href={`/cms/articles?page=${Math.min(pages, page + 1)}`}
                    className={`flex items-center gap-2 px-4 py-2 border border-white/10 text-xs font-bold uppercase tracking-widest transition-colors ${page >= pages ? 'pointer-events-none opacity-50' : 'hover:border-gold-primary hover:text-gold-primary'}`}
                >
                    Next
                    <ChevronRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    );
}
