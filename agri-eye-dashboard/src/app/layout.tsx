import type { Metadata } from "next";
import {
  Noto_Sans_Bengali,
  Noto_Sans_Devanagari,
  Noto_Sans_Kannada,
  Noto_Sans_Tamil,
  Noto_Sans_Telugu,
  Sora,
} from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/dashboard/Sidebar";
import Navbar from "@/components/dashboard/Navbar";
import RouteTransition from "@/components/dashboard/RouteTransition";
import LanguageTransition from "@/components/dashboard/LanguageTransition";
import { LanguageProvider } from "@/lib/LanguageContext";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
});

const notoDevanagari = Noto_Sans_Devanagari({
  subsets: ["devanagari"],
  variable: "--font-noto-devanagari",
  display: "swap",
});

const notoTelugu = Noto_Sans_Telugu({
  subsets: ["telugu"],
  variable: "--font-noto-telugu",
  display: "swap",
});

const notoTamil = Noto_Sans_Tamil({
  subsets: ["tamil"],
  variable: "--font-noto-tamil",
  display: "swap",
});

const notoKannada = Noto_Sans_Kannada({
  subsets: ["kannada"],
  variable: "--font-noto-kannada",
  display: "swap",
});

const notoBengali = Noto_Sans_Bengali({
  subsets: ["bengali"],
  variable: "--font-noto-bengali",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Agri-Eye | Mango Farm",
  description: "Smart Farm Surveillance Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${sora.variable} ${notoDevanagari.variable} ${notoTelugu.variable} ${notoTamil.variable} ${notoKannada.variable} ${notoBengali.variable}`}
    >
      <body className="font-sora antialiased">
        <LanguageProvider>
          <div className="flex h-screen bg-transparent overflow-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
              <Navbar />
              <main className="flex-1 overflow-y-auto bg-transparent p-3 pb-20 sm:p-4 md:p-6 md:pb-6">
                <LanguageTransition>
                  <RouteTransition>{children}</RouteTransition>
                </LanguageTransition>
              </main>
            </div>
          </div>
        </LanguageProvider>
      </body>
    </html>
  );
}

