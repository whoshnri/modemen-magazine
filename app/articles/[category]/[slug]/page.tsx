import { getMetadataForArticles } from "@/app/actions/metadata";
import ArticlePageClient from "./page.client";

interface Props {
  params: Promise<{ category: string; slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  return getMetadataForArticles(slug);
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  return <ArticlePageClient slug={slug} />;
}
