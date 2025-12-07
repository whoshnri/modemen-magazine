import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ProductCard } from "@/components/product-card";
import { ProductDetailsClient } from "@/components/ProductDetailsClient";
import {
  getProductById,
  getRelatedProducts,
} from "@/app/actions/storeOperations";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

// This tells Next.js to generate metadata for the page (good for SEO)
export async function generateMetadata({
  params,
}: {
  params: Promise<{ productId: string }>
}) {
    const { productId } = await params 
    const product = await getProductById(productId);
    return {
    title: `${product.name} | Shop`,
    description: `Details for ${product.name}`,
  };
}

export default async function ProductPage({
  params,
}: {
 params: Promise<{ productId: string }>
}) {
    const { productId } = await params
  const product = await getProductById(productId);
  const relatedProducts = await getRelatedProducts(
    product.id,
    product.categories[0]?.id
  );

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
