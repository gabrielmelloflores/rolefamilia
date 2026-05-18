export type Difficulty = "FACIL" | "MODERADO" | "DIFICIL";
export type Meal = "CAFE_DA_MANHA" | "ALMOCO" | "JANTAR";

export interface Activity {
  name: string;
  description?: string;
  duration?: string;
  isOptional?: boolean;
}

export interface ItineraryDay {
  id: string;
  itineraryId: string;
  dayNumber: number;
  title: string;
  description?: Record<string, unknown> | null;
  accommodation?: string | null;
  accommodationUrl?: string | null;
  meals: Meal[];
  activities?: Activity[] | null;
  images: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Itinerary {
  id: string;
  title: string;
  slug: string;
  coverImage: string;
  summary: string;
  duration: number;
  difficulty: Difficulty;
  priceFrom: number | string;
  currency: string;
  highlights: string[];
  overview?: Record<string, unknown> | null;
  included: string[];
  notIncluded: string[];
  howToGetThere?: Record<string, unknown> | null;
  meetingPoint?: string | null;
  destinationId?: string | null;
  destination?: {
    id: string;
    name: string;
    slug: string;
    country: string;
  } | null;
  days: ItineraryDay[];
  isPublished: boolean;
  isFeatured: boolean;
  seoTitle?: string | null;
  seoDesc?: string | null;
  createdAt: Date;
  updatedAt: Date;
}
