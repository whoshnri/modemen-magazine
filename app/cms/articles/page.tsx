import { getArticles, deleteArticle } from "@/app/actions/cms/articles";
import Link from "next/link";
import { DeleteArticleButton } from "./components/delete-button";

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
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-widest mb-2">ARTICLES</h2>
                    <p className="text-muted-foreground text-xs uppercase tracking-widest">
                        {total} Total Articles
                    </p>
                </div>
                <Link
                    href="/cms/articles/new"
                    className="px-6 py-3 bg-gold-primary text-black font-bold text-xs uppercase tracking-widest hover:bg-white transition-colors"
                >
                    Create New
                </Link>
            </div>

            {/* Table */}
            <div className="border border-white/10 bg-[#0a0a0a]">
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

            {/* Basic Pagination */}
            <div className="flex justify-center gap-2">
                {Array.from({ length: pages }).map((_, i) => (
                    <Link
                        key={i}
                        href={`/cms/articles?page=${i + 1}`}
                        className={`w-8 h-8 flex items-center justify-center text-xs font-bold border ${page === i + 1 ? 'border-gold-primary text-gold-primary' : 'border-white/10 text-muted-foreground hover:border-white hover:text-white'} transition-colors`}
                    >
                        {i + 1}
                    </Link>
                ))}
            </div>
        </div>
    );
}
