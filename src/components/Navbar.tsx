"use client";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/Button";


export function Navbar() {
  const location = usePathname();
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(location !== "/");

  const nav = [
    { href: "/", label: "Início" },
    { href: "/sobre", label: "Sobre" },
    { href: "/servicos", label: "Serviços" },
    { href: "/blog", label: "Blog" },
    { href: "/contato", label: "Contato" },
  ];

  useEffect(() => {
    setOpen(false);
  }, [location]);

  useEffect(() => {
    const onScroll = () => setSolid(location !== "/" || window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [location]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className={solid || open ? "topbar topbar-solid" : "topbar"}>
      <div className="container-wide topbar-inner">
        <Link href="/" className="brand" aria-label="Reino de Mulambo — página inicial">
          <Logo />
          <span className="brand-copy">
            <span className="brand-name">Reino de Mulambo</span>
            <span className="brand-sub">búzios · tarô · escuta</span>
          </span>
        </Link>
        <nav className="main-nav" aria-label="Navegação principal">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={location === item.href ? "page" : undefined}
            >
              {item.label}
            </Link>
          ))}
          <Button href="/servicos" className="nav-cta !py-2.5 !px-4 text-xs">
            Agendar consulta
          </Button>
          <button
            className="nav-toggle"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            aria-expanded={open}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </nav>
      </div>
      {open ? (
        <nav className="mobile-nav" aria-label="Navegação móvel">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="font-display text-2xl">
              {item.label}
            </Link>
          ))}
          <Button href="/servicos">
            Agendar consulta
          </Button>
        </nav>
      ) : null}
    </header>
  );
}
