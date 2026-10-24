import { mkdir, readFile, writeFile, stat } from "node:fs/promises";
import { spawn } from "node:child_process";
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
async function fetchPage(page) {
  for (let attempt = 0; attempt < 7; attempt++) {
    const res = await fetch(
      `https://rickandmortyapi.com/api/character?page=${page}`,
      { signal: AbortSignal.timeout(30000) },
    );
    if (res.ok) return res.json();
    if (res.status !== 429 && res.status < 500)
      throw Error(`API HTTP ${res.status}`);
    const seconds = Number(res.headers.get("retry-after"));
    const wait =
      seconds > 0
        ? Math.min(seconds * 1000, 60000)
        : Math.min(3000 * 2 ** attempt, 60000);
    console.log(
      `API ${res.status}: reintentando página ${page} en ${wait / 1000}s`,
    );
    await delay(wait);
  }
  throw Error(`No se pudo obtener la página ${page}`);
}
await mkdir(".cache", { recursive: true });
let pages = [];
try {
  const info = await stat(".cache/characters.json");
  if (Date.now() - info.mtimeMs < 3600000)
    pages = JSON.parse(await readFile(".cache/characters.json", "utf8"));
} catch {}
if (!pages.length) {
  const first = await fetchPage(1);
  pages.push(first);
  for (let p = 2; p <= first.info.pages; p++) {
    await delay(1200);
    pages.push(await fetchPage(p));
    console.log(`Descargando catálogo para SSG: ${p}/${first.info.pages}`);
  }
  await writeFile(".cache/characters.json", JSON.stringify(pages));
}
console.log(
  `Datos reales para SSG: ${pages.flatMap((p) => p.results).length} personajes. El runtime usará fetch con ISR.`,
);
const child = spawn(
  process.execPath,
  ["node_modules/next/dist/bin/next", "build"],
  { stdio: "inherit", env: { ...process.env, LAB_BUILD_SNAPSHOT: "true" } },
);
child.on("exit", (code) => process.exit(code ?? 1));
