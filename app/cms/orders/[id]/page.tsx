import { getOrderById } from "@/app/actions/cms/orders";
import { notFound } from "next/navigation";
import { StatusSelect } from "../components/status-select";
import Link from "next/link";
import Image from "next/image";

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }>; }) {
    const id = (await params).id
    const order = await getOrderById(id);

    if (!order) {
        notFound();
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between pb-8 border-b border-white/10">
                <div>
                    <h2 className="text-3xl font-bold tracking-widest mb-2">ORDER #{order.orderId}</h2>
                    <p className="text-muted-foreground text-xs uppercase tracking-widest">
                        Placed on {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <StatusSelect id={order.id} currentStatus={order.status} />
                    <Link
                        href="/cms/orders"
                        className="px-6 py-2 border border-white/10 text-xs font-bold uppercase tracking-widest hover:bg-white/5 transition-colors"
                    >
                        Back to List
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content: Items */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-[#0a0a0a] border border-white/10 p-6">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-gold-primary mb-6">Order Items</h3>
                        <div className="space-y-4">
                            {order.items.map((item) => (
                                <div key={item.id} className="flex gap-4 items-start py-4 border-b border-white/5 last:border-0">
                                    <div className="w-16 h-16 bg-white/5 relative shrink-0">
                                        {item.product.image && (
                                            <Image src={item.product.image} alt={item.product.name} fill className="object-cover" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-sm font-bold text-white mb-1">{item.product.name}</h4>
                                        <p className="text-xs text-muted-foreground font-mono">Qty: {item.quantity}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-bold text-white font-mono">${item.priceAtPurchase.toFixed(2)}</p>
                                        <p className="text-xs text-muted-foreground font-mono">Total: ${(item.priceAtPurchase * item.quantity).toFixed(2)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-8 pt-8 border-t border-white/10 flex justify-end">
                            <div className="w-64 space-y-2">
                                <div className="flex justify-between text-xs text-muted-foreground tracking-widest">
                                    <span>SUBTOTAL</span>
                                    <span>${order.subTotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-base font-bold text-white tracking-widest pt-2 border-t border-white/10">
                                    <span>TOTAL</span>
                                    <span>${order.total.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar: Details */}
                <div className="space-y-6">
                    {/* Customer */}
                    <div className="bg-[#0a0a0a] border border-white/10 p-6">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-gold-primary mb-4">Customer</h3>
                        <p className="text-sm font-bold text-white mb-1">{order.user.name || "Guest"}</p>
                        <p className="text-xs text-muted-foreground mb-4">{order.user.email}</p>
                        <div className="text-xs text-white/50 tracking-widest">
                            USER ID: <span className="font-mono text-white/30">{order.userId}</span>
                        </div>
                    </div>

                    {/* Shipping */}
                    <div className="bg-[#0a0a0a] border border-white/10 p-6">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-gold-primary mb-4">Shipping Address</h3>
                        <div className="text-xs text-muted-foreground space-y-1 leading-relaxed uppercase tracking-wider">
                            <p className="text-white font-bold">{order.shippingAddress.country}</p>
                            <p>{order.shippingAddress.street}</p>
                            <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                        </div>
                    </div>

                    {/* Billing */}
                    <div className="bg-[#0a0a0a] border border-white/10 p-6">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-gold-primary mb-4">Billing Address</h3>
                        <div className="text-xs text-muted-foreground space-y-1 leading-relaxed uppercase tracking-wider">
                            <p className="text-white font-bold">{order.billingAddress.country}</p>
                            <p>{order.billingAddress.street}</p>
                            <p>{order.billingAddress.city}, {order.billingAddress.state} {order.billingAddress.zipCode}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
