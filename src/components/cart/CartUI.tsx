"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/Icon";
import { money, productUrl } from "@/lib/format";
import { MAX_QTY, useCart, type FavItem } from "./CartProvider";

export function Stepper({ value, onChange, label, max = MAX_QTY }: { value: number; onChange: (n: number) => void; label: string; max?: number }) {
  const [draft, setDraft] = useState(String(value));
  useEffect(() => setDraft(String(value)), [value]);
  return (
    <div className="stepper">
      <button type="button" onClick={() => onChange(value - 1)} disabled={value <= 1} aria-label="რაოდენობის შემცირება">
        −
      </button>
      <input
        type="number"
        inputMode="numeric"
        min={1}
        max={max}
        value={draft}
        aria-label={`რაოდენობა: ${label}`}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={() => onChange(Number(draft))}
        onKeyDown={(e) => e.key === "Enter" && onChange(Number(draft))}
      />
      <button type="button" onClick={() => onChange(value + 1)} disabled={value >= max} aria-label="რაოდენობის გაზრდა">
        +
      </button>
    </div>
  );
}

export function AddToCart({ item, size }: { item: FavItem; size?: "lg" }) {
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const max = Math.min(MAX_QTY, item.max ?? MAX_QTY);
  const clamp = (n: number) => Math.min(max, Math.max(1, Math.floor(n) || 1));
  if (size === "lg")
    return (
      <div className="product-purchase-actions">
        <div className="product-quantity-control">
          <button type="button" onClick={() => setQty(clamp(qty - 1))} disabled={qty <= 1} aria-label="რაოდენობის შემცირება">
            −
          </button>
          <input
            type="number"
            inputMode="numeric"
            min={1}
            max={max}
            value={qty}
            aria-label="პროდუქტის რაოდენობა"
            onChange={(e) => setQty(clamp(Number(e.target.value)))}
          />
          <button type="button" onClick={() => setQty(clamp(qty + 1))} disabled={qty >= max} aria-label="რაოდენობის გაზრდა">
            +
          </button>
        </div>
        <button type="button" className="button accent product-add" onClick={() => add(item, qty)}>
          <Icon name="cart" />
          კალათაში დამატება
        </button>
      </div>
    );
  return (
    <div className="purchase">
      <Stepper value={qty} onChange={(n) => setQty(clamp(n))} label={item.name} max={max} />
      <button
        type="button"
        className="add add-icon"
        onClick={() => add(item, qty)}
        aria-label={`${item.name}: კალათაში დამატება`}
        title="კალათაში დამატება"
      >
        <Icon name="cart" />
      </button>
    </div>
  );
}

export function FavButton({ item, className = "heart" }: { item: FavItem; className?: string }) {
  const { isFav, toggleFav } = useCart();
  const liked = isFav(item.id);
  return (
    <button
      type="button"
      className={liked ? `${className} liked` : className}
      aria-pressed={liked}
      aria-label={`${item.name}: სურვილების სიაში`}
      onClick={() => toggleFav(item)}
    >
      <Icon name="heart" />
    </button>
  );
}

export function HeaderCounters() {
  const { count, favs, setDrawerOpen } = useCart();
  return (
    <div className="header-actions">
      <Link className="icon-button badge-button" href="/favorites" aria-label="რჩეულები">
        <Icon name="heart" />
        {favs.length > 0 && <span className="count-badge">{favs.length}</span>}
      </Link>
      <Link className="icon-button account-button" href="/contact" aria-label="კონსულტაციის მოთხოვნა">
        <Icon name="user" />
      </Link>
      <button type="button" className="cart-toggle" onClick={() => setDrawerOpen(true)} aria-label="კალათა">
        <span className="badge-button">
          <Icon name="cart" />
          {count > 0 && <span className="count-badge">{count}</span>}
        </span>
        <span className="cart-label">კალათა</span>
      </button>
    </div>
  );
}

/** One-click add used by the compact product card. */
export function QuickAdd({ item }: { item: FavItem }) {
  const { add } = useCart();
  return (
    <button
      type="button"
      className="quote-add icon-button accent"
      onClick={() => add(item, 1)}
      aria-label={`${item.name}: კალათაში დამატება`}
      title="კალათაში დამატება"
    >
      <Icon name="plus" />
    </button>
  );
}

export function CartDrawer() {
  const { lines, count, total, drawerOpen, setDrawerOpen, setQty, remove } = useCart();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!drawerOpen) return;
    const prev = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setDrawerOpen(false);
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
      prev?.focus();
    };
  }, [drawerOpen, setDrawerOpen]);

  return (
    <>
      <div className={drawerOpen ? "overlay open" : "overlay"} onClick={() => setDrawerOpen(false)} />
      <aside className={drawerOpen ? "drawer open" : "drawer"} role="dialog" aria-modal="true" aria-label="თქვენი კალათა" inert={!drawerOpen}>
        <div className="drawerhead">
          <h2>
            თქვენი კალათა <span className="muted">({count})</span>
          </h2>
          <button ref={closeRef} className="close" onClick={() => setDrawerOpen(false)} aria-label="დახურვა">
            <Icon name="close" />
          </button>
        </div>
        <div className="cart-list">
          {lines.length === 0 ? (
            <div className="empty empty-plain">
              <Icon name="cart" />
              <h3>თქვენი კალათა ცარიელია</h3>
              <p>შეარჩიეთ პროდუქცია და დაამატეთ კალათაში.</p>
              <Link className="primary" href="/catalog" onClick={() => setDrawerOpen(false)}>
                კატალოგის ნახვა
              </Link>
            </div>
          ) : (
            lines.map((l) => (
              <div className="cart-item" key={l.id}>
                <div className="cart-thumb">
                  {l.image && <Image src={l.image} alt="" width={72} height={72} />}
                </div>
                <div>
                  <h3>
                    <Link href={productUrl(l.slug)} onClick={() => setDrawerOpen(false)}>
                      {l.name}
                    </Link>
                  </h3>
                  <span className="price">{money(l.price * l.qty)} ₾</span>
                  <div className="cart-controls">
                    <Stepper value={l.qty} onChange={(n) => setQty(l.id, n)} label={l.name} max={l.max} />
                    {l.price > 0 && <span className="muted small">{money(l.price)} ₾ / ც.</span>}
                  </div>
                </div>
                <button className="remove" onClick={() => remove(l.id)} aria-label={`${l.name}: წაშლა`}>
                  <Icon name="trash" />
                </button>
              </div>
            ))
          )}
        </div>
        {lines.length > 0 && (
          <div className="cartfoot">
            <div className="total">
              <span>ჯამური ღირებულება</span>
              <strong>{money(total)} ₾</strong>
            </div>
            <div className="drawer-actions">
              <Link className="secondary" href="/cart" onClick={() => setDrawerOpen(false)}>
                კალათის ნახვა
              </Link>
              <Link className="primary" href="/checkout" onClick={() => setDrawerOpen(false)}>
                გაფორმება <Icon name="arrow" />
              </Link>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}

export function Toast() {
  const { toast } = useCart();
  return (
    <div className={toast ? "toast show" : "toast"} role="status" aria-live="polite">
      {toast}
    </div>
  );
}
