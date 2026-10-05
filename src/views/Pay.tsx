"use client";
import { useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { pathToPay, resolveServiceId } from "@/utils/payment.js";

/** Rotas antigas /pagar redirecionam para a agenda do Calendly. */
export function Pay({ params }: { params?: { id?: string } } = {}) {
  const routeParams = useParams<{ id?: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const id = resolveServiceId(params?.id || routeParams?.id || searchParams.get("servico") || "");
    router.replace(pathToPay(id));
  }, [params?.id, routeParams?.id, router, searchParams]);

  return (
    <section className="flex min-h-[50vh] items-center justify-center">
      <p className="text-sm text-branco-lua/70">Abrindo a agenda…</p>
    </section>
  );
}

export default Pay;
