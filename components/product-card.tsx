"use client";

import Link from "next/link";
import Image from "next/image";
import { useShop } from "@/components/shop-context";
import { useSession } from "@/hooks/use-session";
import { LoginDialog } from "@/components/LoginModal";
import { useToast } from "@/components/toast/use-toast";
import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { saveProduct, unsaveProduct } from "@/app/actions/saver";

type Products = {
  name: string;
  id: string;
  price: number;
  stock: number;
  image: string;
  designer: string | null;
  size: string | null;
  color: string | null;
  itemType: string | null;
};

export const ProductCard = ({ item }: { item: Products }) => {
  const { addToCart, cart } = useShop();
  const { session } = useSession();
  const { showToast } = useToast();
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);
  const router = useRouter();

  const cartItem = cart?.find((c) => c.productId === item.id);
  const quantity = cartItem?.quantity || 0;

  const [isSaved, setIsSaved] = useState(session?.savedProducts.some((p) => p.id === item.id) ?? false);

  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(item.price);

  useEffect(() => {
    if (session) setIsLoginDialogOpen(false);
  }, [session]);

  const handleSaveToggle = async () => {
    if (!session) {
      setIsLoginDialogOpen(true);
      return;
    }

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
    } catch (err) {
      showToast("Failed to update saved items", "error");
    }
  };

  return (
    <div
      onClick={() => router.push(`/shop/product/${item.id}`)}
      className="group relative w-full bg-black-secondary border border-white/10 duration-500 pb-5 hover:border-gold-primary/50 cursor-pointer"
    >
      {/* Image Container with Digital Issue Border Effect */}
      <div className="relative aspect-3/4 p-2 transition-all group-hover:-translate-y-1">
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
            <button
              onClick={(e) => { e.stopPropagation(); handleSaveToggle(); }}
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
      <div className="mt-4 text-center px-4 space-y-1">
        {item.designer && (
          <p className="text-[10px] text-gold-primary uppercase tracking-[0.3em] font-bold opacity-100 mb-1">
            {item.designer}
          </p>
        )}

        <h3 className="text-sm font-bold text-white tracking-wide transition-colors line-clamp-1 group-hover:text-gold-primary">
          {item.name}
        </h3>

        <div className="flex flex-col items-center gap-1 pt-1">
          <p className="text-gold-secondary font-mono text-sm tracking-wider font-bold">
            {formattedPrice}
          </p>

          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 h-4">
            {item.size && (
              <span className="text-[9px] text-white/40 border border-white/10 px-1 uppercase tracking-tighter">
                Size: {item.size}
              </span>
            )}
            {item.color && (
              <span className="text-[9px] text-white/40 border border-white/10 px-1 uppercase tracking-tighter">
                {item.color}
              </span>
            )}
          </div>
        </div>
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