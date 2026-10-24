"use client";
import Link from "next/link";
export default function ErrorBoundary({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main>
      <div className="center">
        <span className="eyebrow">Conexión interrumpida</span>
        <div className="error-code">!</div>
        <h1>El portal no responde</h1>
        <p>
          No pudimos cargar los datos. Puede ser una interrupción temporal del
          servicio. Vuelve a intentarlo para abrir el portal.
        </p>
        <button className="button" onClick={() => reset()}>
          Reintentar
        </button>
        <Link className="button secondary" href="/">
          Volver al universo
        </Link>
      </div>
    </main>
  );
}
