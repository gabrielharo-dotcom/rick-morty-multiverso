import { getCharacterPage } from "@/lib/api";
import PortalHome from "@/components/PortalHome";
export default async function Catalog({ mode }: { mode: "SSR" | "SSG" }) {
  const data = await getCharacterPage();
  return <PortalHome initialData={data} mode={mode} />;
}
