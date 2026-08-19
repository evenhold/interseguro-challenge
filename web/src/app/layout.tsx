import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Interseguro Challenge",
  description: "Microservicios - Go + Express",
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
