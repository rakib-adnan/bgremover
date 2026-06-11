import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Providers } from "./providers";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BG Remover — Free AI Background Removal Tool | Remove Background Online",
  description: "Remove image backgrounds instantly with AI. 100% free, no watermarks, no sign-up required. Get 3 free HD downloads daily. Works on photos, products, portraits & more.",
  keywords: "background remover, remove background free, AI background removal, transparent background, photo editor online, remove bg",
  authors: [{ name: "BG Remover" }],
  openGraph: {
    title: "BG Remover — Free AI Background Removal Tool",
    description: "Remove image backgrounds instantly. Free, no watermarks, no sign-up needed.",
    type: "website",
    url: "https://bgremover-ten-vert.vercel.app",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "BG Remover — Free AI Background Removal",
    description: "Remove backgrounds from images instantly. Free, no watermarks.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geist.className} bg-[#0a0a14] text-white`}>
        <Providers>
          <Navbar />
          <main className="pt-16">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
