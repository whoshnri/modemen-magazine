// components/ProductDetailsClient.tsx

"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useShop, Products } from "@/components/shop-context";
import { useSession } from "@/hooks/use-session";
import { useToast } from "@/components/toast/use-toast";
import { LoginDialog } from "@/components/LoginModal";
import { ArrowLeft } from "lucide-react";
import ContactOptions from "./contactOptions";

// Define the type for the product, including its categories
type ProductWithCategories = Products & {
  categories: { id: string; name: string }[];
};

export const ProductDetailsClient = ({ product }: { product: ProductWithCategories }) => {
  const { addToCart } = useShop();
  const { session } = useSession();
  const { showToast } = useToast();

  const [quantity, setQuantity] = useState(1);
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);
  const [showContactOptions, setShowContactOptions] = useState(false);

  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(product.price);

  const handleAddToCart = async () => {
    if (!session) {
      setIsLoginDialogOpen(true);
      return;
    }
    const res = await addToCart(product.id, quantity, session.id);
    if (res?.error) {
      showToast(res.error.toUpperCase(), "error");
    } else {
      showToast(res?.message?.toUpperCase() || "Item(s) added to cart!", "success");
    }
  };

  const handleGetInTouch = () => {
    setShowContactOptions(true)
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <Link href={`/shop#${product.id}`} className="flex items-center gap-1 text-lg text-gold-secondary hover:underline underline-offset-2 p-3"><ArrowLeft />Back to Shop</Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        {/* Left Column: Product Image */}
        <div className="relative aspect-square border border-border bg-black-secondary">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
          />
        </div>

        {/* Right Column: Product Details & Actions */}
        <div className="flex flex-col gap-4">
          <div className="text-sm text-muted-foreground tracking-widest">
            {product.categories.map((cat, index) => (
              <span key={cat.id}>
                <Link href={`/shop/category/${cat.name.toLowerCase()}`} className="hover:text-gold-primary">
                  {cat.name.toUpperCase()}
                </Link>
                {index < product.categories.length - 1 && ' / '}
              </span>
            ))}
          </div>
          <div className="space-y-1">
            {product.designer && (
              <p className="text-gold-primary text-sm font-bold tracking-[0.3em] uppercase">
                {product.designer}
              </p>
            )}
            <h1 className="text-4xl font-bold tracking-wider text-foreground">{product.name}</h1>
          </div>

          <p className="text-3xl font-bold text-white tracking-widest">{formattedPrice}</p>

          <div className="border-y border-white/10 py-6 space-y-4">
            {product.desc && (
              <p className="text-muted-foreground leading-relaxed italic">
                {product.desc}
              </p>
            )}

            <div className="grid grid-cols-2 gap-4 pt-4 text-xs tracking-widest uppercase">
              {product.size && (
                <div className="flex flex-col gap-1">
                  <span className="text-white/40">Size</span>
                  <span className="text-white font-bold">{product.size}</span>
                </div>
              )}
              {product.color && (
                <div className="flex flex-col gap-1">
                  <span className="text-white/40">Color</span>
                  <span className="text-white font-bold">{product.color}</span>
                </div>
              )}
              <div className="flex flex-col gap-1">
                <span className="text-white/40">Availability</span>
                <span className={`${product.stock > 0 ? 'text-green-500' : 'text-red-500'} font-bold`}>
                  {product.stock > 0 ? `${product.stock} IN STOCK` : 'OUT OF STOCK'}
                </span>
              </div>
            </div>
          </div>

          {/* Add to Cart Button */}
          {/* <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="mt-6 w-full bg-gold-primary text-black-primary font-bold py-4 text-sm tracking-widest hover:bg-gold-secondary transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
          >
            {product.stock > 0 ? 'ADD TO CART' : 'OUT OF STOCK'}
          </button> */}

          <button
            onClick={handleGetInTouch}
            disabled={product.stock === 0}
            className="mt-6 w-full bg-gold-primary text-black-primary font-bold py-4 text-sm tracking-widest hover:bg-gold-secondary transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed uppercase"
          >
            GET in touch to order
          </button>
        </div>
      </div>

      <ContactOptions isVisible={showContactOptions} setIsVisible={setShowContactOptions} />

      <LoginDialog
        header="Login Required"
        text="Please log in to manage your shopping cart."
        isOpen={isLoginDialogOpen}
        onClose={() => setIsLoginDialogOpen(false)}
      />
    </div>
  );
};