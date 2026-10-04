"use client";
import { type ButtonHTMLAttributes, type ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "vermelho" | "roxo" | "contornado";

const variantClass: Record<Variant, string> = {
  vermelho: "btn-vermelho",
  roxo: "btn-roxo",
  contornado: "btn-contornado",
};

type Props = {
  variant?: Variant;
  href?: string;
  children: ReactNode;
  className?: string;
  external?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({
  variant = "vermelho",
  href,
  children,
  className,
  external,
  ...rest
}: Props) {
  const cls = cn("btn", variantClass[variant], className);
  const isExternal =
    Boolean(external) || Boolean(href && /^(https?:|mailto:|tel:)/i.test(href));
  if (href && isExternal) {
    return (
      <a className={cls} href={href} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }
  if (href) {
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  }
  return (
    <button className={cls} type={rest.type ?? "button"} {...rest}>
      {children}
    </button>
  );
}
