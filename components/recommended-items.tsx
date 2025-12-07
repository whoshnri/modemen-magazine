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
      className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${columns} gap-8`}
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
          <div className="h-78 overflow-hidden bg-black-secondary">
            <img
              src={item.image || "/placeholder.svg"}
              alt={item.name}
              className="w-full h-full object-cover transition-transform duration-500"
              style={{
                transform: hoveredId === item.id ? "scale(1.08)" : "scale(1)",
              }}
            />
          </div>
          <div className="p-6">
            {item.categories && (
              <p className="text-xs font-bold tracking-widest text-gold-primary mb-2 uppercase">
                {item.categories.map((cat) => cat.name).join(", ")}
              </p>
            )}
            <h3 className="text-lg font-bold tracking-wide mb-2">
              {item.name}
            </h3>
           
            <div className="flex items-center justify-between pt-4 border-t border-border">
              <span className="text-lg font-bold text-gold-primary">
                ${item.price.toFixed(2)}
              </span>
            </div>
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
