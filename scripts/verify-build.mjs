import { readFile } from "node:fs/promises";
import assert from "node:assert/strict";
const manifest = JSON.parse(
  await readFile(".next/prerender-manifest.json", "utf8"),
);
const pages = JSON.parse(await readFile(".cache/characters.json", "utf8"));
const ids = new Set(pages.flatMap((p) => p.results.map((c) => c.id)));
assert.equal(
  ids.size,
  pages[0].info.count,
  "El build debe incluir todos los personajes",
);
const routes = Object.keys(manifest.routes);
assert.equal(routes.filter((r) => r.startsWith("/pokemon")).length, 0);
assert.equal(
  routes.filter((r) => r.startsWith("/characters/")).length,
  ids.size,
);
for (const id of ids)
  assert.equal(
    manifest.routes[`/characters/${id}`]?.initialRevalidateSeconds,
    864000,
  );

assert.equal(manifest.routes["/characters"].initialRevalidateSeconds, 864000);
assert.ok(!manifest.routes["/"], "La portada SSR no debe estar prerenderizada");
console.log(`OK: ${ids.size} personajes, ISR de 10 días y portada SSR.`);
