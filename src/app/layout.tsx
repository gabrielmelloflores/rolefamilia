import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Rolê Família | Blog de Viagens pelo Mundo",
    template: "%s | Rolê Família",
  },
  description:
    "Viajamos pelo mundo em família e compartilhamos roteiros, dicas e experiências para você se inspirar. Destinos no Brasil e no mundo.",
  keywords: ["blog de viagem", "viagem em família", "roteiros de viagem", "dicas de viagem", "turismo"],
  authors: [{ name: "Rolê Família" }],
  creator: "Rolê Família",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "Rolê Família",
    title: "Rolê Família | Blog de Viagens pelo Mundo",
    description: "Viajamos pelo mundo em família e compartilhamos roteiros, dicas e experiências.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rolê Família | Blog de Viagens pelo Mundo",
    description: "Viajamos pelo mundo em família e compartilhamos roteiros, dicas e experiências.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${inter.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background">
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
