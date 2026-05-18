export type ProductType = "EBOOK" | "MAPA" | "BUNDLE";
export type OrderStatus = "PENDING" | "PAID" | "DELIVERED" | "EXPIRED" | "REFUNDED";

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  content?: Record<string, unknown> | null;
  type: ProductType;
  price: number | string;
  currency: string;
  coverImage: string;
  previewImages: string[];
  fileUrl?: string | null;
  fileName?: string | null;
  stripeProductId?: string | null;
  stripePriceId?: string | null;
  isPublished: boolean;
  isFeatured: boolean;
  seoTitle?: string | null;
  seoDesc?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Order {
  id: string;
  productId: string;
  product: Pick<Product, "id" | "name" | "slug" | "coverImage" | "type" | "fileName">;
  customerEmail: string;
  customerName?: string | null;
  stripeSessionId: string;
  stripePaymentId?: string | null;
  amount: number | string;
  currency: string;
  status: OrderStatus;
  downloadToken: string;
  downloadCount: number;
  maxDownloads: number;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}
