export type Continent =
  | "AMERICA_DO_SUL"
  | "AMERICA_DO_NORTE"
  | "AMERICA_CENTRAL"
  | "EUROPA"
  | "AFRICA"
  | "ASIA"
  | "OCEANIA"
  | "ORIENTE_MEDIO";

export interface Destination {
  id: string;
  name: string;
  slug: string;
  country: string;
  countryCode: string;
  continent: Continent;
  region?: string | null;
  coverImage: string;
  description: string;
  content?: Record<string, unknown> | null;
  latitude?: number | null;
  longitude?: number | null;
  isPublished: boolean;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
}
