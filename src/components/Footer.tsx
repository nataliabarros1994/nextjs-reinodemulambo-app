"use client";
import { Globe } from "lucide-react";
import Link from "next/link";
import { config } from "@/data/config.js";
import { about } from "@/data/about.js";
import { EmailLink } from "@/components/EmailLink";
import { SocialLinks } from "@/components/SocialLinks";
import { Logo } from "@/components/Logo";
import { OpenCookiePreferences } from "@/components/CookieConsent";

export function Footer() {
  return (
    <footer className="site-footer border-t border-dourado/20 bg-black pt-16 pb-8">
      <div className="container-wide grid gap-12 md:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <Link href="/" className="brand">
            <Logo />
            <span className="brand-copy">
              <span className="brand-name">Reino de Mulambo</span>
              <span className="brand-sub">presença para o seu caminho</span>
            </span>
          </Link>
          <p className="mt-5 max-w-sm text-sm leading-7 text-branco-lua/60">
            {about.apresentacao}
          </p>
        </div>
        <div className="flex flex-col text-sm text-branco-lua/70">
          <span className="eyebrow mb-1">Explorar</span>
          <Link href="/sobre" className="footer-link">Sobre</Link>
          <Link href="/servicos" className="footer-link">Serviços</Link>
          <Link href="/leitura" className="footer-link">A Leitura</Link>
          <Link href="/blog" className="footer-link">Blog</Link>
          <Link href="/glossario" className="footer-link">Glossário</Link>
          {config.TRABALHOS_ATIVOS ? <Link href="/trabalhos" className="footer-link">Trabalhos espirituais</Link> : null}
        </div>
        <div className="flex flex-col text-sm text-branco-lua/70">
          <span className="eyebrow mb-1">Contato</span>
          <Link href="/agendar" className="footer-link">Agendar consulta</Link>
          <EmailLink className="footer-link inline-flex items-center gap-2 hover:text-dourado" />
          <SocialLinks className="footer-link inline-flex items-center gap-2 hover:text-dourado" />
          <span className="inline-flex items-center gap-2">
            <Globe size={14} /> {config.cidade}
          </span>
        </div>
      </div>
      <div className="container-wide mt-12 flex flex-col gap-3 border-t border-dourado/15 pt-6 text-xs text-branco-lua/45 md:flex-row md:justify-between">
        <span>© {new Date().getFullYear()} {config.nome}. Todas as consultas são confidenciais.</span>
        <span className="flex flex-wrap gap-x-3 gap-y-1">
          <Link href="/privacidade" className="text-dourado underline underline-offset-2">Política de Privacidade</Link>
          <OpenCookiePreferences className="text-dourado underline underline-offset-2" />
          <span>{config.avisoLegal}</span>
        </span>
      </div>
    </footer>
  );
}
