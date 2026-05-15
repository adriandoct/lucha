import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DOJOIA | Dashboard Ejecutivo",
  description: "Plataforma educativa premium con IA integrada. Gestión avanzada para directores y docentes.",
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
