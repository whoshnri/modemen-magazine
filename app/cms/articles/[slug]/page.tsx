import { getArticleBySlug } from "@/app/actions/cms/articles";
import { ArticleForm } from "../components/article-form";
import { notFound } from "next/navigation";

interface props {
    params: Promise<{ slug: string }>;
}

export default async function EditArticlePage({ params }: props) {
    const parameters = await params
    const article = await getArticleBySlug(parameters.slug);

    if (!article) {
        notFound();
    }

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-widest mb-2">EDIT ARTICLE</h2>
                <p className="text-muted-foreground text-xs uppercase tracking-widest">Update existing content.</p>
            </div>

            <ArticleForm article={article} />
        </div>
    );
}

