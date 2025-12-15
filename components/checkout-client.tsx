"use client";

import { useState, useEffect } from "react";
import { useShop } from "@/components/shop-context";
import { useSession } from "@/hooks/use-session";
import { getCouponDetails, initiateOrder } from "@/app/actions/storeOperations";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader2, MapPin, CreditCard, Tag } from "lucide-react";
import Spinner from "./spinner";
import { AddAddressModal } from "./Addaddress";
import { getAddresses } from "@/app/actions/profileOps";
import { Address } from "@/lib/generated/prisma/client";
import Link from "next/link";
export default function CheckoutClient() {
  const { cart, cartTotal } = useShop();
  const { session } = useSession();
  const router = useRouter();

  const [shippingAddress, setShippingAddress] = useState<Address[] | null>(
    null
  );
  const [couponId, setCouponId] = useState<string | null>(null)
  const [couponCode, setCouponCode] = useState("");
  const [discountedTotal, setDiscountedTotal] = useState<number | null>(null);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedShippingAddress, setSelectedShippingAddress] = useState<Address | null>(null);
  // Calculate totals
  const subtotal = cartTotal || 0;
  const tax = subtotal * 0.02; // 2% tax
  const originalTotal = subtotal + tax;
  const finalTotal = discountedTotal !== null ? discountedTotal : originalTotal;
  const discountAmount = originalTotal - finalTotal;

  // Fetch shipping address
  useEffect(() => {
    const fetchShippingAddress = async () => {
      if (!session?.id) return;

      try {
        const response = await getAddresses(session.id);
        if (response.success) {
          setShippingAddress((response.data as unknown as Address[]) || null);
        }
      } catch (error) {
        console.error("Failed to fetch shipping address:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchShippingAddress();
  }, [session?.id]);

  const handleCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error("Please enter a coupon code");
      return;
    }

    setIsApplyingCoupon(true);
    try {
      const result = await getCouponDetails(couponCode);
      if (result.success && result.coupon) {
        let coupon = result.coupon;
        if (coupon.discountType === "PERCENTAGE") {
          const newTotal = originalTotal - (originalTotal * coupon.value / 100);
          setDiscountedTotal(newTotal);
          setAppliedCoupon(couponCode);
          toast.success("Coupon applied successfully!");
          setCouponCode("");
        } else {
          const newTotal = originalTotal - coupon.value;
          setDiscountedTotal(newTotal);
          setAppliedCoupon(couponCode);
          toast.success("Coupon applied successfully!");
          setCouponCode("");
        }
        setCouponId(coupon.id)
      } else {
        toast.error(result.error || "Invalid coupon code");
      }
    } catch (error) {
      toast.error("Failed to apply coupon");
    } finally {
      setIsApplyingCoupon(false);
    }
  }

  const handleProceedToCheckout = async () => {
    if (!session) {
      toast.error("Please log in to proceed");
      router.push("/login?redirect=/cart/checkout");
      return;
    }

    if (!shippingAddress) {
      toast.error("Please set a shipping address");
      router.push("/account/addresses");
      return;
    }

    setIsProcessing(true);
    try {
      const result = await initiateOrder(selectedShippingAddress?.id!, finalTotal, couponId);

      if (result.success && result.order) {
        toast.success("Order created successfully!");
        router.push(`/orders/${result.order.id}`);
      } else {
        toast.error(result.error || "Failed to create order");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading || !cart) {
    return (
      <div className="min-h-screen bg-black-primary flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-black-primary flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold tracking-widest mb-4">
            PLEASE LOG IN
          </h2>
          <p className="text-muted-foreground mb-6">
            You need to be logged in to checkout
          </p>
          <button
            onClick={() => router.push("/login")}
            className="px-8 py-4 bg-gold-primary text-black-primary font-bold tracking-widest hover:bg-gold-secondary transition-colors"
          >
            LOG IN
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black-primary">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold tracking-widest mb-12 text-center">
          CHECKOUT
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - Order Details */}
          <div className="space-y-8">
            {/* Order Summary */}
            <div className="border border-border p-8">
              <h2 className="text-xl font-bold tracking-widest mb-6 flex items-center gap-2">
                {/* <Tag className="w-5 h-5" /> */}
                ORDER SUMMARY
              </h2>

              <div className="space-y-4 p-4 border border-border">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 py-4 border-b border-border last:border-b-0"
                  >
                    <div className="w-16 h-16 bg-black-secondary border border-border overflow-hidden shrink-0">
                      <img
                        src={item.product.image || "/placeholder.svg"}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold tracking-wide text-base">
                        {item.product.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <div className="text-gold-primary font-bold">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Address */}
            <div className="border border-border p-8">
              <h2 className="text-xl font-bold tracking-widest mb-6 flex items-center gap-2">
                {/* <MapPin className="w-5 h-5" /> */}
                DELIVERY ADDRESS
              </h2>

              {shippingAddress ? (
                <div className="space-y-4 border border-border p-4">
                  {
                    shippingAddress.map((addr) => (
                      // radio buttons to select the shipping address
                      <div key={addr.id} className="flex items-center gap-2">
                        <input type="radio" name="shippingAddress" id={addr.id} value={addr.id} onChange={() => setSelectedShippingAddress(addr)} className="w-5 h-5" />
                        <label htmlFor={addr.id}>{addr.street} {addr.city}, {addr.state} {addr.zipCode} {addr.country}</label>
                      </div>
                    ))
                  }
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">
                    No shipping address set
                  </p>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-6 py-3 bg-gold-primary text-black-primary font-bold tracking-widest hover:bg-gold-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    ADD ADDRESS
                  </button>
                  <AddAddressModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    userId={session.id}
                    onAddressAdded={(newAddress) =>
                      setShippingAddress((prev) => [
                        ...(prev || []),
                        newAddress,
                      ])
                    }
                  />
                </div>
              )}
              <p className="text-center text-xs mt-10">Add a new address in the <Link href={"/profile"} className="text-gold-primary hover:underline">profile page</Link></p>
            </div>
          </div>

          {/* Right Column - Payment & Totals */}
          <div className="space-y-8">
            {/* Coupon Code */}
            <div className="border border-border p-8">
              <h2 className="text-xl font-bold tracking-widest mb-6">
                COUPON CODE
              </h2>

              <div className="flex gap-3">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="Enter coupon code"
                  className="flex-1 px-4 py-3 bg-black-secondary border border-border focus:border-gold-primary outline-none transition-colors"
                  disabled={isApplyingCoupon}
                />
                <button
                  onClick={handleCoupon}
                  disabled={isApplyingCoupon || !couponCode.trim()}
                  className="px-6 py-3 bg-gold-primary text-black-primary font-bold tracking-widest hover:bg-gold-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isApplyingCoupon ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "APPLY"
                  )}
                </button>
              </div>

              {appliedCoupon && discountAmount > 0 && (
                <p className="text-green-500 text-sm mt-3">
                  Coupon "{appliedCoupon}" applied! You saved $
                  {discountAmount.toFixed(2)}
                </p>
              )}
            </div>

            {/* Order Total */}
            <div className="border border-border p-8">
              <h2 className="text-xl font-bold tracking-widest mb-6">
                ORDER TOTAL
              </h2>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-sm text-green-500">
                    <span>Discount ({appliedCoupon})</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}

                <div className="border-t border-border pt-3 mt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>TOTAL</span>
                    <span className="text-gold-primary">
                      ${finalTotal.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Proceed to Checkout Button */}
            <button
              onClick={handleProceedToCheckout}
              disabled={isProcessing || !selectedShippingAddress}
              className="w-full py-4 bg-gold-primary text-black-primary font-bold tracking-widest hover:bg-gold-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <Spinner />
                  PROCESSING...
                </>
              ) : (
                <>
                  PROCEED TO CHECKOUT
                </>
              )}
            </button>

            {!shippingAddress && (
              <p className="text-sm text-muted-foreground text-center">
                Please add a shipping address to continue
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
