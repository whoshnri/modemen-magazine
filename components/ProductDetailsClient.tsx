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

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
         <Link href={`/shop#${product.id}`} className="flex items-center gap-1 text-lg text-gold-secondary hover:underline underline-offset-2 p-3"><ArrowLeft/>Back to Shop</Link>

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
          <h1 className="text-4xl font-bold tracking-wider text-foreground">{product.name}</h1>
          <p className="text-2xl font-bold text-gold-primary tracking-widest">{formattedPrice}</p>
          
          <div className="border-y border-border py-6 text-muted-foreground leading-relaxed">
            {/* You can add a description field to your schema and display it here */}
            <p>
              This is a placeholder for the product description. Enhance your Prisma schema with a 'description' field to provide compelling details about this exclusive item.
            </p>
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center gap-4 mt-4">
            <p className="font-bold">QUANTITY:</p>
            <div className="flex border border-border">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-4 py-2 text-lg font-bold hover:bg-black-secondary transition-colors"
              >
                −
              </button>
              <span className="px-6 py-2 text-md font-bold border-l border-r border-border">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-4 py-2 text-lg font-bold hover:bg-black-secondary transition-colors"
              >
                +
              </button>
            </div>
          </div>
          
          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="mt-6 w-full bg-gold-primary text-black-primary font-bold py-4 text-sm tracking-widest hover:bg-gold-secondary transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
          >
            {product.stock > 0 ? 'ADD TO CART' : 'OUT OF STOCK'}
          </button>
        </div>
      </div>

      <LoginDialog
        header="Login Required"
        text="Please log in to manage your shopping cart."
        isOpen={isLoginDialogOpen}
        onClose={() => setIsLoginDialogOpen(false)}
      />
    </div>
  );
};