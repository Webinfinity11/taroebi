import type { Content } from "@/lib/content-schema";

/** Slugs are fixed and match the order of the admin-editable items. */
export const serviceSlugs = ["assembly", "store-planning"] as const;

export type Service = { slug: string; title: string; text: string; paragraphs: string[]; image: string };

export const serviceUrl = (slug: string) => `/services/${slug}`;

export function getServices(content: Content["services"]): Service[] {
  return serviceSlugs.map((slug, i) => {
    const it = content.items[i] ?? { title: "", text: "", image: "" };
    return {
      slug,
      title: it.title,
      text: it.text,
      image: it.image,
      paragraphs: it.text.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean),
    };
  });
}
