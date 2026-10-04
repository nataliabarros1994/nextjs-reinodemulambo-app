import type { Metadata } from "next";
import { Suspense } from "react";
import { BlogPost } from "@/components/Blog";
import { articlesMeta } from "@/lib/articles.meta";

export function generateStaticParams() {
  return articlesMeta.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const artigo = articlesMeta.find((a) => a.slug === slug);
  if (!artigo) {
    return { title: "Artigo não encontrado | Reino de Mulambo" };
  }
  return {
    title: artigo.seoTitle,
    description: artigo.seoDescription,
    openGraph: { type: "article" },
  };
}

export default function Page() {
  return (
    <Suspense fallback={null}>
      <BlogPost />
    </Suspense>
  );
}
