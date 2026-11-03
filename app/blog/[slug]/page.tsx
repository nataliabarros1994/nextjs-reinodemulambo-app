import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { BlogPost } from "@/components/Blog";
import { articlesMeta } from "@/lib/articles.meta";
import { pageOpenGraph } from "@/lib/open-graph";

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
    notFound();
  }
  return {
    title: artigo.seoTitle,
    description: artigo.seoDescription,
    openGraph: pageOpenGraph(`/blog/${slug}`, {
      type: "article",
      title: artigo.seoTitle,
      description: artigo.seoDescription,
    }),
    alternates: { canonical: `/blog/${slug}` },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!articlesMeta.find((a) => a.slug === slug)) {
    notFound();
  }
  return (
    <Suspense fallback={null}>
      <BlogPost />
    </Suspense>
  );
}
