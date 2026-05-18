import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(str: string): string {
  return str
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function formatDate(
  date: Date | string,
  opts?: Intl.DateTimeFormatOptions
): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    ...opts,
  }).format(new Date(date));
}

export function formatCurrency(
  amount: number | string,
  currency = "BRL"
): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency,
  }).format(Number(amount));
}

export function readingTime(content: string | object): number {
  const text =
    typeof content === "string" ? content : JSON.stringify(content);
  const words = text.split(/\s+/).length;
  return Math.ceil(words / 200);
}

export function excerpt(text: string, maxLength = 160): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).replace(/\s+\S*$/, "") + "…";
}

export function absoluteUrl(path: string): string {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.NEXTAUTH_URL ??
    "http://localhost:3000";
  return `${base.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
}
