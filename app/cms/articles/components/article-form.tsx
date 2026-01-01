'use client';

import { createArticle, updateArticle, ArticleData } from "@/app/actions/cms/articles";
// import { Article, Tag } from "@/lib/generated/prisma/client";
import { Article } from "@/lib/generated/prisma/client";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useToast } from "@/components/toast/use-toast";
import { RichTextEditor } from "./rich-text-editor";
import { ImageUploader } from "@/components/image-uploader";

// Local Enum definitions to avoid build errors
const Category = {
    STYLE: "STYLE",
    CULTURE: "CULTURE",
    BUSINESS_AND_MONEY: "BUSINESS_AND_MONEY",
} as const;

const Subcategory = {
    FASHION: "FASHION",
    WATCHES_AND_ACCESSORIES: "WATCHES_AND_ACCESSORIES",
    GROOMING_AND_WELLNESS: "GROOMING_AND_WELLNESS",
    ENTERTAINMENT: "ENTERTAINMENT",
    PEOPLE_AND_PROFILES: "PEOPLE_AND_PROFILES",
    LEADERSHIP_AND_ENTREPRENEURSHIP: "LEADERSHIP_AND_ENTREPRENEURSHIP",
    WEALTH: "WEALTH",
    WORK_AND_CAREERS: "WORK_AND_CAREERS",
} as const;

type CategoryType = typeof Category[keyof typeof Category];
type SubcategoryType = typeof Subcategory[keyof typeof Subcategory];

export function ArticleForm({ article }: { article?: Article & { category: string, subcategory: string } }) {
    const router = useRouter();
    const { showToast } = useToast();
    const [isPending, startTransition] = useTransition();

    const [formData, setFormData] = useState<ArticleData>({
        title: article?.title || "",
        slug: article?.slug || "",
        writtenBy: article?.writtenBy || "Editor",
        body: article?.body || "",
        bannerImage: article?.bannerImage || "",
        featured: article?.featured || false,
        category: (article?.category as CategoryType) || "STYLE",
        subcategory: (article?.subcategory as SubcategoryType) || "FASHION",
        description: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        if (name === 'featured') {
            setFormData(prev => ({ ...prev, featured: checked }));
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        startTransition(async () => {
            let result;
            if (article) {
                result = await updateArticle(article.id, formData);
            } else {
                result = await createArticle(formData);
            }

            if (result.error) {
                showToast(result.error, 'error');
            } else {
                showToast(`Article ${article ? 'updated' : 'created'} successfully`, 'success');
                router.push('/cms/articles');
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
                    <label className={labelClasses}>Title</label>
                    <input name="title" value={formData.title} onChange={handleChange} className={inputClasses} required />
                </div>
                <div>
                    <label className={labelClasses}>Slug</label>
                    <input name="slug" value={formData.slug} onChange={handleChange} className={inputClasses} required />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className={labelClasses}>Author</label>
                    <input name="writtenBy" value={formData.writtenBy} onChange={handleChange} className={inputClasses} required />
                </div>
                <div>
                    <label className={labelClasses}>Banner Image URL</label>
                    <div className="space-y-3">
                        {formData.bannerImage && (
                            <div className="relative w-full h-40 bg-gray-900 rounded-lg overflow-hidden border border-white/10">
                                <img src={formData.bannerImage} alt="Banner Preview" className="w-full h-full object-cover" />
                                <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, bannerImage: "" }))}
                                    className="absolute top-2 right-2 bg-black/50 hover:bg-red-500/80 text-white p-1 rounded-full transition-colors"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                                </button>
                            </div>
                        )}
                        <div className="flex gap-2">
                            <input
                                name="bannerImage"
                                value={formData.bannerImage}
                                onChange={handleChange}
                                className={inputClasses}
                                placeholder="/uploads/..."
                            />
                            <ImageUploader
                                onUploadComplete={(url) => setFormData(prev => ({ ...prev, bannerImage: url }))}
                                directory="articles"
                                trigger={
                                    <button type="button" className="px-4 bg-white/10 border border-white/10 hover:bg-white/20 transition-colors h-full flex items-center justify-center rounded-sm">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gold-primary"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" x2="12" y1="3" y2="15" /></svg>
                                    </button>
                                }
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className={labelClasses}>Category</label>
                    <div className="relative">
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className={`${inputClasses} appearance-none cursor-pointer uppercase`}
                        >
                            {Object.values(Category).map((cat) => (
                                <option key={cat} value={cat} className="bg-black text-white p-2">
                                    {cat.replace(/_/g, " ")}
                                </option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-white/50">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                        </div>
                    </div>
                </div>
                <div>
                    <label className={labelClasses}>Subcategory</label>
                    <div className="relative">
                        <select
                            name="subcategory"
                            value={formData.subcategory}
                            onChange={handleChange}
                            className={`${inputClasses} appearance-none cursor-pointer uppercase`}
                        >
                            {Object.values(Subcategory).map((sub) => (
                                <option key={sub} value={sub} className="bg-black text-white p-2">
                                    {sub.replace(/_/g, " ")}
                                </option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-white/50">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <label className={labelClasses}>Body Content (Rich Text)</label>
                <RichTextEditor
                    content={formData.body}
                    onChange={(html) => setFormData(prev => ({ ...prev, body: html }))}
                />
            </div>

            <div className="flex items-center gap-3">
                <input
                    type="checkbox"
                    name="featured"
                    id="featured"
                    checked={formData.featured}
                    onChange={handleCheckboxChange}
                    className="w-4 h-4 accent-gold-primary bg-transparent border-white/10"
                />
                <label htmlFor="featured" className={labelClasses + " mb-0 cursor-pointer"}>Mark as Featured</label>
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
                    {isPending ? 'Saving...' : (article ? 'Update Article' : 'Create Article')}
                </button>
            </div>
        </form>
    );
}
