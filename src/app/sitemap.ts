import type { MetadataRoute } from "next";
import { getAllSlugs } from "@/lib/data";
import { categoryUrl, productUrl } from "@/lib/format";
import { serviceUrl, services } from "@/lib/services";
import { site } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { products, categories } = await getAllSlugs();
  return [
    { url: site.url, priority: 1 },
    { url: `${site.url}/catalog`, priority: 0.9 },
    { url: `${site.url}/services`, priority: 0.7 },
    ...services.map((x) => ({ url: site.url + serviceUrl(x.slug), priority: 0.6 })),
    ...categories.map((c) => ({ url: site.url + categoryUrl(c.slug), priority: 0.8 })),
    ...products.map((p) => ({ url: site.url + productUrl(p.slug), lastModified: p.updatedAt, priority: 0.6 })),
  ];
}
