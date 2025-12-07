// cart/checkout/[cartId]/page.tsx

import { getCart } from "@/app/actions/storeOperations";
import CheckoutClient from "@/components/checkout-client";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ cartId: string }>
}) {
  const { cartId } = await params;
  const cart = await getCart();

  if (!cart) {
    return (
      <div className="min-h-screen bg-black-primary flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold tracking-widest mb-4">CART NOT FOUND</h2>
          <p className="text-muted-foreground">Your cart appears to be empty</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black-primary flex flex-col">
      <Header />
      <main className="flex-1">
        <CheckoutClient />
      </main>
      <Footer />
    </div>
  );
}