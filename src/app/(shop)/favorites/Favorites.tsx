"use client";

import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/Icon";
import { useCart } from "@/components/cart/CartProvider";
import { FavButton, QuickAdd } from "@/components/cart/CartUI";
import { money, productUrl } from "@/lib/format";

export function Favorites() {
  const { favs } = useCart();
  if (!favs.length)
    return (
      <div className="empty-state" style={{ marginBottom: 60 }}>
        <Icon name="heart" />
        <h3>თქვენი სია ჯერ ცარიელია</h3>
        <p>მონიშნეთ სასურველი პროდუქტი გულის ღილაკით.</p>
        <Link className="button accent" href="/catalog">
          კატალოგის ნახვა
        </Link>
      </div>
    );
  return (
    <div className="product-grid" style={{ paddingBottom: 60 }}>
      {favs.map((p) => (
        <article className="product-card" key={p.id}>
          <Link href={productUrl(p.slug)} className="product-media" tabIndex={-1} aria-hidden="true">
            {p.image ? <Image src={p.image} alt="" width={400} height={400} sizes="300px" /> : <span className="noimg">ფოტო არ არის</span>}
          </Link>
          <FavButton item={p} className="favorite-button" />
          <h3 className="product-title">
            <Link href={productUrl(p.slug)}>{p.name}</Link>
          </h3>
          <div className="product-bottom">
            {p.price > 0 ? <span className="product-price">{money(p.price)} ₾</span> : <span className="price-request-label">ფასის მოთხოვნა</span>}
            <QuickAdd item={p} />
          </div>
        </article>
      ))}
    </div>
  );
}
