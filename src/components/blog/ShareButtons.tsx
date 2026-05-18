"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Link2, Check } from "lucide-react";

interface ShareButtonsProps {
  title: string;
  url: string;
}

export function ShareButtons({ title, url }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success("Link copiado!");
    setTimeout(() => setCopied(false), 2000);
  }

  const encoded = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const links = [
    {
      label: "WhatsApp",
      href: `https://wa.me/?text=${encodedTitle}%20${encoded}`,
      bg: "bg-green-500 hover:bg-green-600",
      icon: "📱",
    },
    {
      label: "Facebook",
      href: `https://facebook.com/sharer/sharer.php?u=${encoded}`,
      bg: "bg-blue-600 hover:bg-blue-700",
      icon: "📘",
    },
    {
      label: "X (Twitter)",
      href: `https://x.com/intent/tweet?text=${encodedTitle}&url=${encoded}`,
      bg: "bg-stone-900 hover:bg-stone-800",
      icon: "𝕏",
    },
  ];

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <span className="text-sm font-semibold text-stone-600">Compartilhar:</span>
      {links.map((l) => (
        <a
          key={l.label}
          href={l.href}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-white text-sm font-medium transition-colors ${l.bg}`}
        >
          <span>{l.icon}</span> {l.label}
        </a>
      ))}
      <button
        onClick={copyLink}
        className="flex items-center gap-2 px-4 py-2 rounded-full border border-stone-300 text-stone-600 text-sm font-medium hover:bg-stone-50 transition-colors"
      >
        {copied ? <Check className="h-4 w-4 text-green-500" /> : <Link2 className="h-4 w-4" />}
        Copiar link
      </button>
    </div>
  );
}
