import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Layout from "@/components/Layout/Layout";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Hoteles Decameron",
  description: "Sistema de gestión hotelera para Hoteles Decameron",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body className={inter.className}>
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}
