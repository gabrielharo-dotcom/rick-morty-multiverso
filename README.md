# Rick and Morty Multiverso

Explorador de personajes con Next.js App Router, TypeScript y Tailwind CSS. Interfaz espacial con nebulosas violetas, azules y cian, acentos coral y verde portal, paneles de cristal, carrusel con controles y reproducción opcional, galería horizontal y secciones que aparecen al desplazarse. Respeta prefers-reduced-motion.

## Funcionalidades

- Portada SSR con datos cacheados y catálogo /characters con SSG e ISR.
- 826 fichas actuales generadas con generateStaticParams a partir de la paginación real.
- Revalidación cada 864000 segundos, equivalente a diez días.
- Búsqueda CSR por name, status, type y gender; debounce, cancelación y paginación.
- Filtros rápidos por especie y nombre, favoritos de sesión y exploración aleatoria.
- Fichas completas, metadata individual, imágenes lazy y páginas de error personalizadas.

## Ejecutar

Node 24.22.1 LTS y npm 12.2.1. Next 16.4.3 y React 19.3.1. Dependencias e integridades fijadas en package-lock.json.

```powershell
npx --yes npm@12.2.1 ci --ignore-scripts
npm run dev
```

## Verificar y compilar

```powershell
npm run lint
npm run typecheck
npm run build
npm run verify:build
npm start
```

El build descarga las páginas reales de la API con pausas y reintentos para respetar HTTP 429. Reutiliza una instantánea temporal durante una hora, solo para generar los detalles sin repetir cientos de consultas. El proceso de build activa LAB_BUILD_SNAPSHOT únicamente en el subproceso de Next; no configurar esa variable en Vercel ni en el servidor. En ejecución, fetch utiliza force-cache e ISR. La regeneración se activa bajo demanda después del plazo; no es una tarea programada sin visitas.

Los 20 retratos del catálogo inicial se sirven desde public/portraits para reducir solicitudes de imágenes al servicio. Los demás personajes conservan sus URL oficiales. Los datos siguen consultándose a la API.

## Despliegue

Vercel detecta vercel.json, Node 24.x y los comandos fijados de npm 12.2.1. No usar export estático porque se requieren SSR e ISR.

La Pokédex del mismo laboratorio tiene una publicación independiente en https://pokedex-nextjs-tan.vercel.app y su código en https://github.com/gabrielharo-dotcom/pokedex-nextjs. El proyecto base local del laboratorio conserva ambos ejercicios; este repositorio publica la aplicación Rick and Morty.

Datos: https://rickandmortyapi.com/documentation/. Los personajes y recursos gráficos pertenecen a sus titulares. Proyecto educativo.
