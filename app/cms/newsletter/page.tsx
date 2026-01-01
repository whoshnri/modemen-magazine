import { getSubscribers } from "@/app/actions/cms/newsletter";
import Link from "next/link";
import { ExportSubscribersButton } from "./components/export-button";
import { DeleteSubscriberButton } from "./components/delete-button";
import { EmailSender } from "../users/components/email-sender";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl sm:text-3xl font-bold tracking-widest mb-2">NEWSLETTER</h2>
                    <p className="text-muted-foreground text-xs uppercase tracking-widest">
                        {total} Total Subscribers
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                    <EmailSender
                        label="Send New Newsletter"
                        users={subscribers.map(sub => ({
                            id: sub.id,
                            email: sub.email,
                            name: sub.user?.name || "Guest",
                            subscriptionPlan: sub.user?.subscriptionPlan || "FREE"
                        }))}
                    />
                    <ExportSubscribersButton />
                </div>
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block border border-white/10 bg-[#0a0a0a] overflow-x-auto">
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

            {/* Mobile Cards */}
            <div className="md:hidden space-y-4">
                {subscribers.map((sub) => (
                    <div key={sub.id} className="border border-white/10 bg-[#0a0a0a] p-4 space-y-3">
                        <div>
                            <h3 className="font-bold text-sm text-white mb-1">
                                {sub.email}
                            </h3>
                            <p className="text-xs text-muted-foreground">
                                {sub.user?.name ? sub.user.name : "Guest"}
                            </p>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-white/5">
                            <div className="flex flex-col gap-2">
                                <div>
                                    {sub.isSubscribed ? (
                                        <span className="inline-block px-2 py-1 bg-green-900/20 text-green-500 text-[10px] font-bold uppercase tracking-widest border border-green-900/30">
                                            Active
                                        </span>
                                    ) : (
                                        <span className="inline-block px-2 py-1 bg-red-900/20 text-red-500 text-[10px] font-bold uppercase tracking-widest border border-red-900/30">
                                            Unsubscribed
                                        </span>
                                    )}
                                </div>
                                <span className="text-xs text-muted-foreground font-mono">
                                    {new Date(sub.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                            <DeleteSubscriberButton id={sub.id} />
                        </div>
                    </div>
                ))}
                {subscribers.length === 0 && (
                    <div className="border border-dashed border-white/10 p-12 text-center text-muted-foreground text-xs uppercase tracking-widest">
                        No subscribers found.
                    </div>
                )}
            </div>

            {/* Basic Pagination */}
            <div className="flex justify-center items-center gap-4 pt-8">
                <Link
                    href={`/cms/newsletter?page=${Math.max(1, page - 1)}`}
                    className={`flex items-center gap-2 px-4 py-2 border border-white/10 text-xs font-bold uppercase tracking-widest transition-colors ${page <= 1 ? 'pointer-events-none opacity-50' : 'hover:border-gold-primary hover:text-gold-primary'}`}
                >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                </Link>
                <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                    Page {page} of {pages}
                </div>
                <Link
                    href={`/cms/newsletter?page=${Math.min(pages, page + 1)}`}
                    className={`flex items-center gap-2 px-4 py-2 border border-white/10 text-xs font-bold uppercase tracking-widest transition-colors ${page >= pages ? 'pointer-events-none opacity-50' : 'hover:border-gold-primary hover:text-gold-primary'}`}
                >
                    Next
                    <ChevronRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    );
}
