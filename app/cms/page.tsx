                                                                    import prisma from "@/lib/prisma";
import Link from "next/link";

async function getStats() {
    const [userCount, orderCount, articleCount, productCount, subsCount] = await Promise.all([
        prisma.user.count(),
        prisma.order.count(),
        prisma.article.count(),
        prisma.product.count(),
        prisma.newsletterSubscriber.count(),
    ]);

    return { userCount, orderCount, articleCount, productCount, subsCount };
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
                <StatCard label="Total Users" value={stats.userCount} />
                <StatCard label="Total Orders" value={stats.orderCount} />
                <StatCard label="Total Articles" value={stats.articleCount} />
                <StatCard label="Active Products" value={stats.productCount} />
                <StatCard label="Newsletter Subs" value={stats.subsCount} />
            </div>

            {/* Recent Activity Section Placeholder */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="border border-white/10 bg-[#0a0a0a] p-8 min-h-[300px]">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xs font-bold tracking-[0.2em] text-gold-primary">RECENT ORDERS</h3>
                        <Link href="/cms/orders" className="text-[10px] font-bold tracking-widest text-white/50 hover:text-white transition-colors">VIEW ALL</Link>
                    </div>
                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground text-xs tracking-widest">
                        NO RECENT ORDERS
                    </div>
                </div>

                <div className="border border-white/10 bg-[#0a0a0a] p-8 min-h-[300px]">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xs font-bold tracking-[0.2em] text-gold-primary">LATEST CONTENT</h3>
                        <Link href="/cms/articles" className="text-[10px] font-bold tracking-widest text-white/50 hover:text-white transition-colors">VIEW ALL</Link>
                    </div>
                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground text-xs tracking-widest">
                        NO RECENT CONTENT
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
