"use client";

import Link from "next/link";
import Image from "next/image";
import { Products, useShop } from "@/components/shop-context";
import { useSession } from "@/hooks/use-session";
import { LoginDialog } from "@/components/LoginModal";
import { useToast } from "@/components/toast/use-toast";
import { useState, useEffect } from "react";


interface RecommendedItemsProps {
  items: Products[];
  columns?: number;
}

export function RecommendedItems({
  items,
  columns = 3,
}: RecommendedItemsProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const { session } = useSession();
  const { addToCart } = useShop();
  const { showToast } = useToast();
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);

  const handleAddToCart = async (item: Products) => {
    if (!session) {
      setIsLoginDialogOpen(true);
      return;
    }
    const res = await addToCart(item.id, 1, session.id);
    if (!res?.message && res?.error) {
      showToast(
        res.error.toUpperCase() || "Failed to add iatem to cart.",
        "error"
      );
    } else {
      showToast(
        res?.message?.toUpperCase() || "Item added to cart!",
        "success"
      );
    }
  };

  return (
    <div
      className={`grid grid-cols-2 lg:grid-cols-${columns} gap-3`}
    >
      {items.map((item) => (
        <Link
          href={`/shop/product/${item.id}`}
          key={item.id}
          className="border border-border transition-all duration-300"
          onMouseEnter={() => setHoveredId(item.id)}
          onMouseLeave={() => setHoveredId(null)}
          style={{
            borderColor: hoveredId === item.id ? "#d4af37" : "#2a2a2a",
          }}
        >
          <div className="overflow-hidden bg-black-secondary">
            <img
              src={item.image || "/placeholder.svg"}
              alt={item.name}
              className="w-full h-full object-cover aspect-square transition-transform duration-500"
              style={{
                transform: hoveredId === item.id ? "scale(1.08)" : "scale(1)",
              }}
            />
          </div>
          <div className="p-6 text-center">
            {item.designer && (
              <p className="text-[10px] text-gold-primary uppercase tracking-[0.2em] font-medium opacity-80 mb-1">
                {item.designer}
              </p>
            )}
            <h3 className="text-sm font-bold tracking-wide mb-2 line-clamp-1">
              {item.name}
            </h3>
            <p className="text-gold-secondary font-mono text-sm tracking-widest font-bold">
              ${item.price.toFixed(2)}
            </p>
          </div>
        </Link>
      ))}
      <LoginDialog
        header="Just one more step!"
        text="Please Log In to Add Items to Your Cart"
        isOpen={isLoginDialogOpen}
        onClose={() => setIsLoginDialogOpen(false)}
      />
    </div>
  );
}
