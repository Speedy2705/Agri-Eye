"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown, Globe, X } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { cn } from "@/lib/utils";

const languages = [
  { code: "en", native: "English", english: "English" },
  { code: "hi", native: "हिंदी", english: "Hindi" },
  { code: "mr", native: "मराठी", english: "Marathi" },
  { code: "te", native: "తెలుగు", english: "Telugu" },
  { code: "ta", native: "தமிழ்", english: "Tamil" },
  { code: "kn", native: "ಕನ್ನಡ", english: "Kannada" },
  { code: "gu", native: "ગુજરાતી", english: "Gujarati" },
  { code: "bn", native: "বাংলা", english: "Bengali" },
] as const;

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [panelPos, setPanelPos] = useState({ top: 0, right: 0, width: 320 });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const current = languages.find((item) => item.code === language) ?? languages[0];

  // SSR safety — only render portal after hydration
  useEffect(() => { setMounted(true); }, []);

  // Close on outside click and Escape — only when open
  useEffect(() => {
    if (!isOpen) return;
    const handleMouseDown = (e: MouseEvent) => {
      if (
        !triggerRef.current?.contains(e.target as Node) &&
        !panelRef.current?.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  // Close on scroll or resize — panel pos is a snapshot so it would drift
  useEffect(() => {
    if (!isOpen) return;
    const close = () => setIsOpen(false);
    window.addEventListener("scroll", close, true);
    window.addEventListener("resize", close);
    return () => {
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("resize", close);
    };
  }, [isOpen]);

  const handleOpen = () => {
    if (!isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const isMobileScreen = window.innerWidth < 768;
      setPanelPos({
        top: rect.bottom + 8,
        right: window.innerWidth - rect.right,
        width: isMobileScreen ? window.innerWidth - 32 : 320,
      });
    }
    setIsOpen((prev) => !prev);
  };

  return (
    <>
      {/* Trigger button */}
      <button
        ref={triggerRef}
        type="button"
        onClick={handleOpen}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-white/60 backdrop-blur-sm text-sm font-medium text-foreground hover:border-primary hover:bg-white/90 transition-all duration-200"
      >
        <Globe size={14} className="text-primary" />
        <span>{current.native}</span>
        <ChevronDown size={12} className="text-muted" />
      </button>

      {/* Portal — lifted to document.body to escape all stacking contexts */}
      {mounted && createPortal(
        <AnimatePresence>
          {isOpen && (
            <motion.div
              ref={panelRef}
              initial={{ opacity: 0, y: -8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="language-panel-portal"
              style={{
                position: "fixed",
                top: `${panelPos.top}px`,
                right: `${panelPos.right}px`,
                width: `${panelPos.width}px`,
                zIndex: 99999,
                background: "rgba(255, 255, 255, 0.92)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                border: "1px solid rgba(200, 230, 201, 0.8)",
                borderRadius: "20px",
                padding: "16px",
                boxShadow: "0 8px 32px rgba(45,106,79,0.12), 0 2px 8px rgba(45,106,79,0.06)",
              }}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-muted uppercase tracking-wider">
                  Select Language
                </span>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-0.5 rounded hover:bg-surface transition-colors"
                >
                  <X size={14} className="text-muted hover:text-foreground" />
                </button>
              </div>

              {/* Language grid */}
              <div className="grid grid-cols-2 gap-2">
                {languages.map((lang) => {
                  const selected = lang.code === language;
                  return (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => {
                        setLanguage(lang.code);
                        setIsOpen(false);
                      }}
                      className={cn(
                        "flex flex-col items-start px-3 py-2.5 rounded-xl border text-left transition-all duration-150",
                        selected
                          ? "border-primary bg-primary/10 shadow-sm"
                          : "border-border bg-white/50 hover:border-primary/50 hover:bg-surface"
                      )}
                    >
                      <span className="text-sm font-semibold text-foreground leading-tight">
                        {lang.native}
                      </span>
                      <span className="text-[11px] text-muted mt-0.5">{lang.english}</span>
                      {selected && (
                        <span className="mt-1 text-[10px] font-medium text-primary flex items-center gap-1">
                          <Check size={10} /> Active
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Footer */}
              <p className="text-[10px] text-muted text-center mt-3 pt-3 border-t border-border">
                🌿 All farm data stays the same — only UI language changes
              </p>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}
