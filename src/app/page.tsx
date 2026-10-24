import { connection } from "next/server";
import Catalog from "@/components/Catalog";
export default async function Home() {
  await connection();
  return <Catalog mode="SSR" />;
}
