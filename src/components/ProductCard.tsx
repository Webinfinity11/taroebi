import Image from "next/image";
import Link from "next/link";
import { FavButton, QuickAdd } from "@/components/cart/CartUI";
import type { ProductCard as Card } from "@/lib/data";
import { LOW_STOCK, discount, finalPrice, money, productUrl } from "@/lib/format";

export function ProductCard({ p, priority }: { p: Card; priority?: boolean }) {
  const price = finalPrice(p);
  const off = discount(p);
  const item = { id: p.id, name: p.name, slug: p.slug, price, image: p.image, max: p.stockQty ?? undefined };
  const href = productUrl(p.slug);
  const meta = [p.dims, p.material, p.loadKg != null ? `${p.loadKg} კგ` : null].filter(Boolean);
  return (
    <article className="product-card">
      <Link href={href} className="product-media" tabIndex={-1} aria-hidden="true">
        {off > 0 && <span className="badge sale-badge">−{off}%</span>}
        {p.image ? (
          <Image src={p.image} alt="" width={400} height={400} sizes="(max-width: 600px) 45vw, (max-width: 1150px) 25vw, 320px" priority={priority} />
        ) : (
          <span className="noimg">ფოტო არ არის</span>
        )}
      </Link>
      <FavButton item={item} className="favorite-button" />
      <h3 className="product-title">
        <Link href={href}>{p.name}</Link>
      </h3>
      {(meta.length > 0 || !p.inStock) && (
        <p className="product-meta">
          {meta.length > 0 && <span>{meta.join(" · ")}</span>}
          <StockLabel inStock={p.inStock} stockQty={p.stockQty} compact />
        </p>
      )}
      <div className="product-bottom">
        {price > 0 ? (
          <span className="product-price">
            {money(price)} ₾{off > 0 && <span className="oldprice">{money(p.price)} ₾</span>}
          </span>
        ) : (
          <span className="price-request-label">ფასის მოთხოვნა</span>
        )}
        {p.inStock && <QuickAdd item={item} />}
      </div>
    </article>
  );
}

export function ProductGrid({ items }: { items: Card[] }) {
  return (
    <div className="products">
      {items.map((p, i) => (
        <ProductCard key={p.id} p={p} priority={i < 4} />
      ))}
    </div>
  );
}

export function StockLabel({ inStock, stockQty, compact }: { inStock: boolean; stockQty: number | null; compact?: boolean }) {
  if (!inStock) return <span className="stock out">არ არის მარაგში</span>;
  if (stockQty != null && stockQty <= LOW_STOCK) return <span className="stock low">დარჩა {stockQty} ც.</span>;
  if (compact) return null;
  return <span className="stock">მარაგშია</span>;
}
