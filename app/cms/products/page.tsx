import { getProducts } from "@/app/actions/cms/products";
import Link from "next/link";
import { DeleteProductButton } from "./components/delete-button";
import Image from "next/image";

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
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-widest mb-2">PRODUCTS</h2>
                    <p className="text-muted-foreground text-xs uppercase tracking-widest">
                        {total} Total Products
                    </p>
                </div>
                <Link
                    href="/cms/products/new"
                    className="px-6 py-3 bg-gold-primary text-black font-bold text-xs uppercase tracking-widest hover:bg-white transition-colors"
                >
                    Create New
                </Link>
            </div>

            {/* Table */}
            <div className="border border-white/10 bg-[#0a0a0a]">
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
                                <td className="p-4 text-right space-x-4">
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

            {/* Basic Pagination */}
            <div className="flex justify-center gap-2">
                {Array.from({ length: pages }).map((_, i) => (
                    <Link
                        key={i}
                        href={`/cms/products?page=${i + 1}`}
                        className={`w-8 h-8 flex items-center justify-center text-xs font-bold border ${page === i + 1 ? 'border-gold-primary text-gold-primary' : 'border-white/10 text-muted-foreground hover:border-white hover:text-white'} transition-colors`}
                    >
                        {i + 1}
                    </Link>
                ))}
            </div>
        </div>
    );
}
