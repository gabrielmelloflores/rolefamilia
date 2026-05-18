export const BRAZIL_REGIONS = [
  { slug: "norte", name: "Norte", icon: "🌿", states: ["AM", "PA", "AC", "RO", "RR", "AP", "TO"] },
  { slug: "nordeste", name: "Nordeste", icon: "🌊", states: ["BA", "SE", "AL", "PE", "PB", "RN", "CE", "PI", "MA"] },
  { slug: "centro-oeste", name: "Centro-Oeste", icon: "🌾", states: ["MT", "MS", "GO", "DF"] },
  { slug: "sudeste", name: "Sudeste", icon: "🏙", states: ["SP", "RJ", "MG", "ES"] },
  { slug: "sul", name: "Sul", icon: "🏔", states: ["PR", "SC", "RS"] },
] as const;

export const CONTINENTS = [
  { slug: "america-do-sul", name: "América do Sul", enum: "AMERICA_DO_SUL", icon: "🌎" },
  { slug: "america-do-norte", name: "América do Norte", enum: "AMERICA_DO_NORTE", icon: "🌎" },
  { slug: "america-central", name: "América Central", enum: "AMERICA_CENTRAL", icon: "🌎" },
  { slug: "europa", name: "Europa", enum: "EUROPA", icon: "🌍" },
  { slug: "africa", name: "África", enum: "AFRICA", icon: "🌍" },
  { slug: "asia", name: "Ásia", enum: "ASIA", icon: "🌏" },
  { slug: "oceania", name: "Oceania", enum: "OCEANIA", icon: "🌏" },
  { slug: "oriente-medio", name: "Oriente Médio", enum: "ORIENTE_MEDIO", icon: "🌍" },
] as const;

export const DIFFICULTY_LABELS = {
  FACIL: { label: "Fácil", color: "bg-green-100 text-green-800" },
  MODERADO: { label: "Moderado", color: "bg-yellow-100 text-yellow-800" },
  DIFICIL: { label: "Difícil", color: "bg-red-100 text-red-800" },
} as const;

export const MEAL_LABELS = {
  CAFE_DA_MANHA: { label: "Café da manhã", icon: "☕" },
  ALMOCO: { label: "Almoço", icon: "🍽" },
  JANTAR: { label: "Jantar", icon: "🍷" },
} as const;

export const PRODUCT_TYPE_LABELS = {
  EBOOK: { label: "E-book", icon: "📖", color: "bg-blue-100 text-blue-800" },
  MAPA: { label: "Mapa", icon: "🗺", color: "bg-purple-100 text-purple-800" },
  BUNDLE: { label: "Bundle", icon: "📦", color: "bg-orange-100 text-orange-800" },
} as const;

export const AFFILIATE_PROVIDER_LABELS = {
  BOOKING: { label: "Booking.com", color: "bg-blue-100 text-blue-800" },
  HOLAFLY: { label: "Holafly", color: "bg-orange-100 text-orange-800" },
  SEGUROS_PROMO: { label: "Seguros Promo", color: "bg-teal-100 text-teal-800" },
  OTHER: { label: "Outro", color: "bg-stone-100 text-stone-800" },
} as const;

export const NAV_LINKS = [
  { href: "/blog", label: "Blog" },
  { href: "/roteiros", label: "Roteiros" },
  { href: "/loja", label: "Loja" },
  { href: "/sobre", label: "Sobre" },
] as const;

export const POSTS_PER_PAGE = 12;
export const PRODUCTS_PER_PAGE = 12;
export const ITINERARIES_PER_PAGE = 12;
