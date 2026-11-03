"use client";
import { Facebook, Instagram } from "lucide-react";
import { config } from "@/data/config.js";

function TikTokIcon({ size = 14, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={`shrink-0 ${className ?? ""}`}
      aria-hidden="true"
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.28 0 .54.04.79.1v3.52a6.37 6.37 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 12.68 0V8.73a8.18 8.18 0 0 0 4.76 1.52V6.8c-.35-.03-.69-.08-1-.11Z" />
    </svg>
  );
}

type SocialLinksProps = {
  className?: string;
  iconClassName?: string;
  iconSize?: number;
};

const itemClass =
  "footer-link inline-flex items-center gap-2 hover:text-dourado";

const links = [
  {
    href: config.instagram,
    label: config.instagramHandle,
    title: `Instagram ${config.instagramHandle}`,
    Icon: Instagram,
  },
  {
    href: config.facebookPage,
    label: config.facebookPageHandle,
    title: `Página do Facebook ${config.facebookPageHandle}`,
    Icon: Facebook,
  },
  {
    href: config.facebookProfile,
    label: config.facebookProfileHandle,
    title: `Perfil do Facebook ${config.facebookProfileHandle}`,
    Icon: Facebook,
  },
  {
    href: config.tiktok,
    label: config.tiktokHandle,
    title: `TikTok ${config.tiktokHandle}`,
    Icon: TikTokIcon,
  },
] as const;

/** Instagram, Facebook e TikTok — ícone na frente, @ ou nome oficial em seguida. */
export function SocialLinks({
  className = itemClass,
  iconClassName,
  iconSize = 14,
}: SocialLinksProps) {
  return (
    <>
      {links.map(({ href, label, title, Icon }) => (
        <a
          key={href}
          href={href}
          className={className}
          target="_blank"
          rel="noopener noreferrer"
          title={title}
          aria-label={title}
        >
          <Icon size={iconSize} className={`shrink-0 ${iconClassName ?? ""}`} aria-hidden="true" />
          {label}
        </a>
      ))}
    </>
  );
}
