"use client";

import Link from "next/link";
import Image from "next/image";
import {  useShop } from "@/components/shop-context";
import { useSession } from "@/hooks/use-session";
import { LoginDialog } from "@/components/LoginModal";
import { useToast } from "@/components/toast/use-toast";
import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { saveProduct, unsaveProduct } from "@/app/actions/saver"; // add unsave!

type Products = {
  name: string;
  id: string;
  price: number;
  stock: number;
  image: string;
};

export const ProductCard = ({ item }: { item: Products }) => {
  const { addToCart, updateQuantity, cart, removeFromCart } = useShop();
  const { session } = useSession();
  const { showToast } = useToast();
  const [saving, setSaving] = useState(false);
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);
  const [justSaved, setJustsaved] = useState(false)
  const router = useRouter();

  // Derive everything from latest cart & session → no stale state!
  const cartItem = cart?.find((c) => c.productId === item.id);
  const isInCart = !!cartItem;
  const quantity = cartItem?.quantity || 0;
  const cartItemId = cartItem?.id || "";

  const [isSaved, setIsSaved] = useState(session?.savedProducts.some((p) => p.id === item.id) ?? false);

  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(item.price);

  // Keep everything in sync when cart or session changes
  useEffect(() => {
    // optional: close login dialog if user logs in
    if (session) setIsLoginDialogOpen(false);
  }, [session]);

  const handleAddToCart = async () => {
    if (!session) {
      setIsLoginDialogOpen(true);
      return;
    }

    const res = await addToCart(item.id, 1, session.id);
    if (res?.error) {
      showToast(res.error.toUpperCase(), "error");
    } else {
      showToast("Item added to cart!", "success");
    }
  };

  const handleSaveToggle = async () => {
    if (!session) {
      setIsLoginDialogOpen(true);
      return;
    }

    setSaving(true);
    try {
      let success;
      if (isSaved) {
        success = await unsaveProduct(session.id, item.id);
        if (success) {
          showToast("Removed from saved", "success");
          setIsSaved(false)
        }
      } else {
        success = await saveProduct(session.id, item.id);
        if (success) {
          showToast("Saved for later!", "success");
          setIsSaved(true)
        }
      }
      if (!success) {
        showToast("Something went wrong", "error");
      }
    } catch (err) {
      showToast("Failed to update saved items", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      onClick={() => router.push(`/shop/product/${item.id}`)}
    className="group relative w-full bg-black-secondary border border-white/10 duration-500 pb-5 hover:border-gold-primary/50">
      {/* Image Container with Digital Issue Border Effect */}
      <div className="relative aspect-[3/4]  p-2 transition-all group-hover:-translate-y-1">
        <div className="relative w-full h-full overflow-hidden bg-[#050505]">
          {item.image ? (
            <Image
              src={item.image}
              alt={item.name}
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-110 opacity-90 group-hover:opacity-100"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-neutral-900 text-white/10 text-4xl font-bold">M</div>
          )}

          {/* Quick Actions Overlay (Appears on Hover) */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
            {/* Save Button */}
            <button
              onClick={(e) => { e.preventDefault(); handleSaveToggle(); }}
              className={`w-10 h-10 flex items-center justify-center transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 ${isSaved ? "bg-gold-primary text-black" : "bg-white text-black hover:bg-gold-primary"}`}
              title={isSaved ? "Remove from Saved" : "Save for Later"}
            >
              <Heart className={`w-5 h-5 ${isSaved ? "fill-black" : ""}`} />
            </button>
          </div>

          {/* Status Badge */}
          {quantity > 0 && (
            <div className="absolute top-2 left-2 bg-gold-primary text-black text-[10px] font-bold px-2 py-1 uppercase tracking-widest">
              In Cart ({quantity})
            </div>
          )}
        </div>
      </div>

      {/* Product Info */}
      <div className="mt-4 text-center space-y-2">
        <Link href={``} className="block">
          <h3 className="text-lg font-bold text-white tracking-wide transition-colors line-clamp-1">
            {item.name}
          </h3>
        </Link>
        {/* <p className="text-gold-primary font-mono text-sm tracking-mid">{formattedPrice}</p> */}

        {/* Add to Cart / Controls */}
        {/* <div className="pt-2">
          {isInCart ? (
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => quantity <= 1 ? removeFromCart(cartItemId) : updateQuantity(cartItemId, quantity - 1)}
                className="w-8 h-8 flex items-center justify-center border border-white/20 text-white hover:border-gold-primary hover:text-gold-primary transition-colors text-lg"
              >
                -
              </button>
              <span className="text-sm font-bold text-white w-4">{quantity}</span>
              <button
                onClick={() => updateQuantity(cartItemId, quantity + 1)}
                className="w-8 h-8 flex items-center justify-center border border-white/20 text-white hover:border-gold-primary hover:text-gold-primary transition-colors text-lg"
              >
                +
              </button>
            </div>
          ) : (
            <button
              onClick={handleAddToCart}
              className="w-full py-2 border border-white/20 text-white text-xs font-bold uppercase tracking-widest hover:bg-gold-primary hover:text-black hover:border-gold-primary transition-all duration-300"
            >
              Add to Cart
            </button>
          )}
        </div> */}
      </div>

      <LoginDialog
        header="Almost There!"
        text="Please log in to add items to cart or save products"
        isOpen={isLoginDialogOpen}
        onClose={() => setIsLoginDialogOpen(false)}
      />
    </div>
  );
};