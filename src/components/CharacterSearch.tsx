"use client";
import { useEffect, useState } from "react";
import CharacterCard from "@/components/CharacterCard";
import type { CharacterResponse } from "@/types/character";
export default function CharacterSearch() {
  const [filters, setFilters] = useState({
    name: "",
    status: "",
    type: "",
    gender: "",
  });
  const [page, setPage] = useState(1);
  const [result, setResult] = useState<CharacterResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setLoading(true);
      setError("");
      try {
        const query = new URLSearchParams({ page: String(page) });
        Object.entries(filters).forEach(([key, value]) => {
          if (value.trim()) query.set(key, value.trim());
        });
        const res = await fetch(
          `https://rickandmortyapi.com/api/character/?${query}`,
          { cache: "no-store", signal: controller.signal },
        );
        if (res.status === 404) {
          setResult({
            info: { count: 0, pages: 0, next: null, prev: null },
            results: [],
          });
          return;
        }
        if (!res.ok)
          throw new Error("No se pudo consultar la API. Intenta nuevamente.");
        setResult(await res.json());
      } catch (e) {
        if (!controller.signal.aborted) {
          setError(e instanceof Error ? e.message : "Error de conexión");
          setResult(null);
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 350);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [filters, page]);
  function update(key: keyof typeof filters, value: string) {
    setFilters((previous) => ({ ...previous, [key]: value }));
    setPage(1);
    setLoading(true);
  }
  return (
    <main>
      <div className="hero">
        <div>
          <span className="eyebrow">Explorador del multiverso</span>
          <h1>Encuentra tu personaje.</h1>
          <p>
            Combina filtros para explorar el archivo. Los resultados se
            actualizan mientras escribes.
          </p>
        </div>
      </div>
      <span className="mode">
        CSR · useState + useEffect · Consulta en tiempo real
      </span>
      <div className="filters">
        <label>
          Nombre
          <input
            aria-label="Nombre"
            placeholder="Ej. Rick"
            value={filters.name}
            onChange={(e) => update("name", e.target.value)}
          />
        </label>
        <label>
          Estado
          <select
            aria-label="Estado"
            value={filters.status}
            onChange={(e) => update("status", e.target.value)}
          >
            <option value="">Todos</option>
            <option value="alive">Vivo</option>
            <option value="dead">Muerto</option>
            <option value="unknown">Desconocido</option>
          </select>
        </label>
        <label>
          Tipo
          <input
            aria-label="Tipo"
            placeholder="Ej. Parasite"
            value={filters.type}
            onChange={(e) => update("type", e.target.value)}
          />
        </label>
        <label>
          Género
          <select
            aria-label="Género"
            value={filters.gender}
            onChange={(e) => update("gender", e.target.value)}
          >
            <option value="">Todos</option>
            <option value="female">Femenino</option>
            <option value="male">Masculino</option>
            <option value="genderless">Sin género</option>
            <option value="unknown">Desconocido</option>
          </select>
        </label>
      </div>
      <div className="resultbar" role="status" aria-live="polite">
        <span>
          {loading
            ? "Consultando personajes…"
            : `${result?.info.count ?? 0} personajes encontrados`}
        </span>
        <span>
          PÁGINA {page} / {result?.info.pages || 1}
        </span>
      </div>
      {error ? (
        <div role="alert" className="empty alert">
          {error}
        </div>
      ) : !loading && result?.results.length === 0 ? (
        <div className="empty">
          No se encontraron personajes con estos filtros.
        </div>
      ) : (
        <div className="grid" aria-busy={loading}>
          {!loading &&
            result?.results.map((c) => (
              <CharacterCard key={c.id} character={c} />
            ))}
        </div>
      )}
      <div className="pager">
        <button
          className="button secondary"
          disabled={loading || !result?.info.prev}
          onClick={() => {
            setPage((p) => p - 1);
            setLoading(true);
          }}
        >
          ← Anterior
        </button>
        <span>{page}</span>
        <button
          className="button"
          disabled={loading || !result?.info.next}
          onClick={() => {
            setPage((p) => p + 1);
            setLoading(true);
          }}
        >
          Siguiente →
        </button>
      </div>
    </main>
  );
}
