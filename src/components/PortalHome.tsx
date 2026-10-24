"use client";
import { characterImage } from "@/lib/character-image";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  IoArrowForward,
  IoArrowDown,
  IoArrowBack,
  IoShuffle,
  IoHeartOutline,
  IoPlanetOutline,
  IoSparklesOutline,
  IoPause,
  IoPlay,
  IoSearch,
  IoClose,
} from "react-icons/io5";
import type { CharacterResponse } from "@/types/character";
import CharacterCard from "./CharacterCard";
import Reveal from "./Reveal";
export default function PortalHome({
  initialData: data,
  mode,
}: {
  initialData: CharacterResponse;
  mode: "SSR" | "SSG";
}) {
  const characters = data.results;
  const featured = characters.slice(0, 6);
  const [active, setActive] = useState(0);
  const [autoPlay, setAutoPlay] = useState(false);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [species, setSpecies] = useState("all");
  const [quickSearch, setQuickSearch] = useState("");
  const rail = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const c = featured[active];
  useEffect(() => {
    if (!autoPlay || matchMedia("(prefers-reduced-motion: reduce)").matches)
      return;
    const timer = setInterval(
      () => setActive((i) => (i + 1) % featured.length),
      5500,
    );
    return () => clearInterval(timer);
  }, [autoPlay, featured.length]);
  function slide(delta: number) {
    setActive((i) => (i + delta + featured.length) % featured.length);
  }
  function favorite(id: number) {
    setFavorites((current) =>
      current.includes(id) ? current.filter((n) => n !== id) : [...current, id],
    );
  }
  const visible = characters.filter(
    (character) =>
      (!onlyFavorites || favorites.includes(character.id)) &&
      (species === "all" || character.species === species) &&
      character.name.toLowerCase().includes(quickSearch.toLowerCase()),
  );
  return (
    <main className="portal-home">
      <section className="portal-hero" aria-labelledby="hero-title">
        <div className="hero-copy">
          <div className="transmission">
            <span /> TRANSMISIÓN DESDE LA DIMENSIÓN C-137
          </div>
          <h1 id="hero-title">
            El universo
            <br />
            no tiene <em>límites.</em>
          </h1>
          <p>
            Personajes extraordinarios. Dimensiones imposibles.
            <br className="desktop-break" /> Abre un portal y descubre quién
            está al otro lado.
          </p>
          <div className="hero-actions">
            <a href="#explorar" className="button primary-portal">
              Explorar personajes <IoArrowForward />
            </a>
            <button
              className="button glass-button"
              onClick={() =>
                router.push(
                  `/characters/${characters[Math.floor(Math.random() * characters.length)].id}`,
                )
              }
            >
              <IoShuffle /> Sorpréndeme
            </button>
          </div>
          <div className="hero-stats">
            <div>
              <strong>
                {data.info.count}
                <span>+</span>
              </strong>
              <small>PERSONAJES</small>
            </div>
            <div>
              <strong>{data.info.pages}</strong>
              <small>PÁGINAS POR EXPLORAR</small>
            </div>
            <div>
              <strong>∞</strong>
              <small>POSIBILIDADES</small>
            </div>
          </div>
          <a className="scroll-cue" href="#destacados">
            <span>
              <IoArrowDown />
            </span>{" "}
            Desliza. El viaje apenas empieza.
          </a>
        </div>
        <div
          className="portal-stage"
          role="region"
          aria-roledescription="carrusel"
          aria-label="Personajes destacados"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "ArrowRight") {
              e.preventDefault();
              slide(1);
            }
            if (e.key === "ArrowLeft") {
              e.preventDefault();
              slide(-1);
            }
          }}
        >
          <div className="orbit orbit-outer" aria-hidden="true" />
          <div className="orbit orbit-inner" aria-hidden="true" />
          <span className="coordinate coord-top">
            34°N / 118°W <i>PORTAL ESTABLE</i>
          </span>
          <div className="portal-ring" aria-hidden="true" />
          <div className="portal-noise" aria-hidden="true" />
          <div className="portal-portrait" key={c.id}>
            <Image
              src={characterImage(c)}
              alt={c.name}
              width={440}
              height={440}
              sizes="(max-width:650px) 75vw,440px"
              preload={active === 0}
            />
            <div className="portrait-shade" />
          </div>
          <div className="portal-orbit-label" aria-hidden="true">
            EXPLORACIÓN INTERDIMENSIONAL
          </div>
          <div className="floating-exp glass">
            <span className="tiny-label">
              EXPEDIENTE {String(c.id).padStart(3, "0")}
            </span>
            <div className="featured-name" aria-live="polite">
              {c.name}
            </div>
            <span className="featured-species">
              {c.species} <i />{" "}
              {c.status === "Alive"
                ? "Con vida"
                : c.status === "Dead"
                  ? "Fallecido"
                  : "Desconocido"}
            </span>
            <Link
              href={`/characters/${c.id}`}
              className="featured-open"
              aria-label={`Abrir expediente de ${c.name}`}
            >
              <IoArrowForward />
            </Link>
          </div>
          <div className="portal-controls">
            <button
              className="icon-button"
              onClick={() => slide(-1)}
              aria-label="Personaje anterior"
            >
              <IoArrowBack />
            </button>
            <div className="carousel-dots">
              {featured.map((item, index) => (
                <button
                  key={item.id}
                  onClick={() => setActive(index)}
                  aria-label={`Mostrar ${item.name}`}
                  aria-pressed={active === index}
                  className={active === index ? "active" : ""}
                />
              ))}
            </div>
            <button
              className="icon-button"
              onClick={() => slide(1)}
              aria-label="Personaje siguiente"
            >
              <IoArrowForward />
            </button>
            <button
              className="icon-button autoplay"
              aria-label={autoPlay ? "Pausar carrusel" : "Reproducir carrusel"}
              aria-pressed={autoPlay}
              onClick={() => setAutoPlay((v) => !v)}
            >
              {autoPlay ? <IoPause /> : <IoPlay />}
            </button>
          </div>
        </div>
      </section>
      <div className="universe-strip" aria-hidden="true">
        <span>
          <IoSparklesOutline /> REALIDADES ALTERNATIVAS
        </span>
        <span>PORTALES ABIERTOS</span>
        <span>
          <IoPlanetOutline /> HISTORIAS FUERA DE ÓRBITA
        </span>
        <span>WUBBA LUBBA DUB DUB</span>
      </div>
      <Reveal className="featured-section" id="destacados">
        <div className="section-heading">
          <div>
            <span className="eyebrow">ELIGE TUS COORDENADAS</span>
            <h2>
              Una dimensión a la vez<span>.</span>
            </h2>
            <p>Los rostros que hacen de este universo un lugar tan extraño.</p>
          </div>
          <div className="rail-controls">
            <button
              className="icon-button"
              aria-label="Deslizar galería a la izquierda"
              onClick={() =>
                rail.current?.scrollBy({
                  left: -600,
                  behavior: matchMedia("(prefers-reduced-motion: reduce)")
                    .matches
                    ? "instant"
                    : "smooth",
                })
              }
            >
              <IoArrowBack />
            </button>
            <button
              className="icon-button"
              aria-label="Deslizar galería a la derecha"
              onClick={() =>
                rail.current?.scrollBy({
                  left: 600,
                  behavior: matchMedia("(prefers-reduced-motion: reduce)")
                    .matches
                    ? "instant"
                    : "smooth",
                })
              }
            >
              <IoArrowForward />
            </button>
          </div>
        </div>
        <div
          ref={rail}
          className="photo-rail"
          role="region"
          aria-label="Galería de personajes"
          tabIndex={0}
        >
          {characters.slice(0, 10).map((item, index) => (
            <Link
              href={`/characters/${item.id}`}
              key={item.id}
              className="photo-slide"
              prefetch={false}
            >
              <Image
                src={characterImage(item)}
                alt={item.name}
                width={320}
                height={360}
                loading="lazy"
              />
              <div className="photo-overlay">
                <small>EXPEDIENTE {String(item.id).padStart(3, "0")}</small>
                <strong>{item.name}</strong>
                <span>
                  {item.species} <IoArrowForward />
                </span>
              </div>
              <span className="slide-index">
                {String(index + 1).padStart(2, "0")}
              </span>
            </Link>
          ))}
        </div>
      </Reveal>
      <Reveal className="explore-section" id="explorar">
        <div className="section-heading">
          <div>
            <span className="eyebrow">EL ARCHIVO DEL MULTIVERSO</span>
            <h2>
              Seres de otra realidad<span>.</span>
            </h2>
            <p>Encuentra a tus favoritos. Cada personaje tiene una historia.</p>
          </div>
          <Link href="/search" className="text-link">
            Explorar los {data.info.count} <IoArrowForward />
          </Link>
        </div>
        <div className="catalog-toolbar glass">
          <div
            className="filter-chips"
            role="group"
            aria-label="Filtrar por especie"
          >
            {[
              ["all", "Todos"],
              ["Human", "Humanos"],
              ["Alien", "Alienígenas"],
            ].map(([value, label]) => (
              <button
                className={species === value ? "chip active" : "chip"}
                aria-pressed={species === value}
                key={value}
                onClick={() => setSpecies(value)}
              >
                {label}
              </button>
            ))}
            <button
              className={onlyFavorites ? "chip active" : "chip"}
              aria-pressed={onlyFavorites}
              onClick={() => setOnlyFavorites((v) => !v)}
            >
              <IoHeartOutline /> Favoritos <span>{favorites.length}</span>
            </button>
          </div>
          <label className="quick-search">
            <IoSearch />
            <input
              aria-label="Filtrar personajes de esta colección"
              placeholder="Encuentra un personaje…"
              value={quickSearch}
              onChange={(e) => setQuickSearch(e.target.value)}
            />
            {quickSearch && (
              <button
                className="clear-search"
                aria-label="Limpiar búsqueda"
                onClick={() => setQuickSearch("")}
              >
                <IoClose />
              </button>
            )}
          </label>
        </div>
        <div className="collection-meta">
          <span role="status" aria-live="polite">
            {visible.length} PERSONAJES EN ESTA COLECCIÓN
          </span>
          <span>UNIVERSO 01 — {String(data.info.pages).padStart(2, "0")}</span>
        </div>
        {visible.length ? (
          <div className="grid universe-grid">
            {visible.map((item) => (
              <CharacterCard
                key={item.id}
                character={item}
                favorite={favorites.includes(item.id)}
                onFavorite={favorite}
              />
            ))}
          </div>
        ) : (
          <div className="empty glass">
            <IoPlanetOutline size={35} />
            <h3>No hay señales en esta dimensión</h3>
            <p>
              {onlyFavorites
                ? "Guarda personajes con el corazón para verlos aquí."
                : "Prueba otro nombre o cambia los filtros."}
            </p>
            <button
              className="button"
              onClick={() => {
                setOnlyFavorites(false);
                setSpecies("all");
                setQuickSearch("");
              }}
            >
              Restablecer filtros
            </button>
          </div>
        )}
        <div className="catalog-end">
          <p>Esto es solo una pequeña parte del multiverso.</p>
          <Link className="button primary-portal" href="/search">
            Descubrir más personajes <IoArrowForward />
          </Link>
        </div>
      </Reveal>
      <Reveal className="portal-invitation glass">
        <div className="mini-portal" aria-hidden="true">
          <IoPlanetOutline />
        </div>
        <div>
          <span className="eyebrow">TU PRÓXIMO SALTO</span>
          <h2>Lo extraño está al otro lado.</h2>
          <p>
            Combina nombre, estado, tipo y género. Tu siguiente descubrimiento
            está a una búsqueda.
          </p>
        </div>
        <Link
          href="/search"
          className="icon-button"
          aria-label="Abrir búsqueda avanzada"
        >
          <IoArrowForward />
        </Link>
      </Reveal>
      <p className="render-note">
        Catálogo {mode} · Datos de The Rick and Morty API · Actualización de la
        colección cada 10 días
      </p>
    </main>
  );
}
