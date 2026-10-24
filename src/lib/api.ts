import { cache } from "react";
import { notFound } from "next/navigation";
import { readFile } from "node:fs/promises";
import type { Character, CharacterResponse } from "@/types/character";
export const TEN_DAYS = 864000;
const RM = "https://rickandmortyapi.com/api/character";
async function json<T>(
  url: string,
  seconds: number,
  detail = false,
): Promise<T> {
  for (let attempt = 0; attempt < 5; attempt++) {
    const res = await fetch(url, {
      cache: "force-cache",
      next: { revalidate: seconds },
      signal: AbortSignal.timeout(30000),
    });
    if (res.status === 404 && detail) notFound();
    if (res.ok) return res.json() as Promise<T>;
    if ((res.status === 429 || res.status >= 500) && attempt < 4) {
      const retry = Number(res.headers.get("retry-after"));
      await new Promise((resolve) =>
        setTimeout(
          resolve,
          retry > 0 ? Math.min(retry * 1000, 60000) : 2000 * 2 ** attempt,
        ),
      );
      continue;
    }
    throw new Error(`El servicio no está disponible (${res.status})`);
  }
  throw new Error("Se agotaron los reintentos");
}
const buildCharacters = cache(async (): Promise<CharacterResponse[]> =>
  JSON.parse(await readFile(".cache/characters.json", "utf8")),
);
export const getCharacterPage = cache(async (page = 1) =>
  process.env.LAB_BUILD_SNAPSHOT === "true"
    ? (await buildCharacters())[page - 1]
    : json<CharacterResponse>(`${RM}?page=${page}`, TEN_DAYS),
);
export const getCharacter = cache(async (id: string) => {
  if (!/^[1-9]\d*$/.test(id)) notFound();
  if (process.env.LAB_BUILD_SNAPSHOT === "true") {
    const character = (await buildCharacters())
      .flatMap((page) => page.results)
      .find((c) => c.id === Number(id));
    if (!character) notFound();
    return character;
  }
  return json<Character>(`${RM}/${id}`, TEN_DAYS, true);
});
export async function getAllCharacterIds(): Promise<string[]> {
  const first = await getCharacterPage();
  const ids = first.results.map((c) => String(c.id));
  // Recorrer la paginación real evita suponer que los IDs son consecutivos.
  for (let page = 2; page <= first.info.pages; page += 4) {
    const batch = await Promise.all(
      Array.from({ length: Math.min(4, first.info.pages - page + 1) }, (_, i) =>
        getCharacterPage(page + i),
      ),
    );
    ids.push(...batch.flatMap((data) => data.results.map((c) => String(c.id))));
  }
  return [...new Set(ids)];
}
