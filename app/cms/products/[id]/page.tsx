import { getProductById, getAllCategories } from "@/app/actions/cms/products";
import { ProductForm } from "../components/product-form";
import { notFound } from "next/navigation";

interface props {
    params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: props ) {
    const parameters = await params
    const [product, categories] = await Promise.all([
        getProductById(parameters.id),
        getAllCategories()
    ]);

    if (!product) {
        notFound();
    }

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-widest mb-2">EDIT PRODUCT</h2>
                <p className="text-muted-foreground text-xs uppercase tracking-widest">Update store inventory.</p>
            </div>

            <ProductForm product={product} categories={categories} />
        </div>
    );
}
