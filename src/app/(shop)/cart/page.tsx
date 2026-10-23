import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/Icon";
import { ProductCard } from "@/components/ProductCard";
import { getHomeProducts } from "@/lib/data";
import { CartPage } from "./CartPage";

export const metadata: Metadata = { title: "კალათა", robots: { index: false } };

export default async function Page() {
  const related = (await getHomeProducts()).slice(0, 3);
  return (
    <div className="cart-page">
      <div className="cart-shell">
        <nav className="cart-breadcrumb" aria-label="ადგილმდებარეობა">
          <Link href="/catalog">კატალოგი</Link>
          <Icon name="chevron" />
          <span aria-current="page">კალათა</span>
        </nav>
        <CartPage />

        <section className="cart-process" aria-label="შეკვეთის ნაბიჯები">
          <div>
            <span className="cart-step-number">01</span>
            <div>
              <h3>შეარჩიეთ პროდუქტი</h3>
              <p>დაამატეთ საჭირო აღჭურვილობა კალათაში.</p>
            </div>
          </div>
          <div>
            <span className="cart-step-number">02</span>
            <div>
              <h3>მიუთითეთ რაოდენობა</h3>
              <p>მოარგეთ სია თქვენი სივრცის საჭიროებებს.</p>
            </div>
          </div>
          <div>
            <span className="cart-step-number">03</span>
            <div>
              <h3>გააფორმეთ შეკვეთა</h3>
              <p>მიუთითეთ მისამართი - მენეჯერი დაგიკავშირდებათ.</p>
            </div>
          </div>
        </section>

        {related.length > 0 && (
          <section className="cart-related-section" aria-labelledby="cart-related-title">
            <div className="cart-related-heading">
              <div>
                <span className="cart-eyebrow">თქვენი სივრცისთვის</span>
                <h2 id="cart-related-title">შეავსეთ თქვენი არჩევანი</h2>
              </div>
              <Link className="text-link" href="/catalog">
                ყველა პროდუქტი <Icon name="arrow" />
              </Link>
            </div>
            <div className="product-grid cart-related">
              {related.map((p) => (
                <ProductCard key={p.id} p={p} />
              ))}
            </div>
          </section>
        )}

        <section className="cart-planning">
          <div>
            <span>მარკეტი · საწყობი · სამუშაო სივრცე</span>
            <h2>მოაწყვეთ სივრცე ერთიანი სტილით</h2>
            <p>შეარჩიეთ შესაბამისი სტელაჟები, კარადები და აქსესუარები.</p>
          </div>
          <Link href="/catalog" className="button accent">
            კატალოგში დაბრუნება <Icon name="arrow" />
          </Link>
        </section>
      </div>
    </div>
  );
}
