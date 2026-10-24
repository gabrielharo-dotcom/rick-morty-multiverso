import type { Metadata } from "next";
import SpaceChrome from "@/components/SpaceChrome";
import "./globals.css";
import "./space.css";
import "./space-colors.css";
export const metadata: Metadata = {
  title: {
    default: "Rick and Morty — El archivo multiverso",
    template: "%s | Rick and Morty",
  },
  description:
    "Abre un portal al multiverso. Explora personajes, descubre sus historias y encuentra tu próxima dimensión.",
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" data-scroll-behavior="smooth">
      <body>
        <SpaceChrome>{children}</SpaceChrome>
      </body>
    </html>
  );
}
