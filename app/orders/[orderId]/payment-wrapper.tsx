"use client";

import { useEffect, useRef, useState } from "react";
import PaystackPop from "@paystack/inline-js"; // Correct import
import { useRouter } from "next/navigation";
import { normaliseOnsuccess } from "@/app/actions/checkoutOps";
import { verifyPayment } from "@/app/actions/paymentOps";

interface PaymentWrapperProps {
  orderId: string;
  email: string;
  amount: number; // in base currency (e.g., ₦500), we'll multiply by 100
  orderStatus: boolean;
}

type Status = "loading" | "paying" | "cancelled" | "error" | "success";

export default function PaymentWrapper({
  orderStatus,
  orderId,
  email,
  amount,
}: PaymentWrapperProps) {
  const [status, setStatus] = useState<Status>(orderStatus ? "success" : "loading");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const router = useRouter();
  const paystackRef = useRef<PaystackPop | null>(null);
  const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_KEY;

  const startPayment = async () => {
    if (!publicKey) {
      setStatus("error");
      setErrorMessage("Payment configuration error. Contact support.");
      return;
    }

    setStatus("loading");

    // Reuse the same Paystack instance (important!)
    if (!paystackRef.current) {
      paystackRef.current = new PaystackPop();
    }

    const paystack = paystackRef.current;
    const ref = `ref_${orderId}_${Date.now()}`

    paystack.newTransaction({
      key: publicKey,
      email,
      amount: amount * 100,
      reference: ref,

      // Success: Payment completed
      onSuccess: async (response) => {
        console.log("Payment successful:", response);
        const res = await verifyPayment(ref)
        if (res?.status === true) {
          if (res.data?.status === "success") {
            setStatus("success")
            const rws = await normaliseOnsuccess(ref, orderId)
            if(rws?.status === true){
              router.push(`/profile`)
            }
          } else if (res.data?.status === "failed") {
            setStatus("error")
          } else if (res.data?.status === "abandoned") {
            setStatus("cancelled")
          }
        }
      },

      // User closed popup (X, Esc, back button, etc.)
      onCancel: async () => {
        console.log("Payment cancelled by user");
        const res = await verifyPayment(ref)
        if (res?.status === true) {
          if (res.data?.status === "success") {
            setStatus("success")
            const rws = await normaliseOnsuccess(ref, orderId)
            if(rws?.status === true){
              router.push(`/profile`)
            }
          } else if (res.data?.status === "failed") {
            setStatus("error")
          } else if (res.data?.status === "abandoned") {
            setStatus("cancelled")
          }
        }
      },

      // Popup fully loaded and visible
      onLoad: () => {
        console.log("Paystack popup loaded");
        setStatus("paying"); // Show "payment in progress" UI
      },

      // Any error (network, invalid key, etc.)
      onError: (error) => {
        console.error("Paystack error:", error);
        setStatus("error");
        setErrorMessage(error.message || "Payment failed. Please try again.");
      },
    });
  };

  // Auto-start payment on mount
  useEffect(() => {
    if(status === "success") return;
    startPayment();
  }, []);

  // Loading: Initializing Paystack
  if (status === "loading") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-6">
        <div className="w-16 h-16 border-4 border-gold-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-muted-foreground tracking-widest animate-pulse text-lg">
          INITIALIZING SECURE PAYMENT...
        </p>
      </div>
    );
  }

  // Paying: Popup is open
  if (status === "paying") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-6 text-center px-4">
        {/* <div className="text-green-500 text-6xl animate-pulse">Lock</div> */}
        <p className="text-lg font-medium text-white tracking-wide">
          Payment Window is Open
        </p>
        <p className="text-sm text-muted-foreground max-w-md">
          Complete your payment in the popup. Do not close this tab until finished.
        </p>
      </div>
    );
  }

  // Cancelled: User closed the popup
  if (status === "cancelled") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-6 text-center px-4">
        {/* <div className="text-orange-500 text-6xl">Cancel</div> */}
        <h2 className="text-2xl font-bold tracking-widest text-white">
          PAYMENT CANCELLED
        </h2>
        <p className="text-muted-foreground max-w-md">
          You closed the payment window. No charges were made.
        </p>
        <button
          onClick={startPayment}
          className="px-10 py-4 bg-gold-primary text-black font-bold tracking-widest cursor-pointer  hover:bg-gold-secondary transition-all uppercase shadow-lg"
        >
          Retry Payment
        </button>
      </div>
    );
  }

  // Error: Something went wrong
  if (status === "error") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-6 text-center px-4">
        {/* <div className="text-red-500 text-6xl">Warning</div> */}
        <h2 className="text-2xl font-bold tracking-widest text-white">
          PAYMENT ERROR
        </h2>
        <p className="text-muted-foreground max-w-md">
          {errorMessage || "We couldn't process your payment. Please try again."}
        </p>
        <button
          onClick={startPayment}
          className="px-10 py-4 bg-gold-primary text-black font-bold tracking-widest rounded-lg hover:bg-gold-secondary transition-all uppercase shadow-lg"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-6 text-center px-4">
      {/* <div className="text-green-500 text-7xl animate-bounce">Checkmark</div> */}
      <h2 className="text-3xl font-bold tracking-widest text-white">
        PAYMENT SUCCESSFUL!
      </h2>
      <p className="text-muted-foreground">
        Redirecting you to your order...
      </p>
    </div>
  );
}