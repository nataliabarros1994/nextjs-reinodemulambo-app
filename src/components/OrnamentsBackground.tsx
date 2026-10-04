"use client";
import { usePathname } from "next/navigation";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { layoutForPath, ZodiacOrnament } from "@/components/ZodiacOrnament";

/**
 * Camada de atmosfera do site. Sem clique, sem texto, atrás do conteúdo.
 * A animação para quando a pessoa pede less motion — os glifos ficam parados.
 */
export function OrnamentsBackground() {
  const path = usePathname();
  const reduzido = useReducedMotion();
  const layout = layoutForPath(path);

  return (
    <div className="site-ornamentos" aria-hidden="true" role="presentation">
      <ZodiacOrnament layout={layout} animar={!reduzido} />
    </div>
  );
}
