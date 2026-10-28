import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "riv___was here.",
  description: "Portfolio showcasing user focused solutions",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // overscroll-none: FilmRoll does its own sideways bounce, and sideways
    // swipes move the roll instead of navigating back/forward.
    <html lang="en" className="overscroll-none">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
