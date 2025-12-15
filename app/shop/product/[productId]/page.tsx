import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ProductCard } from "@/components/product-card";
import { ProductDetailsClient } from "@/components/ProductDetailsClient";
import {
  getProductById,
  getRelatedProducts,
} from "@/app/actions/storeOperations";
import Link from "next/link";
import { ArrowLeft, ShoppingBag } from "lucide-react";

// This tells Next.js to generate metadata for the page (good for SEO)
export async function generateMetadata({
  params,
}: {
  params: Promise<{ productId: string }>
}) {
  const { productId } = await params

  try {
    const product = await getProductById(productId);
    if (!product) {
      return {
        title: 'Product Not Found | Shop',
        description: 'The requested product could not be found.',
      }
    }
    return {
      title: `${product.name} | Shop`,
      description: `Details for ${product.name}`,
    };
  } catch (e) {
    return {
      title: 'Product Not Found | Shop',
      description: 'The requested product could not be found.',
    }
  }
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ productId: string }>
}) {
  const { productId } = await params

  let product = null;
  let relatedProducts: any[] = [];
  let error = false;

  try {
    product = await getProductById(productId);
    if (product) {
      relatedProducts = await getRelatedProducts(
        product.id,
        product.categories[0]?.id
      );
    } else {
      error = true;
    }
  } catch (e) {
    error = true;
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-black-primary flex flex-col">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <div className="bg-black-secondary border border-border p-12 max-w-lg w-full flex flex-col items-center">
            <div className="w-16 h-16 bg-gold-primary/10 rounded-full flex items-center justify-center mb-6">
              <ShoppingBag className="w-8 h-8 text-gold-primary" />
            </div>
            <h1 className="text-3xl font-serif text-white mb-4">Product Not Found</h1>
            <p className="text-muted-foreground mb-8">
              It seems the product you are looking for is unavailable or the link is invalid. However, we have plenty more to explore.
            </p>
            <Link
              href="/shop"
              className="px-8 py-3 bg-gold-primary text-black-primary font-bold tracking-widest uppercase hover:bg-white transition-colors"
            >
              Return to Shop
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black-primary flex flex-col">
      <Header />
      <main className="flex-1">

        {/* The interactive product details section */}
        <ProductDetailsClient product={product} />

        {/* "You Might Also Like" Section */}
        {relatedProducts.length > 0 && (
          <section className="bg-[#0f0f0f] border-t border-border py-12">
            <div className="max-w-6xl mx-auto px-6">
              <h2 className="text-3xl font-bold tracking-widest text-center mb-12">
                YOU MIGHT ALSO LIKE
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {relatedProducts.map((item) => (
                  <ProductCard key={item.id} item={item} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
