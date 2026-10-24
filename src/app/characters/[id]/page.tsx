import { characterImage } from "@/lib/character-image";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getCharacter, getAllCharacterIds } from "@/lib/api";
export const revalidate = 864000;
export const dynamicParams = true;
type Props = { params: Promise<{ id: string }> };
export async function generateStaticParams() {
  return (await getAllCharacterIds()).map((id) => ({ id }));
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const c = await getCharacter((await params).id);
  return {
    title: c.name,
    description: `${c.name}, ${c.species}. ${c.origin.name}.`,
  };
}
export default async function Detail({ params }: Props) {
  const c = await getCharacter((await params).id);
  const facts = [
    ["ID", c.id],
    ["Estado", c.status],
    ["Especie", c.species],
    ["Tipo", c.type || "No especificado"],
    ["Género", c.gender],
    ["Fecha de creación", c.created],
  ];
  return (
    <main>
      <Link className="back" href="/characters">
        ← Volver al catálogo
      </Link>
      <div className="detail">
        <div>
          <Image
            className="portrait"
            src={characterImage(c)}
            alt={c.name}
            width={350}
            height={350}
            loading="lazy"
          />
          <p className="note">SSG + ISR · Revalidación cada 864 000 segundos</p>
        </div>
        <section>
          <span className="eyebrow">
            Expediente #{String(c.id).padStart(3, "0")}
          </span>
          <h1>{c.name}</h1>
          <span className="mode">
            ● {c.status} · {c.species}
          </span>
          <dl className="facts">
            {facts.map(([label, value]) => (
              <div className="fact" key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
            {[
              ["Origen", c.origin],
              ["Ubicación actual", c.location],
            ].map(([label, ref]) => {
              const resource = ref as typeof c.origin;
              return (
                <div className="fact" key={String(label)}>
                  <dt>{String(label)}</dt>
                  <dd>
                    {resource.name}
                    {resource.url && (
                      <>
                        <br />
                        <a href={resource.url} target="_blank" rel="noreferrer">
                          {resource.url}
                        </a>
                      </>
                    )}
                  </dd>
                </div>
              );
            })}
            <div className="fact">
              <dt>URL del recurso</dt>
              <dd>
                <a href={c.url} target="_blank" rel="noreferrer">
                  {c.url}
                </a>
              </dd>
            </div>
            <div className="fact">
              <dt>URL de imagen</dt>
              <dd>
                <a href={c.image} target="_blank" rel="noreferrer">
                  {c.image}
                </a>
              </dd>
            </div>
          </dl>
          <h2>Episodios · {c.episode.length}</h2>
          <div className="episodes">
            {c.episode.map((url) => (
              <a key={url} href={url} target="_blank" rel="noreferrer">
                Episodio {url.split("/").at(-1)}
              </a>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
