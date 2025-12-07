import { getSubscribers } from "@/app/actions/cms/newsletter";
import Link from "next/link";
import { ExportSubscribersButton } from "./components/export-button";
import { DeleteSubscriberButton } from "./components/delete-button";

export const dynamic = 'force-dynamic';

export default async function NewsletterPage({
    searchParams,
}: {
    searchParams?: { page?: string, search?: string };
}) {
    const { page: pageParam, search: searchParam } = await searchParams || {};
    const page = Number(pageParam) || 1;
    const search = searchParam || "";
    const { subscribers, total, pages } = await getSubscribers(page, search);

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-widest mb-2">NEWSLETTER</h2>
                    <p className="text-muted-foreground text-xs uppercase tracking-widest">
                        {total} Total Subscribers
                    </p>
                </div>
                <ExportSubscribersButton />
            </div>

            {/* Table */}
            <div className="border border-white/10 bg-[#0a0a0a]">
                <table className="w-full text-left">
                    <thead className="border-b border-white/10 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                        <tr>
                            <th className="p-4">Email</th>
                            <th className="p-4">User</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Date Joined</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {subscribers.map((sub) => (
                            <tr key={sub.id} className="group hover:bg-white/5 transition-colors">
                                <td className="p-4">
                                    <div className="font-bold text-sm text-white mb-1 group-hover:text-gold-primary transition-colors">
                                        {sub.email}
                                    </div>
                                </td>
                                <td className="p-4 text-xs text-muted-foreground">
                                    {sub.user?.name ? (
                                        <span className="text-white">{sub.user.name}</span>
                                    ) : (
                                        <span>Guest</span>
                                    )}
                                </td>
                                <td className="p-4">
                                    {sub.isSubscribed ? (
                                        <span className="inline-block px-2 py-1 bg-green-900/20 text-green-500 text-[10px] font-bold uppercase tracking-widest border border-green-900/30">
                                            Active
                                        </span>
                                    ) : (
                                        <span className="inline-block px-2 py-1 bg-red-900/20 text-red-500 text-[10px] font-bold uppercase tracking-widest border border-red-900/30">
                                            Unsubscribed
                                        </span>
                                    )}
                                </td>
                                <td className="p-4 text-xs text-muted-foreground font-mono">
                                    {new Date(sub.createdAt).toLocaleDateString()}
                                </td>
                                <td className="p-4 text-right">
                                    <DeleteSubscriberButton id={sub.id} />
                                </td>
                            </tr>
                        ))}
                        {subscribers.length === 0 && (
                            <tr>
                                <td colSpan={5} className="p-12 text-center text-muted-foreground text-xs uppercase tracking-widest">
                                    No subscribers found.
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
                        href={`/cms/newsletter?page=${i + 1}`}
                        className={`w-8 h-8 flex items-center justify-center text-xs font-bold border ${page === i + 1 ? 'border-gold-primary text-gold-primary' : 'border-white/10 text-muted-foreground hover:border-white hover:text-white'} transition-colors`}
                    >
                        {i + 1}
                    </Link>
                ))}
            </div>
        </div>
    );
}
