"use client";

import Link from "next/link";
import Image from "next/image";
import { Products, useShop } from "@/components/shop-context";
import { useSession } from "@/hooks/use-session";
import { LoginDialog } from "@/components/LoginModal";
import { useToast } from "@/components/toast/use-toast";
import { useState, useEffect } from "react";
import { Bookmark, SaveIcon } from "lucide-react";
import { saveProduct } from "@/app/actions/saver";
import { error } from "console";


export const ProductCard = ({ item }: { item: Products }) => {
  const { addToCart } = useShop();
  const { session } = useSession();
  const { showToast } = useToast();
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);

  useEffect(() => {
    if (!session) {
      setIsLoginDialogOpen(false);
    }
  }, [session]);

  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(item.price);

  const handleAddToCart = async () => {
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

  const handleSave = async() => {
    if (!session) {
      setIsLoginDialogOpen(true);
      return;
    }else{
      const res = await saveProduct(session.id, item.id);
      if (res == false) {
        showToast(
          "Failed to save item.",
          "error"
        );
      } else {
        showToast(
          "Item saved!",
          "success"
        );
      }
    }
  };

  return (
    <div className="flex flex-col border border-border hover:shadow-lg transition-shadow">
      <Link
        href={`/shop/product/${item.id}`}
        className="block relative overflow-hidden bg-black-secondary aspect-4/4"
      >
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-cover transition-transform duration-500 ease-out"
        />
      </Link>

      <div className="mt-4 text-center">
        <h3 className="text-base font-bold tracking-wide text-foreground">
          {item.name}
        </h3>

        <p className="mt-2 text-gold-primary font-bold tracking-widest">
          {formattedPrice}
        </p>

        <div className="grid grid-cols-2 justify-center">
          <button
            onClick={handleSave}
            className="mt-3 text-black-primary font-bold py-4 px-6 tracking-widest bg-white/60 transition-colors border-r flex items-center justify-center gap-3 text-sm border-black-primary hover:bg-white/80 active:bg-white"
          >
            <Bookmark className="w-4 h-4" /> SAVE
          </button>
          <button
            onClick={handleAddToCart}
            className="mt-3 bg-gold-primary text-black-primary font-bold py-4 px-6 tracking-widest hover:bg-gold-secondary active:bg-gold-primary transition-colors flex items-center justify-center gap-2 text-sm"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="w-4 h-4"
            >
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>{" "}
            ADD TO CART
          </button>
        </div>
      </div>

      {/* Correct – opens only after clicking ADD TO CART */}
      <LoginDialog
        header="Just one more step!"
        text="Please Log In to Add Items to Your Cart"
        isOpen={isLoginDialogOpen}
        onClose={() => setIsLoginDialogOpen(false)}
      />
    </div>
  );
};
