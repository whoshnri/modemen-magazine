'use client';

import { createProduct, updateProduct, ProductData } from "@/app/actions/cms/products";
import { Product, Category } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useToast } from "@/components/toast/use-toast";

export function ProductForm({
    product,
    categories
}: {
    product?: Product & { categories: Category[] },
    categories: Category[]
}) {
    const router = useRouter();
    const { showToast } = useToast();
    const [isPending, startTransition] = useTransition();

    const [formData, setFormData] = useState<ProductData>({
        name: product?.name || "",
        price: product?.price || 0,
        desc: product?.desc || "",
        stock: product?.stock || 0,
        image: product?.image || "",
        categoryIds: product?.categories.map(c => c.id) || [],
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const toggleCategory = (catId: string) => {
        setFormData(prev => {
            const ids = prev.categoryIds.includes(catId)
                ? prev.categoryIds.filter(id => id !== catId)
                : [...prev.categoryIds, catId];
            return { ...prev, categoryIds: ids };
        });
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        startTransition(async () => {
            let result;
            if (product) {
                result = await updateProduct(product.id, formData);
            } else {
                result = await createProduct(formData);
            }

            if (result.error) {
                showToast(result.error, 'error');
            } else {
                showToast(`Product ${product ? 'updated' : 'created'} successfully`, 'success');
                router.push('/cms/products');
                router.refresh();
            }
        });
    };

    const inputClasses = "w-full bg-[#0a0a0a] border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-gold-primary transition-colors placeholder:text-muted-foreground";
    const labelClasses = "block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2";

    return (
        <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className={labelClasses}>Product Name</label>
                    <input name="name" value={formData.name} onChange={handleChange} className={inputClasses} required />
                </div>
                <div>
                    <label className={labelClasses}>Price ($)</label>
                    <input type="number" step="0.01" name="price" value={formData.price} onChange={handleChange} className={inputClasses} required />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className={labelClasses}>Stock Quantity</label>
                    <input type="number" name="stock" value={formData.stock} onChange={handleChange} className={inputClasses} required />
                </div>
                <div>
                    <label className={labelClasses}>Image URL</label>
                    <input name="image" value={formData.image} onChange={handleChange} className={inputClasses} placeholder="/uploads/..." required />
                </div>
            </div>

            <div>
                <label className={labelClasses}>Description</label>
                <textarea
                    name="desc"
                    value={formData.desc || ""}
                    onChange={handleChange}
                    className={`${inputClasses} min-h-[200px]`}
                />
            </div>

            <div>
                <label className={labelClasses}>Categories</label>
                <div className="flex flex-wrap gap-2 mt-2">
                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            type="button"
                            onClick={() => toggleCategory(cat.id)}
                            className={`px-3 py-1 border text-[10px] font-bold uppercase tracking-widest transition-all ${formData.categoryIds.includes(cat.id)
                                    ? 'bg-gold-primary text-black border-gold-primary'
                                    : 'bg-transparent text-muted-foreground border-white/10 hover:border-white'
                                }`}
                        >
                            {cat.name}
                        </button>
                    ))}
                    {categories.length === 0 && (
                        <p className="text-xs text-muted-foreground">No categories found. Please create categories first.</p>
                    )}
                </div>
            </div>

            <div className="pt-4 border-t border-white/10 flex justify-end gap-4">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="px-6 py-3 border border-white/10 text-xs font-bold uppercase tracking-widest hover:bg-white/5 transition-colors"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={isPending}
                    className="px-8 py-3 bg-gold-primary text-black font-bold text-xs uppercase tracking-widest hover:bg-white transition-colors disabled:opacity-50"
                >
                    {isPending ? 'Saving...' : (product ? 'Update Product' : 'Create Product')}
                </button>
            </div>
        </form>
    );
}
