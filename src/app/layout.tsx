import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Raion Kai - Control de Acceso Marcial",
  description: "Plataforma Inteligente de Asistencia Escolar con QR y WhatsApp para Dojos de Karate.",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="dark-theme">
        {children}
      </body>
    </html>
  );
}
