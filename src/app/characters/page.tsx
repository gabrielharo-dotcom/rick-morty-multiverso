import Catalog from "@/components/Catalog";
export const revalidate = 864000;
export const metadata = { title: "Catálogo estático" };
export default function Page() {
  return <Catalog mode="SSG" />;
}
