"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  IoArrowUp,
  IoMenu,
  IoPlanet,
  IoSearch,
  IoClose,
} from "react-icons/io5";
export default function SpaceChrome({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const progress = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const total = document.documentElement.scrollHeight - innerHeight;
        progress.current?.style.setProperty(
          "--scroll",
          String(total > 0 ? scrollY / total : 0),
        );
      });
    };
    update();
    addEventListener("scroll", update, { passive: true });
    addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(frame);
      removeEventListener("scroll", update);
      removeEventListener("resize", update);
    };
  }, [pathname]);
  const close = () => setMenuOpen(false);
  return (
    <div className="space-app" id="arriba">
      <div className="starfield" aria-hidden="true" />
      <div className="nebula nebula-one" aria-hidden="true" />
      <div className="nebula nebula-two" aria-hidden="true" />
      <div className="scroll-progress" ref={progress} aria-hidden="true" />
      <header className="space-nav">
        <Link href="/" className="space-brand" onClick={close}>
          <span className="brand-portal">
            <IoPlanet size={24} />
          </span>
          <span>
            RICK <i>AND</i> MORTY<small>THE MULTIVERSE ARCHIVE</small>
          </span>
        </Link>
        <button
          className="menu-toggle icon-button"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <IoClose /> : <IoMenu />}
        </button>
        <nav
          aria-label="Navegación principal"
          className={menuOpen ? "space-links is-open" : "space-links"}
        >
          <Link
            href="/"
            onClick={close}
            aria-current={pathname === "/" ? "page" : undefined}
          >
            Universo
          </Link>
          <Link
            href="/characters"
            onClick={close}
            aria-current={
              pathname.startsWith("/characters") ? "page" : undefined
            }
          >
            Personajes
          </Link>
          <Link
            href="/search"
            className="nav-search"
            onClick={close}
            aria-current={pathname === "/search" ? "page" : undefined}
          >
            <IoSearch /> Buscar en el multiverso
          </Link>
        </nav>
      </header>
      {children}
      <footer className="space-footer">
        <div>
          <span className="footer-title">NO HAY LÍMITES. SOLO PORTALES.</span>
          <p>Un archivo para explorar el universo de Rick and Morty.</p>
        </div>
        <a href="#arriba" className="to-top">
          Volver a la órbita <IoArrowUp />
        </a>
        <div className="footer-bottom">
          <span>RICK AND MORTY · PROYECTO EDUCATIVO</span>
          <a
            href="https://rickandmortyapi.com/"
            target="_blank"
            rel="noreferrer"
          >
            Datos de The Rick and Morty API ↗
          </a>
        </div>
      </footer>
    </div>
  );
}
