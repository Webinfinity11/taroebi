import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Icon } from "@/components/Icon";
import { Listing, ListingSkeleton, ShopBanner } from "@/components/Listing";
import { getCategory, getCategoryTree } from "@/lib/data";
import { categoryUrl } from "@/lib/format";
import { getContent } from "@/lib/content";
import { site } from "@/lib/site";

const slugOf = async (params: PageProps<"/category/[slug]">["params"]) => decodeURIComponent((await params).slug);

export async function generateStaticParams() {
  return (await getCategoryTree()).map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/category/[slug]">): Promise<Metadata> {
  const found = await getCategory(await slugOf(params));
  if (!found) return {};
  const { category } = found;
  return {
    title: category.name,
    description: category.description || `${category.name} — ${category.count} პროდუქტი ${site.name}-ზე.`,
    alternates: { canonical: categoryUrl(category.slug) },
  };
}

async function CategoryContent({ params, searchParams }: PageProps<"/category/[slug]">) {
  const [found, { home }] = await Promise.all([getCategory(await slugOf(params)), getContent()]);
  if (!found) notFound();
  const { category, trail, descendantIds } = found;
  const sp = (await searchParams) as Record<string, string | undefined>;
  return (
    <>
      <nav className="shop-breadcrumb" aria-label="გვერდის მდებარეობა">
        <Link href="/">მთავარი</Link>
        <Icon name="chevron" />
        <Link href="/catalog">კატალოგი</Link>
        {trail.map((c) => (
          <span key={c.id} style={{ display: "contents" }}>
            <Icon name="chevron" />
            {c.id === category.id ? <span aria-current="page">{c.name}</span> : <Link href={categoryUrl(c.slug)}>{c.name}</Link>}
          </span>
        ))}
      </nav>
      <ShopBanner
        eyebrow={trail.length > 1 ? trail[0].name : home.catalogEyebrow}
        title={category.name}
        text={category.description || `${category.count} პროდუქტი`}
        image={category.image || home.heroImage}
      />
      <Listing base={categoryUrl(category.slug)} sp={sp} category={{ id: category.id, descendantIds }} subcategories={category.children} />
    </>
  );
}

export default function CategoryPage(props: PageProps<"/category/[slug]">) {
  return (
    <div className="shop-page">
      <div className="shop-shell">
        <Suspense fallback={<ListingSkeleton />}>
          <CategoryContent {...props} />
        </Suspense>
      </div>
    </div>
  );
}
