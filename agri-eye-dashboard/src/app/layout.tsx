import type { Metadata } from "next";
import { Sora } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/dashboard/Sidebar";
import Navbar from "@/components/dashboard/Navbar";
import RouteTransition from "@/components/dashboard/RouteTransition";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Agri-Eye | Smart Farm Surveillance",
  description: "Smart Farm Surveillance Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={sora.variable}>
      <body className="font-sora antialiased">
        <div className="flex h-screen bg-background overflow-hidden">
          <Sidebar />
          <div className="flex-1 flex flex-col overflow-hidden">
            <Navbar />
            <main className="flex-1 overflow-y-auto p-3 sm:p-4 pb-20 md:p-6 md:pb-6">
              <RouteTransition>{children}</RouteTransition>
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}

