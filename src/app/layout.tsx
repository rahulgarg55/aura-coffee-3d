import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#070605",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "AURA COFFEE ATELIER | The Alchemical 3D Coffee Experience",
  description:
    "An immersive luxury coffee experience. Explore scroll-driven 3D brewing journeys, interactive latte art canvas, artisanal roast customizer, and single-origin reserve blends.",
  keywords: [
    "specialty coffee",
    "3D coffee experience",
    "luxury roastery",
    "artisanal espresso",
    "latte art studio",
    "single-origin coffee",
    "tokyo ginza roastery",
  ],
  authors: [{ name: "Aura Coffee Atelier", url: "https://auracoffee.atelier" }],
  openGraph: {
    title: "AURA COFFEE ATELIER | The Alchemical 3D Coffee Experience",
    description:
      "Crafted at the threshold of light and dark. Experience the full 3D bean-to-cup journey with interactive roasting and bespoke latte art.",
    url: "https://auracoffee.atelier",
    siteName: "Aura Coffee Atelier",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AURA COFFEE ATELIER | The Alchemical 3D Coffee Experience",
    description:
      "Experience our scroll-driven 3D coffee journey, interactive cup customizer, and artisanal brewing atelier.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} dark scroll-smooth`}>
      <body className="min-h-screen bg-[#070605] text-[#f7ede2] antialiased selection:bg-[#d97736] selection:text-white">
        {children}
      </body>
    </html>
  );
}
