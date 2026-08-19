import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Interseguro | Matrix Operations",
  description: "Technical Challenge - Matrix Rotation & QR Factorization",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="bg-white text-gray-800">{children}</body>
    </html>
  );
}
