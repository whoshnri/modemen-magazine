'use client'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ShopProvider, useShop } from '@/components/shop-context'
import { initiateOrder } from '@/app/actions/storeOperations'
import { toast } from 'sonner'
import { useSession } from '@/hooks/use-session'

export default function CartPage() {
  const router = useRouter()
  const {session} = useSession()
  const { cart, removeFromCart, updateQuantity, cartTotal, itemCount, loading } = useShop()
  const [isProcessing, setIsProcessing] = useState(false)
  const [showLogin, setShowLogin] = useState(false)

  if(!session){
    setShowLogin(true)
  }

  // Tax and total are now derived from the context's cartTotal
  const tax = (cartTotal || 0) * 0.1 // Example 10% tax rate
  const total = (cartTotal || 0) + tax

  const handleCheckout = async () => {
    setIsProcessing(true)
    const result = await initiateOrder()

    if (result.success && result.order) {
      toast.success("Order created! Redirecting to checkout...")
      // Redirect to a dedicated checkout or order confirmation page
      router.push(`/orders/${result.order.id}`)
    } else {
      toast.error(result.error || "Failed to create order.")
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-screen bg-black-primary flex flex-col">
      <Header />

      <main className="flex-1">
        <section className="px-6 py-12">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-4xl font-bold tracking-widest mb-12">SHOPPING CART</h1>

            {itemCount === 0 || !cart && !loading  ? (
              <div className="text-center py-20">
                <p className="text-muted-foreground mb-6">Your cart is empty</p>
                <Link
                  href="/shop"
                  className="inline-block px-8 py-3 bg-gold-primary text-black-primary font-bold tracking-widest hover:bg-gold-secondary transition-colors"
                >
                  CONTINUE SHOPPING
                </Link>
              </div>
            ) : session && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2">
                  <div className="space-y-6">
                    {cart?.map((item) => (
                      <div key={item.id} className="border border-border p-6 flex gap-6">
                        <div className="w-32 h-32 shrink-0 bg-black-secondary overflow-hidden">
                          <img
                            src={item.product.image || "/placeholder.svg"}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <h3 className="text-lg font-bold tracking-wide mb-1">{item.product.name}</h3>
                            <p className="text-gold-primary font-bold mt-2">${item.product.price.toFixed(2)}</p>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="flex border border-border">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="px-3 py-2 text-sm font-bold hover:bg-black-secondary transition-colors"
                              >
                                −
                              </button>
                              <span className="px-4 py-2 text-sm font-bold border-l border-r border-border">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="px-3 py-2 text-sm font-bold hover:bg-black-secondary transition-colors"
                              >
                                +
                              </button>
                            </div>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="ml-auto text-sm font-bold text-muted-foreground hover:text-destructive transition-colors uppercase hover:underline underline-offset-4 cursor-pointer"
                            >
                              REMOVE
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                    {
                      !cart && loading && <p>Loading cart items...</p>
                    }
                    {
                      showLogin && (
                        <div className="text-center py-20">
                          <p className="text-muted-foreground mb-6">Please log in to view your cart.</p>
                          <Link
                            href="/login"
                            className="inline-block px-8 py-3 bg-gold-primary text-black-primary font-bold tracking-widest hover:bg-gold-secondary transition-colors"
                          >
                            LOGIN
                          </Link>
                        </div>
                      )
                    }
                  </div>
                </div>

                <div className="lg:col-span-1">
                  <div className="border border-border p-8 sticky top-6">
                    <h2 className="text-xl font-bold tracking-widest mb-6">ORDER SUMMARY</h2>
                    <div className="space-y-4 mb-6 pb-6 border-b border-border">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span>${cartTotal?.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Tax (Est. 10%)</span>
                        <span>${tax.toFixed(2)}</span>
                      </div>
                    </div>
                    <div className="flex justify-between mb-8">
                      <span className="font-bold tracking-widest">TOTAL</span>
                      <span className="text-lg font-bold text-gold-primary">${total.toFixed(2)}</span>
                    </div>
                    <button
                      onClick={handleCheckout}
                      disabled={isProcessing}
                      className="w-full px-4 py-4 bg-gold-primary text-black-primary font-bold tracking-widest hover:bg-gold-secondary transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed"
                    >
                      {isProcessing ? "PROCESSING..." : "PROCEED TO CHECKOUT"}
                    </button>
                    <Link
                      href="/shop"
                      className="mt-3 block text-center px-4 py-4 border border-border text-foreground font-bold tracking-widest hover:border-gold-primary hover:text-gold-primary transition-colors"
                    >
                      CONTINUE SHOPPING
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}