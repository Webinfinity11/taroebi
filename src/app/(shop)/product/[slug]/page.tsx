import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Icon } from "@/components/Icon";
import { AddToCart, FavButton } from "@/components/cart/CartUI";
import { Gallery } from "@/components/Gallery";
import { ProductCard, StockLabel } from "@/components/ProductCard";
import { ProductTabs } from "@/components/ProductTabs";
import { dimensions, getAllSlugs, getProduct } from "@/lib/data";
import { categoryUrl, discount, finalPrice, money, productUrl } from "@/lib/format";
import { getContent } from "@/lib/content";
import { site } from "@/lib/site";

const slugOf = async (params: PageProps<"/product/[slug]">["params"]) => decodeURIComponent((await params).slug);

export async function generateStaticParams() {
  return (await getAllSlugs()).products.slice(0, 100).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/product/[slug]">): Promise<Metadata> {
  const data = await getProduct(await slugOf(params));
  if (!data) return {};
  const { product } = data;
  const price = finalPrice(product);
  return {
    title: product.name,
    description: product.summary.slice(0, 160) || `${product.name}${price ? ` - ${money(price)} ₾` : ""}. შეუკვეთეთ ${site.name}-ზე.`,
    alternates: { canonical: productUrl(product.slug) },
    openGraph: { images: product.images.slice(0, 1) },
  };
}

async function ProductContent({ params }: PageProps<"/product/[slug]">) {
  const [data, { site: info, delivery }] = await Promise.all([getProduct(await slugOf(params)), getContent()]);
  if (!data) notFound();
  const { product, trail, related } = data;
  const price = finalPrice(product);
  const off = discount(product);
  const item = { id: product.id, name: product.name, slug: product.slug, price, image: product.images[0] ?? null, max: product.stockQty ?? undefined };
  const dims = dimensions(product);
  const attrs = [
    product.material && { label: "მასალა", value: product.material },
    product.color && { label: "ფერი", value: product.color },
    dims && { label: "ზომა (სიგ × სიმ × სიღ)", value: dims },
    product.loadKg != null && { label: "დატვირთვა თაროზე", value: `${product.loadKg} კგ` },
    product.shelfCount != null && { label: "თაროების რაოდენობა", value: String(product.shelfCount) },
    ...product.specs,
  ].filter((a): a is { label: string; value: string } => !!a);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    sku: product.sku ?? undefined,
    image: product.images,
    description: product.summary || product.description || undefined,
    offers:
      price > 0
        ? {
            "@type": "Offer",
            price: price.toFixed(2),
            priceCurrency: "GEL",
            availability: product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
            url: `${site.url}${productUrl(product.slug)}`,
          }
        : undefined,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <nav className="product-breadcrumbs" aria-label="გვერდის მდებარეობა">
        <Link href="/">მთავარი</Link>
        <Icon name="chevron" />
        <Link href="/catalog">კატალოგი</Link>
        {trail.map((c) => (
          <span key={c.id} style={{ display: "contents" }}>
            <Icon name="chevron" />
            <Link href={categoryUrl(c.slug)}>{c.name}</Link>
          </span>
        ))}
        <Icon name="chevron" />
        <span aria-current="page">{product.name}</span>
      </nav>

      <section className="product-overview" aria-labelledby="product-name">
        <Gallery images={product.images} name={product.name} badge={off > 0 ? `−${off}%` : null} />

        <div className="product-information">
          <div className="product-category-row">
            <span className="product-category-label">{trail.at(-1)?.name ?? "პროდუქცია"}</span>
            <FavButton item={item} className="icon-button product-save-button" />
          </div>
          <h1 id="product-name">{product.name}</h1>
          <p className="product-code">
            პროდუქტის კოდი: <span>{product.sku || "შეკვეთისას ზუსტდება"}</span>
          </p>
          {product.summary && <p className="product-summary">{product.summary}</p>}

          <div className="product-purchase-box">
            {price > 0 ? (
              <div className="product-price-heading">
                {money(price)} ₾{off > 0 && <s className="product-oldprice">{money(product.price)} ₾</s>}
              </div>
            ) : (
              <div className="product-price-heading">ფასი მოთხოვნით</div>
            )}
            <p className="product-price-note">
              <StockLabel inStock={product.inStock} stockQty={product.stockQty} />
              {price > 0 ? " · ფასი მოიცავს დღგ-ს." : " · ღირებულება და კომპლექტაცია ზუსტდება შეკვეთისას."}
            </p>
            {product.inStock ? (
              <>
                <span className="product-quantity-label">რაოდენობა</span>
                <AddToCart item={item} size="lg" />
                <p className="product-selection-note">დაამატეთ პროდუქტი კალათაში და გააფორმეთ შეკვეთა - მენეჯერი დაგიკავშირდებათ დასადასტურებლად.</p>
              </>
            ) : (
              <p className="product-selection-note">პროდუქტი ამჟამად მარაგში არ არის. დაგვიკავშირდით ვადების დასაზუსტებლად.</p>
            )}
          </div>

          <div className="product-assistance">
            <span className="product-assistance-icon">
              <Icon name="user" />
            </span>
            <div>
              <strong>გჭირდებათ დახმარება შერჩევაში?</strong>
              <p>
                დაგვირეკეთ: <a href={`tel:${info.phone}`}>{info.phoneLabel}</a> ან მოგვწერეთ <Link href="/contact">კონტაქტის გვერდიდან</Link>.
              </p>
            </div>
          </div>
        </div>
      </section>

      <ProductTabs
        description={product.description || product.summary}
        specs={attrs}
        delivery={delivery.sections.map((s) => ({ title: s.title, text: s.text }))}
      />

      {related.length > 0 && (
        <section className="product-related" aria-labelledby="related-title">
          <div className="product-related-heading">
            <h2 id="related-title">მსგავსი პროდუქტები</h2>
            <Link className="text-link" href="/catalog">
              ყველა პროდუქტი <Icon name="arrow" />
            </Link>
          </div>
          <div className="product-grid">
            {related.map((p) => (
              <ProductCard key={p.id} p={p} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}

export default function ProductPage(props: PageProps<"/product/[slug]">) {
  return (
    <div className="product-page">
      <Suspense fallback={<div className="product-overview" style={{ minHeight: 600 }} />}>
        <ProductContent {...props} />
      </Suspense>
    </div>
  );
}
