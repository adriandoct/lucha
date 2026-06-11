import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lucha MEX - Control de Acceso Lucha Libre",
  description: "Plataforma Inteligente de Asistencia Escolar con QR y WhatsApp para Escuelas de Lucha Libre.",
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
