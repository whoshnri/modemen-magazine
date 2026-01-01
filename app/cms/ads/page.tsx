"use client";

import { useState, useEffect } from "react";
import { getAds, createAd, deleteAd } from "@/app/actions/adOps";
import Image from "next/image";
import { Trash2, Plus, Loader2, ExternalLink } from "lucide-react";
import { useToast } from "@/components/toast/use-toast";
import { Tag } from "@/lib/generated/prisma/enums";
import { ImageUploader } from "@/components/image-uploader";

type Ad = {
    id: string;
    title: string;
    image: string;
    link: string;
    active: boolean;
};

export default function AdminAdsPage() {
    const [ads, setAds] = useState<Ad[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const { showToast } = useToast();

    const initialAdState = {
        title: "",
        image: "",
        link: "",
        type: [] as Tag[]
    };

    const [newAd, setNewAd] = useState(initialAdState);

    useEffect(() => {
        loadAds();
    }, []);

    async function loadAds() {
        setLoading(true);
        const data = await getAds();
        setAds(data as Ad[]);
        setLoading(false);
    }

    async function handleCreate() {
        if (!newAd.title || !newAd.image || !newAd.link || !newAd.type.length) {
            showToast("Please fill in all fields", "error");
            return;
        };
        setIsCreating(true);
        const res = await createAd(newAd);
        if (res.success) {
            showToast("Ad created successfully", "success");
            setNewAd(initialAdState);
            loadAds();
        } else {
            showToast("Failed to create ad", "error");
        }
        setIsCreating(false);
    }

    async function handleDelete(id: string) {
        if (!confirm("Are you sure you want to delete this ad?")) return;
        const res = await deleteAd(id);
        if (res.success) {
            showToast("Ad deleted", "success");
            loadAds();
        } else {
            showToast("Failed to delete ad", "error");
        }
    }

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-widest mb-2">ADVERTISEMENTS</h2>
                <p className="text-muted-foreground text-sm">Manage global ad campaigns.</p>
            </div>

            {/* Create Section */}
            <div className="bg-[#0a0a0a] border border-white/10 p-6 space-y-4">
                <h3 className="text-sm font-bold text-gold-primary tracking-widest uppercase">Create New Ad</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                        placeholder="Ad Title"
                        value={newAd.title}
                        onChange={(e) => setNewAd({ ...newAd, title: e.target.value })}
                        className="bg-black/50 border border-white/10 p-3 text-sm text-white focus:border-gold-primary outline-none"
                    />
                    <div className="flex gap-2">
                        <input
                            placeholder="Image URL"
                            value={newAd.image}
                            onChange={(e) => setNewAd({ ...newAd, image: e.target.value })}
                            className="bg-black/50 border border-white/10 p-3 text-sm text-white focus:border-gold-primary outline-none w-full"
                        />
                        <ImageUploader
                            onUploadComplete={(url) => setNewAd(prev => ({ ...prev, image: url }))}
                            directory="ads"
                            trigger={
                                <button type="button" className="px-3 bg-white/10 border border-white/10 hover:bg-white/20 transition-colors h-full flex items-center justify-center rounded-sm">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gold-primary"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" x2="12" y1="3" y2="15" /></svg>
                                </button>
                            }
                        />
                    </div>
                    <input
                        placeholder="Target Link"
                        value={newAd.link}
                        onChange={(e) => setNewAd({ ...newAd, link: e.target.value })}
                        className="bg-black/50 border border-white/10 p-3 text-sm text-white focus:border-gold-primary outline-none"
                    />

                    {newAd.image && (
                        <div className="col-span-1 md:col-span-3 h-32 relative bg-black/40 rounded-md overflow-hidden border border-white/10">
                            <Image
                                src={newAd.image}
                                alt="Preview"
                                fill
                                className="object-cover"
                            />
                            <button
                                type="button"
                                onClick={() => setNewAd(prev => ({ ...prev, image: "" }))}
                                className="absolute top-2 right-2 bg-black/50 hover:bg-red-500/80 text-white p-1 rounded-full transition-colors z-10"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                            </button>
                        </div>
                    )}

                    <div className="md:col-span-3">
                        <label className="text-xs text-muted-foreground uppercase tracking-widest mb-2 block">Target Tags</label>
                        <div className="flex flex-wrap gap-2">
                            {Object.values(Tag).map((tag) => (
                                <button
                                    key={tag}
                                    onClick={() => {
                                        setNewAd(prev => ({
                                            ...prev,
                                            type: prev.type.includes(tag)
                                                ? prev.type.filter(t => t !== tag)
                                                : [...prev.type, tag]
                                        }))
                                    }}
                                    className={`px-3 py-1 text-[10px] font-bold border uppercase tracking-widest transition-colors ${newAd.type.includes(tag)
                                        ? "bg-gold-primary text-black-primary border-gold-primary"
                                        : "bg-transparent text-muted-foreground border-white/10 hover:border-gold-primary/50"
                                        }`}
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="flex justify-end">
                    <button
                        onClick={handleCreate}
                        disabled={isCreating}
                        className="px-6 py-2 bg-white text-black font-bold text-xs uppercase tracking-widest hover:bg-gold-primary transition-colors disabled:opacity-50"
                    >
                        {isCreating ? "Saving..." : "Publish Ad"}
                    </button>
                </div>
            </div>

            {/* List Section */}
            <div className="space-y-4">
                {loading ? (
                    <div className="text-center py-12 text-muted-foreground">Loading ads...</div>
                ) : ads.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground border border-dashed border-white/10">No active ads found.</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {ads.map((ad) => (
                            <div key={ad.id} className="group relative bg-[#0a0a0a] border border-white/10 hover:border-gold-primary/30 transition-colors">
                                <div className="relative aspect-[21/9] w-full overflow-hidden bg-black/50">
                                    {ad.image && (
                                        <Image
                                            src={ad.image}
                                            alt={ad.title}
                                            fill
                                            className="object-cover"
                                        />
                                    )}
                                    <div className="absolute top-2 right-2 flex gap-2">
                                        <button
                                            onClick={() => handleDelete(ad.id)}
                                            className="p-2 bg-black/80 text-red-500 hover:text-red-400 hover:bg-black transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <h4 className="text-white font-bold text-sm mb-1">{ad.title}</h4>
                                    <a href={ad.link} target="_blank" rel="noopener noreferrer" className="text-[10px] text-muted-foreground flex items-center gap-1 hover:text-gold-primary">
                                        {ad.link} <ExternalLink className="w-3 h-3" />
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
