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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-white text-gray-800">{children}</body>
    </html>
  );
}
