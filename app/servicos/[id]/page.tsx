import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { pageOpenGraph } from "@/lib/open-graph";
import { findServiceLanding, SERVICE_LANDING_IDS } from "@/lib/service-landings";
import { ServiceLanding } from "@/views/ServiceLanding";

export function generateStaticParams() {
  return SERVICE_LANDING_IDS.map((id) => ({ id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const landing = findServiceLanding(id);
  if (!landing) {
    notFound();
  }
  const { copy } = landing;
  return {
    title: copy.seoTitle,
    description: copy.seoDescription,
    robots: { index: true, follow: true },
    alternates: { canonical: `/servicos/${id}` },
    openGraph: pageOpenGraph(`/servicos/${id}`, {
      title: copy.seoTitle,
      description: copy.seoDescription,
    }),
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const landing = findServiceLanding(id);
  if (!landing) {
    notFound();
  }
  return <ServiceLanding offer={landing.offer} copy={landing.copy} />;
}
