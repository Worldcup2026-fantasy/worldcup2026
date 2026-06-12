import type { Metadata } from "next";
import "./globals.css";
import NavBar from "@/components/ui/NavBar";

export const metadata: Metadata = {
  title: "WC2026 Fantasy",
  description: "Pick your World Cup 2026 fantasy squad",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900 antialiased">
        <NavBar />
        <main>{children}</main>
      </body>
    </html>
  );
}
