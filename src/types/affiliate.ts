export type AffiliateProvider = "BOOKING" | "HOLAFLY" | "SEGUROS_PROMO" | "OTHER";

export interface AffiliateLink {
  id: string;
  name: string;
  provider: AffiliateProvider;
  url: string;
  description?: string | null;
  clicks: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
