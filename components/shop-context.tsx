"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  addToCart,
  removeFromCart,
  updateCartItemQuantity,
  getCart,
  fetchShopItemsFromDb,
} from "@/app/actions/storeOperations";
import { Category, Product } from "@prisma/client";
import { getActiveUserFromCookie } from "@/app/actions/auth";

interface ShopContextType {
  cart: CartItemWithProduct[] | null;
  shopItems: Products[] | null;
  isCartOpen: boolean;
  addToCart: (variantId: string, quantity: number, userId: string) => Promise<{ message: string; error?: undefined; } | { error: string; message?: undefined; } | undefined>;
  removeFromCart: (itemId: string) => Promise<void>;
  openCart: () => void;
  closeCart: () => void;
  cartTotal: number | undefined;
  loading: boolean;
  fetchUserId: () => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  itemCount: number | undefined;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

type CartItemWithProduct = {
  product: {
    name: string;
    id: string;
    price: number;
    stock: number;
    image: string;
  };
} & {
  id: string;
  quantity: number;
  cartId: string;
  productId: string;
};

export type Products = {
  categories: {
    name: string;
    id: string;
    description: string | null;
  }[];
} & {
  name: string;
  id: string;
  price: number;
  stock: number;
  image: string;
};

export const ShopProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItemWithProduct[] | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [shopItems, setShopItems] = useState<Products[] | null>(null);

  useEffect(() => {
    fetchShopItems();
    fetchUserId();
  }, []);

  const fetchUserId = async () => {
    const response = await getActiveUserFromCookie();
    setUserId(response?.id || null);
  };

  // FETCH CART BASED ON userId
  useEffect(() => {
    const fetchCart = async () => {
      if (!userId) return;
      const serverCart = await getCart();
      setCart(serverCart?.items || null);
      setLoading(false);
    };
    fetchCart();
  }, [userId]);

  const handleAddToCart = async (
    variantId: string,
    quantity: number,
    userId: string
  ) => {
    if (!userId) return {error : "failed to add to cart" };
    console.log("Adding to cart for user:", userId);
    const result = await addToCart(variantId, quantity, userId);
    if (result.success && result.cart) {
      setCart(result.cart.items);
      setIsCartOpen(true);
      return {message : "added to cart"}
    } else {
      return {error : "failed to add to cart" }
    }
  };

  const fetchShopItems = async () => {
    if (shopItems != null) return;
    const p = await fetchShopItemsFromDb();
    if (p) {
      setShopItems(p.products);
    }
  };

  const handleUpdateQuantity = async (itemId: string, quantity: number) => {
    const result = await updateCartItemQuantity(itemId, quantity);
    if (result.success && result.cart) {
      setCart(result.cart.items);
    } else {
      return
    }
  };

  const handleRemoveFromCart = async (itemId: string) => {
    if (!cart) return;
    const result = await removeFromCart(itemId);
    if (result.success && result.cart) {
      setCart(result.cart.items);
      return;
    }
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const cartTotal = cart?.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );
  const itemCount = cart?.reduce((total, item) => total + item.quantity, 0);

  return (
    <ShopContext.Provider
      value={{
        cart,
        shopItems,
        isCartOpen,
        fetchUserId,
        addToCart: handleAddToCart,
        removeFromCart: handleRemoveFromCart,
        openCart,
        loading,
        closeCart,
        cartTotal,
        updateQuantity: handleUpdateQuantity,
        itemCount,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error("useShop must be used within a ShopProvider");
  }
  return context;
};
