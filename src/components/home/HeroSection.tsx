"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface HeroSectionProps {
  coverImage?: string;
}

export function HeroSection({ coverImage }: HeroSectionProps) {
  const bg = coverImage ?? "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1600&q=80";

  return (
    <section className="relative h-screen min-h-[600px] flex flex-col items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${bg})` }}
      />
      <div className="hero-overlay absolute inset-0" />

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-amber-400 text-sm font-semibold uppercase tracking-widest mb-4"
        >
          Canal do YouTube
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.7 }}
          className="font-heading text-5xl sm:text-6xl lg:text-7xl text-white leading-tight mb-6"
        >
          Explore o mundo com a nossa família
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="text-stone-200 text-lg sm:text-xl max-w-2xl mx-auto mb-10"
        >
          Roteiros detalhados, dicas honestas e produtos digitais para tornar a sua viagem em família inesquecível.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/destinos"
            className="px-8 py-4 rounded-full bg-amber-500 text-stone-900 font-bold text-base hover:bg-amber-400 transition-colors shadow-lg"
          >
            Ver Destinos
          </Link>
          <a
            href="https://youtube.com/@rolefamilia"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 rounded-full border-2 border-white text-white font-bold text-base hover:bg-white hover:text-stone-900 transition-colors"
          >
            ▶ Nosso Canal
          </a>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/70 animate-bounce"
      >
        <ChevronDown className="h-6 w-6" />
      </motion.div>
    </section>
  );
}
