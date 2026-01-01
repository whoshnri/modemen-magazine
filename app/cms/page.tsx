import prisma from "@/lib/prisma";
import Link from "next/link";

async function getStats() {
    const [userCount, orderCount, articleCount, productCount, subsCount, recentArticles] = await Promise.all([
        prisma.user.count(),
        prisma.order.count(),
        prisma.article.count(),
        prisma.product.count(),
        prisma.newsletterSubscriber.count(),
        prisma.article.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            select: { id: true, title: true, createdAt: true, category: true }
        })
    ]);

    return { userCount, orderCount, articleCount, productCount, subsCount, recentArticles };
}

export default async function CMSDashboard() {
    const stats = await getStats();

    return (
        <div className="space-y-12">
            <div>
                <h2 className="text-3xl font-bold tracking-widest mb-2">OVERVIEW</h2>
                <p className="text-muted-foreground text-sm">Welcome back to the command center.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard label="Total Users" value={stats.userCount || 0} />
                <StatCard label="Total Orders" value={stats.orderCount || 0} />
                <StatCard label="Total Articles" value={stats.articleCount || 0} />
                <StatCard label="Active Products" value={stats.productCount || 0} />
                <StatCard label="Newsletter Subs" value={stats.subsCount || 0} />
            </div>

            {/* Quick Actions / Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Content */}
                <div className="border border-white/10 bg-[#0a0a0a] p-8 min-h-[300px] relative group hover:border-gold-primary/30 transition-colors">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xs font-bold tracking-[0.2em] text-gold-primary">LATEST CONTENT</h3>
                        <Link href="/cms/articles" className="text-[10px] font-bold tracking-widest text-white/50 hover:text-white transition-colors">VIEW ALL</Link>
                    </div>

                    {stats.recentArticles.length > 0 ? (
                        <div className="space-y-4">
                            {stats.recentArticles.map((article) => (
                                <div key={article.id} className="flex items-center justify-between border-b border-white/5 pb-2 last:border-0 last:pb-0">
                                    <div className="flex flex-col gap-1">
                                        <h4 className="text-sm font-medium text-white truncate max-w-[200px] md:max-w-[300px]">{article.title}</h4>
                                        <span className="text-[10px] text-muted-foreground tracking-wider uppercase">
                                            {new Date(article.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div className={`px-2 py-1 text-[8px] font-bold uppercase tracking-widest border border-green-500/50 text-green-500`}>
                                      {article.category}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-muted-foreground text-xs tracking-widest pb-8">
                            NO RECENT CONTENT
                        </div>
                    )}
                </div>

                {/* Ads Management */}
                <div className="border border-white/10 bg-[#0a0a0a] p-8 min-h-[300px] relative group hover:border-gold-primary/30 transition-colors">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xs font-bold tracking-[0.2em] text-gold-primary">ADVERTISEMENTS</h3>
                        <Link href="/cms/ads" className="text-[10px] font-bold tracking-widest text-white/50 hover:text-white transition-colors">MANAGE</Link>
                    </div>
                    <div className="flex flex-col items-center justify-center h-full pb-8">
                        <Link href="/cms/ads" className="px-6 py-3 bg-white/5 border border-white/10 text-white text-xs font-bold tracking-widest uppercase hover:bg-gold-primary hover:text-black transition-all">
                            Manage Ads
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ label, value }: { label: string, value: number }) {
    return (
        <div className="border border-white/10 bg-[#0a0a0a] p-6 hover:border-gold-primary/50 transition-colors group">
            <h3 className="text-[10px] font-bold tracking-[0.2em] text-muted-foreground uppercase mb-2 group-hover:text-gold-primary transition-colors">{label}</h3>
            <p className="text-3xl font-bold text-white tracking-widest">{value.toLocaleString()}</p>
        </div>
    );
}
