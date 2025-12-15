import { getSponsoredContent } from "@/app/actions/cms/sponsored";
import Link from "next/link";
import { Plus, Edit, ExternalLink, User } from "lucide-react";

export default async function SponsoredPage() {
    const { data: sponsored } = await getSponsoredContent();

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between pb-8 border-b border-white/10">
                <h2 className="text-3xl font-bold tracking-widest text-white">SPONSORED</h2>
                <Link
                    href="/cms/sponsored/new"
                    className="flex items-center gap-2 bg-gold-primary text-black-primary px-6 py-3 font-bold text-xs uppercase tracking-widest hover:bg-gold-secondary transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    <span>Add New</span>
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {sponsored?.map((item) => (
                    <div key={item.id} className="bg-[#0a0a0a] border border-white/10 group overflow-hidden flex flex-col">
                        <div className="relative h-48 bg-white/5">
                            {item.image ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                            ) : (
                                <div className="flex items-center justify-center h-full text-muted-foreground">No Image</div>
                            )}
                        </div>
                        <div className="p-6 flex-1 flex flex-col">
                            <div className="flex items-center gap-2 text-xs text-gold-primary font-bold uppercase tracking-widest mb-2">
                                <User className="w-3 h-3" />
                                {item.client}
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2 leading-tight">{item.title}</h3>
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">
                                {item.description}
                            </p>
                            <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                                {item.link && (
                                    <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-white flex items-center gap-1">
                                        View Link <ExternalLink className="w-3 h-3" />
                                    </a>
                                )}
                                <Link
                                    href={`/cms/sponsored/${item.id}`}
                                    className="text-gold-primary hover:text-white transition-colors"
                                >
                                    <Edit className="w-4 h-4" />
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
