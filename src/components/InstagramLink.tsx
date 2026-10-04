"use client";
import { Instagram } from "lucide-react";
import { config } from "@/data/config.js";

/** Link do Instagram — handle e URL vêm só de config.js. */
export function InstagramLink({
  className = "inline-flex items-center gap-2 hover:text-dourado",
  iconClassName,
  iconSize = 14,
}: {
  className?: string;
  iconClassName?: string;
  iconSize?: number;
}) {
  return (
    <a
      href={config.instagram}
      className={className}
      target="_blank"
      rel="noopener noreferrer"
    >
      <Instagram size={iconSize} className={iconClassName} aria-hidden="true" />
      {config.instagramHandle}
    </a>
  );
}
