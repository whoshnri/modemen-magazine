'use client'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { useState, useEffect } from 'react'
import Link from 'next/link'

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: '1',
      name: 'Limited Edition Perfume',
      price: 250,
      quantity: 1,
      image: '/luxury-perfume-bottle.png'
    },
    {
      id: '2',
      name: 'Silk Pillowcase Set',
      price: 180,
      quantity: 2,
      image: '/luxury-silk-pillowcase.jpg'
    }
  ])

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const tax = subtotal * 0.1
  const total = subtotal + tax

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id)
    } else {
      setCartItems(cartItems.map(item =>
        item.id === id ? { ...item, quantity } : item
      ))
    }
  }

  const removeItem = (id: string) => {
    setCartItems(cartItems.filter(item => item.id !== id))
  }

  return (
    <div className="min-h-screen bg-black-primary flex flex-col">
      <Header />

      <main className="flex-1">
        <section className="px-6 py-12">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-4xl font-bold tracking-widest mb-12">SHOPPING CART</h1>

            {cartItems.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-muted-foreground mb-6">Your cart is empty</p>
                <Link
                  href="/articles"
                  className="inline-block px-8 py-3 bg-gold-primary text-black-primary font-bold tracking-widest hover:bg-gold-secondary transition-colors"
                >
                  CONTINUE SHOPPING
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Cart Items */}
                <div className="lg:col-span-2">
                  <div className="space-y-6">
                    {cartItems.map((item) => (
                      <div key={item.id} className="border border-border p-6 flex gap-6">
                        <div className="w-32 h-32 shrink-0 bg-black-secondary overflow-hidden">
                          <img
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <h3 className="text-lg font-bold tracking-wide mb-2">{item.name}</h3>
                            <p className="text-gold-primary font-bold">${item.price.toFixed(2)}</p>
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
                              onClick={() => removeItem(item.id)}
                              className="ml-auto text-sm font-bold text-muted-foreground hover:text-destructive transition-colors uppercase hover:underline underline-offset-4 cursor-pointer"
                            >
                              REMOVE
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
                    <h2 className="text-xl font-bold tracking-widest mb-6">ORDER SUMMARY</h2>
                    
                    <div className="space-y-4 mb-6 pb-6 border-b border-border">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span>${subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Tax (10%)</span>
                        <span>${tax.toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="flex justify-between mb-8">
                      <span className="font-bold tracking-widest">TOTAL</span>
                      <span className="text-lg font-bold text-gold-primary">${total.toFixed(2)}</span>
                    </div>

                    <button className="w-full px-4 py-4 bg-gold-primary text-black-primary font-bold tracking-widest hover:bg-gold-secondary transition-colors mb-3">
                      PROCEED TO CHECKOUT
                    </button>
                    
                    <Link
                      href="/shop"
                      className="block text-center px-4 py-4 border border-border text-foreground font-bold tracking-widest hover:border-gold-primary hover:text-gold-primary transition-colors"
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
