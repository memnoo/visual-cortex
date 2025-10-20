import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import Link from "next/link";
import Image from "next/image";

import { Providers } from "../providers";
import Footer from "./components/Footer";
import brandImg from "@/assets/img/brand-img.svg";

import "../styles/globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Memnō",
  description: "Learning app by memorization, AI-augmented",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <main
            className="flex flex-col items-center justify-center p-8 bg-gradient-to-br from-indigo-50 to-blue-100"
            style={{ minHeight: "calc(100vh - 89px)" }}
          >
            <div className="max-w-4xl w-full text-center space-y-4">
              <Link href="/" className="inline-block mb-6">
                <Image
                  className="mx-auto"
                  src={brandImg}
                  alt="Memnō brand image"
                  height="160"
                />
              </Link>
            </div>
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
