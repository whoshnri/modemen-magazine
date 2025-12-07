import { getOrders } from "@/app/actions/cms/orders";
import Link from "next/link";
import { ExportOrdersButton } from "./components/export-button";

export const dynamic = 'force-dynamic';

export default async function OrdersPage({
    searchParams,
}: {
    searchParams?: { page?: string, search?: string };
}) {
    const { page: pageParam, search: searchParam } = await searchParams || {};
    const page = Number(pageParam) || 1;
    const search = searchParam || "";
    const { orders, total, pages } = await getOrders(page, search);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PAID': return 'text-green-500';
            case 'PENDING': return 'text-yellow-500';
            case 'SHIPPED': return 'text-blue-500';
            case 'DELIVERED': return 'text-gold-primary';
            case 'CANCELED': return 'text-red-500';
            default: return 'text-muted-foreground';
        }
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-widest mb-2">ORDERS</h2>
                    <p className="text-muted-foreground text-xs uppercase tracking-widest">
                        {total} Total Orders
                    </p>
                </div>
                <ExportOrdersButton />
            </div>

            {/* Table */}
            <div className="border border-white/10 bg-[#0a0a0a]">
                <table className="w-full text-left">
                    <thead className="border-b border-white/10 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                        <tr>
                            <th className="p-4">Order ID</th>
                            <th className="p-4">Customer</th>
                            <th className="p-4">Date</th>
                            <th className="p-4">Total</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {orders.map((order) => (
                            <tr key={order.id} className="group hover:bg-white/5 transition-colors">
                                <td className="p-4">
                                    <div className="font-bold text-sm text-white mb-1 group-hover:text-gold-primary transition-colors">
                                        #{order.orderId}
                                    </div>
                                    {order.reference && <div className="text-[10px] text-muted-foreground">Ref: {order.reference}</div>}
                                </td>
                                <td className="p-4">
                                    <div className="text-sm font-bold text-white">{order.user.name || "Guest"}</div>
                                    <div className="text-[10px] text-muted-foreground">{order.user.email}</div>
                                </td>
                                <td className="p-4 text-xs font-mono text-muted-foreground">
                                    {new Date(order.createdAt).toLocaleDateString()}
                                </td>
                                <td className="p-4 text-xs font-mono font-bold text-white">
                                    ${order.total.toFixed(2)}
                                </td>
                                <td className="p-4">
                                    <span className={`text-[10px] font-bold uppercase tracking-widest ${getStatusColor(order.status)}`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td className="p-4 text-right">
                                    <Link
                                        href={`/cms/orders/${order.id}`}
                                        className="text-xs font-bold uppercase tracking-widest text-white hover:text-gold-primary transition-colors"
                                    >
                                        View Details
                                    </Link>
                                </td>
                            </tr>
                        ))}
                        {orders.length === 0 && (
                            <tr>
                                <td colSpan={6} className="p-12 text-center text-muted-foreground text-xs uppercase tracking-widest">
                                    No orders found.
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
                        href={`/cms/orders?page=${i + 1}`}
                        className={`w-8 h-8 flex items-center justify-center text-xs font-bold border ${page === i + 1 ? 'border-gold-primary text-gold-primary' : 'border-white/10 text-muted-foreground hover:border-white hover:text-white'} transition-colors`}
                    >
                        {i + 1}
                    </Link>
                ))}
            </div>
        </div>
    );
}
