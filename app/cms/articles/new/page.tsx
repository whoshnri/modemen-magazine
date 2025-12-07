import { ArticleForm } from "../components/article-form";

export default function NewArticlePage() {
    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-widest mb-2">CREATE NEW ARTICLE</h2>
                <p className="text-muted-foreground text-xs uppercase tracking-widest">Add a new story to the collection.</p>
            </div>

            <ArticleForm />
        </div>
    );
}
