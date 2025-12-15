import { getCategories } from "@/app/actions/cms/categories";
import Link from "next/link";
import { Plus } from "lucide-react";

export default async function CategoriesPage() {
    const { data: categories } = await getCategories();

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between pb-8 border-b border-white/10">
                <h2 className="text-3xl font-bold tracking-widest text-white">CATEGORIES</h2>
                <Link
                    href="/cms/categories/new"
                    className="flex items-center gap-2 bg-gold-primary text-black-primary px-6 py-3 font-bold text-xs uppercase tracking-widest hover:bg-gold-secondary transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    <span>Create New</span>
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories?.map((cat) => (
                    <div key={cat.id} className="bg-[#0a0a0a] border border-white/10 p-6 flex flex-col justify-between group hover:border-gold-primary transition-colors">
                        <div>
                            <h3 className="text-xl font-bold text-white mb-2">{cat.name}</h3>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                                {cat.description || "No description provided."}
                            </p>
                        </div>
                        <div className="mt-6 pt-6 border-t border-white/10 flex justify-between items-center">
                            <span className="text-xs font-bold text-gold-primary uppercase tracking-widest">
                                {cat._count.products} PRODUCTS
                            </span>
                            {/* Simple delete button could go here, for now just list */}
                        </div>
                    </div>
                ))}

                {(!categories || categories.length === 0) && (
                    <div className="col-span-full py-12 text-center text-muted-foreground border border-dashed border-white/10">
                        No categories found. Create one to get started.
                    </div>
                )}
            </div>
        </div>
    );
}
