// Retratos oficiales del catálogo inicial, descargados el 24 de octubre de 2026.
// Los demás personajes conservan la URL de la API.
const bundledIds = new Set([
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
]);
export function characterImage(character: { id: number; image: string }) {
  return bundledIds.has(character.id)
    ? `/portraits/${character.id}.jpeg`
    : character.image;
}
