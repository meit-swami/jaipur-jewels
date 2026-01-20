import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({ 
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Jaipuri Jewels | Premium Collections",
  description: "Discover our exquisite collection of luxury jewellery. Handcrafted pieces that define elegance and sophistication.",
  keywords: ["luxury jewellery", "premium jewelry", "diamonds", "gold", "platinum", "handcrafted", "jaipuri jewels"],
  authors: [{ name: "Jaipuri Jewels" }],
  openGraph: {
    title: "Jaipuri Jewels",
    description: "Discover our exquisite collection of luxury jewellery",
    type: "website",
    locale: "en_US",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
  },
  manifest: "/manifest.json",
  themeColor: "#FAF8F3",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Jaipuri Jewels",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={inter.className}>
        <Providers>
          <Navbar />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
