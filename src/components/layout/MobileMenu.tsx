"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight } from "lucide-react";
import { NAV_LINKS } from "@/lib/constants";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
}

export function MobileMenu({ open, onClose }: MobileMenuProps) {
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-stone-900/50 backdrop-blur-sm z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 bottom-0 w-80 bg-white z-50 flex flex-col shadow-2xl"
          >
            <div className="flex items-center justify-between p-5 border-b border-stone-100">
              <span className="font-bold text-stone-900">Menu</span>
              <button onClick={onClose} className="p-2 rounded-lg hover:bg-stone-100 transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto p-5 space-y-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={onClose}
                  className="flex items-center justify-between px-4 py-3 rounded-xl text-stone-700 hover:bg-amber-50 hover:text-amber-700 transition-colors font-medium"
                >
                  {link.label}
                  <ChevronRight className="h-4 w-4 opacity-50" />
                </Link>
              ))}
            </nav>

            <div className="p-5 border-t border-stone-100">
              <a
                href="https://youtube.com/@rolefamilia"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors"
              >
                ▶ Ver Canal no YouTube
              </a>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
