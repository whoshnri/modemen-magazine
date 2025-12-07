import { getAllCategories } from "@/app/actions/cms/products";
import { ProductForm } from "../components/product-form";

export default async function NewProductPage() {
    const categories = await getAllCategories();

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-widest mb-2">CREATE NEW PRODUCT</h2>
                <p className="text-muted-foreground text-xs uppercase tracking-widest">Add a new item to the store.</p>
            </div>

            <ProductForm categories={categories} />
        </div>
    );
}
