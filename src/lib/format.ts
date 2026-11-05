import type { ColorOption } from "@/db/schema";

export const money = (n: number) => n.toFixed(2);

/** What the customer chooses from: the product's own color first (main photo and price), then its variations. */
export function colorChoices(p: { color: string | null; colorHex: string | null; colorOptions: ColorOption[]; images: string[] }): ColorOption[] {
  if (!p.colorOptions.length) return [];
  const own = p.color?.toLowerCase();
  if (!own || p.colorOptions.some((c) => c.name.toLowerCase() === own)) return p.colorOptions;
  return [{ name: p.color!, hex: p.colorHex ?? "#ffffff", image: p.images[0] ?? null, price: null, isMain: true }, ...p.colorOptions];
}

export const finalPrice = (p: { price: number; salePrice: number | null }) => p.salePrice ?? p.price;

export const discount = (p: { price: number; salePrice: number | null }) =>
  p.salePrice && p.price ? Math.round((1 - p.salePrice / p.price) * 100) : 0;

export const productUrl = (slug: string) => `/product/${encodeURIComponent(slug)}`;
export const categoryUrl = (slug: string) => `/category/${encodeURIComponent(slug)}`;

/** Units a shopper may put in the cart: tracked stock, or the general cap. */
export const maxQty = (stockQty: number | null | undefined) => (stockQty == null ? 999 : Math.max(0, stockQty));

export const LOW_STOCK = 5;
