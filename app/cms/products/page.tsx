import { getProducts } from "@/app/actions/cms/products";
import Link from "next/link";
import { DeleteProductButton } from "./components/delete-button";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function ProductsPage({
    searchParams,
}: {
    searchParams?: { page?: string, search?: string };
}) {
    const { page: pageParam, search: searchParam } = await searchParams || {};
    const page = Number(pageParam) || 1;
    const search = searchParam || "";
    const { products, total, pages } = await getProducts(page, search);

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl sm:text-3xl font-bold tracking-widest mb-2">PRODUCTS</h2>
                    <p className="text-muted-foreground text-xs uppercase tracking-widest">
                        {total} Total Products
                    </p>
                </div>
                <Link
                    href="/cms/products/new"
                    className="px-6 py-3 bg-gold-primary text-black font-bold text-xs uppercase tracking-widest hover:bg-white transition-colors text-center"
                >
                    Create New
                </Link>
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block border border-white/10 bg-[#0a0a0a] overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="border-b border-white/10 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                        <tr>
                            <th className="p-4">Product</th>
                            <th className="p-4">Price</th>
                            <th className="p-4">Stock</th>
                            <th className="p-4">Categories</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {products.map((product) => (
                            <tr key={product.id} className="group hover:bg-white/5 transition-colors">
                                <td className="p-4 flex items-center gap-4">
                                    <div className="w-12 h-12 relative bg-white/5">
                                        {product.image && <Image src={product.image} alt={product.name} fill className="object-cover" />}
                                    </div>
                                    <div>
                                        <div className="font-bold text-sm text-white mb-1 group-hover:text-gold-primary transition-colors">
                                            {product.name}
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4 text-xs font-mono text-muted-foreground">
                                    ${product.price.toFixed(2)}
                                </td>
                                <td className="p-4 text-xs font-mono text-muted-foreground">
                                    {product.stock > 0 ? (
                                        <span className="text-green-500">{product.stock} In Stock</span>
                                    ) : (
                                        <span className="text-red-500">Out of Stock</span>
                                    )}
                                </td>
                                <td className="p-4">
                                    <div className="flex flex-wrap gap-1">
                                        {product.categories.map(cat => (
                                            <span key={cat.id} className="px-2 py-0.5 bg-white/5 text-[10px] uppercase font-bold text-muted-foreground border border-white/5">
                                                {cat.name}
                                            </span>
                                        ))}
                                    </div>
                                </td>
                                <td className="p-4 text-right space-x-4 
                                ">
                                    <Link
                                        href={`/cms/products/${product.id}`}
                                        className="text-xs font-bold uppercase tracking-widest text-white hover:text-gold-primary transition-colors"
                                    >
                                        Edit
                                    </Link>
                                    <DeleteProductButton id={product.id} />
                                </td>
                            </tr>
                        ))}
                        {products.length === 0 && (
                            <tr>
                                <td colSpan={5} className="p-12 text-center text-muted-foreground text-xs uppercase tracking-widest">
                                    No products found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-4">
                {products.map((product) => (
                    <div key={product.id} className="border border-white/10 bg-[#0a0a0a] p-4 space-y-3">
                        <div className="flex items-start gap-3">
                            <div className="w-16 h-16 relative bg-white/5 shrink-0">
                                {product.image && <Image src={product.image} alt={product.name} fill className="object-cover" />}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-sm text-white mb-1">
                                    {product.name}
                                </h3>
                                <p className="text-xs font-mono text-muted-foreground">
                                    ${product.price.toFixed(2)}
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <div className="text-xs font-mono">
                                {product.stock > 0 ? (
                                    <span className="text-green-500">{product.stock} In Stock</span>
                                ) : (
                                    <span className="text-red-500">Out of Stock</span>
                                )}
                            </div>
                        </div>

                        {product.categories.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                                {product.categories.map(cat => (
                                    <span key={cat.id} className="px-2 py-0.5 bg-white/5 text-[10px] uppercase font-bold text-muted-foreground border border-white/5">
                                        {cat.name}
                                    </span>
                                ))}
                            </div>
                        )}

                        <div className="flex gap-3 pt-2 border-t border-white/5">
                            <Link
                                href={`/cms/products/${product.id}`}
                                className="text-xs font-bold uppercase tracking-widest text-white hover:text-gold-primary transition-colors"
                            >
                                Edit
                            </Link>
                            <DeleteProductButton id={product.id} />
                        </div>
                    </div>
                ))}
                {products.length === 0 && (
                    <div className="border border-dashed border-white/10 p-12 text-center text-muted-foreground text-xs uppercase tracking-widest">
                        No products found.
                    </div>
                )}
            </div>

            {/* Basic Pagination */}
            <div className="flex justify-center items-center gap-4 pb-8">
                <Link
                    href={`/cms/products?page=${Math.max(1, page - 1)}`}
                    className={`flex items-center gap-2 px-4 py-2 border border-white/10 text-xs font-bold uppercase tracking-widest transition-colors ${page <= 1 ? 'pointer-events-none opacity-50' : 'hover:border-gold-primary hover:text-gold-primary'}`}
                >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                </Link>
                <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                    Page {page} of {pages}
                </div>
                <Link
                    href={`/cms/products?page=${Math.min(pages, page + 1)}`}
                    className={`flex items-center gap-2 px-4 py-2 border border-white/10 text-xs font-bold uppercase tracking-widest transition-colors ${page >= pages ? 'pointer-events-none opacity-50' : 'hover:border-gold-primary hover:text-gold-primary'}`}
                >
                    Next
                    <ChevronRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    );
}
