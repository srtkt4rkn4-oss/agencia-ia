import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AgencIA · Automatización inteligente para empresas",
  description:
    "Ayudamos a empresas a encontrar tareas repetitivas de alto coste operativo, diseñar soluciones a medida e implementarlas para ahorrar tiempo, reducir errores y escalar operaciones.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
