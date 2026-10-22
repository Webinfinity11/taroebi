"use client";

import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/Icon";
import { useCart } from "@/components/cart/CartProvider";
import { useSite } from "@/components/SiteProvider";
import { money, productUrl } from "@/lib/format";

export function CartPage() {
  const { lines, count, total, setQty, remove, clear } = useCart();
  const site = useSite();

  return (
    <>
      <div className="cart-title-row">
        <div>
          <span className="cart-eyebrow">თქვენი არჩევანი</span>
          <h1>
            კალათა <span>{count}</span>
          </h1>
        </div>
        <Link className="cart-back-link" href="/catalog">
          <Icon name="arrow" className="flip" />
          კატალოგში დაბრუნება
        </Link>
      </div>

      {lines.length === 0 ? (
        <section className="cart-empty-state" aria-labelledby="cart-empty-title">
          <span className="cart-empty-icon">
            <Icon name="cart" />
          </span>
          <h2 id="cart-empty-title">თქვენი კალათა ჯერ ცარიელია</h2>
          <p>
            შეარჩიეთ აღჭურვილობა და შექმენით
            <br />
            თქვენი სივრცისთვის საჭირო პროდუქტების სია.
          </p>
          <div className="cart-empty-actions">
            <Link className="button accent" href="/catalog">
              პროდუქციის ნახვა <Icon name="arrow" />
            </Link>
          </div>
        </section>
      ) : (
        <div className="cart-layout">
          <section className="cart-products-box" aria-label="კალათაში დამატებული პროდუქტები">
            <div className="cart-list-heading">
              <span>პროდუქტი</span>
              <span>რაოდენობა</span>
            </div>
            {lines.map((l) => (
              <article className="cart-product" key={l.id}>
                <Link href={productUrl(l.slug)} aria-hidden="true" tabIndex={-1}>
                  {l.image && <Image src={l.image} alt="" width={126} height={134} />}
                </Link>
                <div className="cart-product-info">
                  <h3>
                    <Link href={productUrl(l.slug)}>{l.name}</Link>
                  </h3>
                  <span>{l.price > 0 ? `${money(l.price)} ₾ / ცალი` : "ფასი მოთხოვნით"}</span>
                  <p className="cart-product-price">{l.price > 0 ? `${money(l.price * l.qty)} ₾` : "—"}</p>
                </div>
                <div className="cart-quantity">
                  <button type="button" onClick={() => setQty(l.id, l.qty - 1)} disabled={l.qty <= 1} aria-label="რაოდენობის შემცირება">
                    −
                  </button>
                  <input
                    type="number"
                    inputMode="numeric"
                    min={1}
                    max={l.max ?? 999}
                    value={l.qty}
                    aria-label={`რაოდენობა: ${l.name}`}
                    onChange={(e) => setQty(l.id, Number(e.target.value))}
                  />
                  <button type="button" onClick={() => setQty(l.id, l.qty + 1)} disabled={l.max != null && l.qty >= l.max} aria-label="რაოდენობის გაზრდა">
                    +
                  </button>
                </div>
                <button type="button" data-cart-remove onClick={() => remove(l.id)} aria-label={`${l.name}: წაშლა`}>
                  <Icon name="trash" />
                </button>
              </article>
            ))}
            <div className="cart-list-bottom">
              <Link className="cart-back-link" href="/catalog">
                <Icon name="arrow" className="flip" />
                შერჩევის გაგრძელება
              </Link>
              <button className="cart-clear" type="button" onClick={clear}>
                კალათის გასუფთავება
              </button>
            </div>
          </section>

          <aside className="cart-summary" aria-labelledby="cart-summary-title">
            <span className="cart-summary-kicker">ყველაფერი ერთ სივრცეში</span>
            <h2 id="cart-summary-title">თქვენი სია</h2>
            <dl>
              <div>
                <dt>პროდუქტის სახეობა</dt>
                <dd>{lines.length}</dd>
              </div>
              <div>
                <dt>სულ რაოდენობა</dt>
                <dd>{count} ცალი</dd>
              </div>
              <div>
                <dt>მიწოდება</dt>
                <dd>{total >= site.freeDeliveryFrom ? "უფასო" : "დაზუსტდება"}</dd>
              </div>
            </dl>
            <div className="cart-summary-price">
              <span>ჯამური ღირებულება</span>
              <strong>{total > 0 ? `${money(total)} ₾` : "ფასი მოთხოვნით"}</strong>
              <p>{total >= site.freeDeliveryFrom ? "მიწოდება თბილისში უფასოა." : `უფასო მიწოდება ${site.freeDeliveryFrom} ₾-დან შეკვეთაზე.`}</p>
            </div>
            <Link className="button accent" href="/checkout">
              შეკვეთის გაფორმება <Icon name="arrow" />
            </Link>
            <p className="cart-summary-note">გადახდა შეკვეთის დადასტურების შემდეგ — ნაღდით მიწოდებისას ან გადარიცხვით.</p>
            <div className="cart-summary-help">
              <Icon name="user" />
              <div>
                <strong>გჭირდებათ დახმარება?</strong>
                <a href={`tel:${site.phone}`}>{site.phoneLabel}</a>
              </div>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
