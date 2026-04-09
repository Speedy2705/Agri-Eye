"use client";

import Navbar from "@/components/dashboard/Navbar";
import RouteTransition from "@/components/dashboard/RouteTransition";
import LanguageTransition from "@/components/dashboard/LanguageTransition";

export default function MainContentShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="main-content flex-1 transition-all duration-300 relative">
      <Navbar />
      <main
        className="relative z-20 min-h-screen w-full bg-transparent p-3 pb-8 sm:p-4 md:p-6 md:pb-6"
        style={{ scrollPaddingTop: "80px" }}
      >
        <LanguageTransition>
          <RouteTransition>{children}</RouteTransition>
        </LanguageTransition>
      </main>
    </div>
  );
}
