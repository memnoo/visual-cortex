import Link from "next/link";
import Image from "next/image";

import { Providers } from "../providers";
import { Footer } from "./components/Footer";

import brandImg from "@/assets/img/brand-img.svg";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
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
              priority
            />
          </Link>
        </div>
        {children}
      </main>
      <Footer />
    </Providers>
  );
}
