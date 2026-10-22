import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Icon } from "@/components/Icon";
import { Listing, ListingSkeleton, ShopBanner } from "@/components/Listing";
import { getContent } from "@/lib/content";

export const metadata: Metadata = { title: "კატალოგი", alternates: { canonical: "/catalog" } };

async function CatalogHead({ searchParams }: PageProps<"/catalog">) {
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q : "";
  const sale = sp.sale === "1";
  const { home } = await getContent();
  return (
    <ShopBanner
      eyebrow={home.catalogEyebrow}
      title={q ? `ძიება: „${q}“` : sale ? "ფასდაკლებული პროდუქცია" : "პროდუქციის კატალოგი"}
      text={home.heroText}
      image={home.heroImage}
    />
  );
}

async function CatalogBody({ searchParams }: PageProps<"/catalog">) {
  const sp = (await searchParams) as Record<string, string | undefined>;
  return <Listing base="/catalog" sp={sp} />;
}

export default function CatalogPage(props: PageProps<"/catalog">) {
  return (
    <div className="shop-page">
      <div className="shop-shell">
        <nav className="shop-breadcrumb" aria-label="გვერდის მდებარეობა">
          <Link href="/">მთავარი</Link>
          <Icon name="chevron" />
          <span aria-current="page">კატალოგი</span>
        </nav>
        <Suspense fallback={<ShopBanner eyebrow="" title="პროდუქციის კატალოგი" />}>
          <CatalogHead {...props} />
        </Suspense>
        <Suspense fallback={<ListingSkeleton />}>
          <CatalogBody {...props} />
        </Suspense>
      </div>
    </div>
  );
}
