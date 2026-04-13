import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

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
      <body className={inter.variable}>{children}</body>
    </html>
  );
}
