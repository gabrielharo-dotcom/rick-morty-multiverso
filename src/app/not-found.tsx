import Link from "next/link";
export default function NotFound() {
  return (
    <main>
      <div className="center">
        <span className="eyebrow">Coordenadas desconocidas</span>
        <div className="error-code">404</div>
        <h1>Fuera de este universo</h1>
        <p>
          El personaje o la página que buscas no existe. Abre otro portal y
          continúa explorando.
        </p>
        <Link className="button" href="/">
          Volver al universo
        </Link>
        <Link className="button secondary" href="/search">
          Buscar personajes
        </Link>
      </div>
    </main>
  );
}
