"use client";
import { Mail } from "lucide-react";
import { config } from "@/data/config.js";

/** Link de e-mail — o endereço vem só de config.js. */
export function EmailLink({
  className = "inline-flex items-center gap-2 hover:text-dourado",
  iconClassName,
  iconSize = 14,
}: {
  className?: string;
  iconClassName?: string;
  iconSize?: number;
}) {
  return (
    <a href={`mailto:${config.email}`} className={className}>
      <Mail size={iconSize} className={iconClassName} aria-hidden="true" />
      {config.email}
    </a>
  );
}
