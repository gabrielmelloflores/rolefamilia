export type PostStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  color?: string | null;
  createdAt: Date;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  createdAt: Date;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: Record<string, unknown>;
  coverImage: string;
  altText?: string | null;
  status: PostStatus;
  publishedAt?: Date | null;
  views: number;
  readingTime: number;
  seoTitle?: string | null;
  seoDesc?: string | null;
  ogImage?: string | null;
  destinationId?: string | null;
  destination?: {
    id: string;
    name: string;
    slug: string;
    country: string;
  } | null;
  categories: { category: Category }[];
  tags: { tag: Tag }[];
  createdAt: Date;
  updatedAt: Date;
}
