"use client";
import { characterImage } from "@/lib/character-image";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { IoArrowForward, IoHeart, IoHeartOutline } from "react-icons/io5";
import type { Character } from "@/types/character";
export default function CharacterCard({
  character: c,
  favorite,
  onFavorite,
}: {
  character: Character;
  favorite?: boolean;
  onFavorite?: (id: number) => void;
}) {
  const [localFavorite, setLocalFavorite] = useState(false);
  const saved = favorite ?? localFavorite;
  return (
    <article className="card character-card">
      <Link
        href={`/characters/${c.id}`}
        prefetch={false}
        className="card-image-link"
        aria-label={`Ver ficha de ${c.name}`}
      >
        <div className="art">
          <span className="number">EXP. {String(c.id).padStart(3, "0")}</span>
          <Image
            src={characterImage(c)}
            alt={c.name}
            width={300}
            height={300}
            loading="lazy"
            sizes="(max-width:650px) 46vw,(max-width:1000px) 30vw,280px"
          />
        </div>
      </Link>
      <button
        className={`favorite-button ${saved ? "is-saved" : ""}`}
        aria-label={`${saved ? "Quitar de" : "Añadir a"} favoritos a ${c.name}`}
        aria-pressed={saved}
        onClick={() =>
          onFavorite ? onFavorite(c.id) : setLocalFavorite((v) => !v)
        }
      >
        {saved ? <IoHeart /> : <IoHeartOutline />}
      </button>
      <Link href={`/characters/${c.id}`} prefetch={false} className="card-body">
        <span className={`status status-${c.status.toLowerCase()}`}>
          <i />
          {c.status === "Alive"
            ? "Con vida"
            : c.status === "Dead"
              ? "Fallecido"
              : "Estado desconocido"}
          <span>· {c.species}</span>
        </span>
        <h2>{c.name}</h2>
        <p>{c.location.name}</p>
        <span className="card-link">
          Abrir expediente <IoArrowForward />
        </span>
      </Link>
    </article>
  );
}
