'use client';

import { createArticle, updateArticle, ArticleData } from "@/app/actions/cms/articles";
import { Article, Tag } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useToast } from "@/components/toast/use-toast";
import { RichTextEditor } from "./rich-text-editor";

const ALL_TAGS: Tag[] = [
    "STYLE", "GROOMING", "CULTURE", "BUSINESS_MONEY", "LIFE", "TECH_INNOVATION"
];

export function ArticleForm({ article }: { article?: Article & { tags: { name: Tag }[] } }) {
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
        tags: article?.tags.map(t => t.name) || [],
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

    const toggleTag = (tag: Tag) => {
        setFormData(prev => {
            const tags = prev.tags.includes(tag)
                ? prev.tags.filter(t => t !== tag)
                : [...prev.tags, tag];
            return { ...prev, tags };
        });
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
                    <input name="bannerImage" value={formData.bannerImage} onChange={handleChange} className={inputClasses} placeholder="/uploads/..." />
                </div>
            </div>

            <div>
                <label className={labelClasses}>Body Content (Rich Text)</label>
                <RichTextEditor
                    content={formData.body}
                    onChange={(html) => setFormData(prev => ({ ...prev, body: html }))}
                />
            </div>

            <div>
                <label className={labelClasses}>Tags</label>
                <div className="flex flex-wrap gap-2 mt-2">
                    {ALL_TAGS.map(tag => (
                        <button
                            key={tag}
                            type="button"
                            onClick={() => toggleTag(tag)}
                            className={`px-3 py-1 border text-[10px] font-bold uppercase tracking-widest transition-all ${formData.tags.includes(tag)
                                ? 'bg-gold-primary text-black border-gold-primary'
                                : 'bg-transparent text-muted-foreground border-white/10 hover:border-white'
                                }`}
                        >
                            {tag}
                        </button>
                    ))}
                </div>
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
