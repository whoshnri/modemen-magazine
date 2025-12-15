"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useShop } from "@/components/shop-context";
import { useSession } from "@/hooks/use-session";
import Spinner from "@/components/spinner";
import { useState } from "react";

export default function CartContent() {
    const router = useRouter();
    const { session, isLoading } = useSession();
    const {
        cart,
        cartId,
        removeFromCart,
        updateQuantity,
        cartTotal,
        itemCount,
        loading: cartLoading,
    } = useShop();
    const [isProcessing, setIsProcessing] = useState(false);

    const tax = (cartTotal || 0) * 0.1;
    const total = (cartTotal || 0) + tax;

    const handleCheckout = async () => {
        setIsProcessing(true);
        router.push(`/cart/checkout/${cartId}`);
        setIsProcessing(false);
    };


    if (cartLoading || isLoading) {
        return (
            <div className="min-h-screen bg-black-primary flex flex-col">
                <Header />
                <main className="flex-1 flex items-center justify-center p-4">
                    <Spinner />
                </main>
                <Footer />
            </div>
        );
    }

    // Not logged in → show login prompt (but still show cart preview if exists)
    if (!session) {
        return (
            <div className="min-h-screen bg-black-primary flex flex-col">
                <Header />
                <main className="flex-1 px-6 py-12">
                    <div className="max-w-6xl mx-auto text-center py-20">
                        <h1 className="text-4xl font-bold tracking-widest mb-8">
                            SHOPPING CART
                        </h1>
                        <div className="bg-black-secondary border border-border p-12 max-w-md mx-auto">
                            <p className="text-lg mb-6">
                                Please log in to manage your cart and checkout.
                            </p>
                            <Link
                                href="/login?redirect=/cart"
                                className="inline-block px-8 py-4 bg-gold-primary text-black-primary font-bold tracking-widest hover:bg-gold-secondary transition-colors"
                            >
                                LOG IN TO CONTINUE
                            </Link>

                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    // Logged in but cart is empty
    if (itemCount === 0 || !cart) {
        return (
            <div className="min-h-screen bg-black-primary flex flex-col">
                <Header />
                <main className="flex-1 px-6 py-12">
                    <div className="max-w-6xl mx-auto text-center py-20">
                        <h1 className="text-4xl font-bold tracking-widest mb-8">
                            SHOPPING CART
                        </h1>
                        <p className="text-muted-foreground mb-8 text-lg">
                            Your cart is empty
                        </p>
                        <Link
                            href="/shop"
                            className="inline-block px-8 py-4 bg-gold-primary text-black-primary font-bold tracking-widest hover:bg-gold-secondary transition-colors"
                        >
                            CONTINUE SHOPPING
                        </Link>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    // === Main Cart View (only when logged in + has items) ===
    return (
        <div className="min-h-screen bg-black-primary flex flex-col">
            <Header />

            <main className="flex-1 px-6 py-12">
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-4xl font-bold tracking-widest mb-12">
                        SHOPPING CART
                    </h1>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        {/* Cart Items */}
                        <div className="lg:col-span-2">
                            <div className="space-y-6">
                                {cart.map((item) => (
                                    <div
                                        key={item.id}
                                        className="border border-border p-6 flex gap-6"
                                    >
                                        <Link href={`/shop/${item.product.id}`} className="w-32 h-32 shrink-0 bg-black-secondary overflow-hidden hover:border-gold-primary transition-colors border">
                                            <img
                                                src={item.product.image || "/placeholder.svg"}
                                                alt={item.product.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </Link>
                                        <div className="flex-1 flex flex-col justify-between">
                                            <div>
                                                <h3 className="text-lg font-bold tracking-wide mb-1">
                                                    {item.product.name}
                                                </h3>
                                                <p className="text-gold-primary font-bold mt-2">
                                                    ${item.product.price.toFixed(2)}
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-4 mt-4">
                                                <div className="flex border border-border">
                                                    <button
                                                        onClick={() =>
                                                            updateQuantity(item.id, item.quantity - 1)
                                                        }
                                                        className="px-3 py-2 text-sm font-bold hover:bg-black-secondary transition-colors"
                                                        aria-label="Decrease quantity"
                                                    >
                                                        −
                                                    </button>
                                                    <span className="px-4 py-2 text-sm font-bold border-l border-r border-border min-w-12 text-center">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() =>
                                                            updateQuantity(item.id, item.quantity + 1)
                                                        }
                                                        className="px-3 py-2 text-sm font-bold hover:bg-black-secondary transition-colors"
                                                        aria-label="Increase quantity"
                                                    >
                                                        +
                                                    </button>
                                                </div>

                                                <button
                                                    onClick={() => removeFromCart(item.id)}
                                                    className="ml-auto text-sm font-bold text-muted-foreground hover:text-destructive transition-colors uppercase hover:underline underline-offset-4"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="border border-border p-8 sticky top-6">
                                <h2 className="text-xl font-bold tracking-widest mb-6">
                                    ORDER SUMMARY
                                </h2>

                                <div className="space-y-4 mb-6 pb-6 border-b border-border">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Subtotal</span>
                                        <span>${cartTotal ? cartTotal.toFixed(2) : "0.00"}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">
                                            Tax (Est. 10%)
                                        </span>
                                        <span>${tax.toFixed(2)}</span>
                                    </div>
                                </div>

                                <div className="flex justify-between mb-8">
                                    <span className="font-bold tracking-widest">TOTAL</span>
                                    <span className="text-lg font-bold text-gold-primary">
                                        ${total.toFixed(2)}
                                    </span>
                                </div>

                                <button
                                    onClick={handleCheckout}
                                    disabled={isProcessing}
                                    className="w-full px-4 py-4 bg-gold-primary text-black-primary font-bold tracking-widest hover:bg-gold-secondary transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {isProcessing ? "PROCESSING..." : "PROCEED TO CHECKOUT"}
                                </button>

                                <Link
                                    href="/shop"
                                    className="mt-4 block text-center px-4 py-4 border border-border text-foreground font-bold tracking-widest hover:border-gold-primary hover:text-gold-primary transition-colors"
                                >
                                    CONTINUE SHOPPING
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
