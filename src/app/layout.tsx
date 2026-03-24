import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SidebarWrapper } from "@/components/layout";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ARAM - Alerta Radar de Alertas Migratorias",
  description: "Plataforma para gestión y búsqueda inteligente de alertas migratorias",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="h-screen overflow-hidden">
        <div className="flex h-full">
          <SidebarWrapper />
          <main className="flex flex-col flex-1 h-full overflow-hidden">
            <div className="flex-1 overflow-y-auto">{children}</div>
          </main>
        </div>
      </body>
    </html>
  );
}
