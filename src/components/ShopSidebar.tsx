"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type ReactNode } from "react";
import { Icon } from "@/components/Icon";
import { categoryUrl } from "@/lib/format";

export type SidebarCategory = { id: number; name: string; slug: string; image: string | null; count: number };

/** Shop sidebar: root categories with images and counts, the active root's children, extra filters; collapsible on phones. */
export function ShopSidebar({
  categories,
  subcategories,
  activeId,
  activeRootId,
  allCount,
  filters,
}: {
  categories: SidebarCategory[];
  subcategories: SidebarCategory[];
  activeId: number | null;
  activeRootId: number | null;
  allCount: number;
  filters: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className="shop-mobile-bar">
        <button type="button" className="shop-filter-toggle" aria-expanded={open} aria-controls="shop-sidebar" onClick={() => setOpen((o) => !o)}>
          <Icon name="filter" />
          კატეგორიები და ფილტრები
          <Icon name="chevron" className="shop-filter-chevron" />
        </button>
      </div>
      <aside id="shop-sidebar" className={open ? "shop-sidebar is-open" : "shop-sidebar"} aria-labelledby="shop-categories-title">
        <section className="shop-filter-card">
          <h2 id="shop-categories-title">კატეგორიები</h2>
          <div className="shop-category-list">
            <Link className={activeId == null ? "shop-category-button is-active" : "shop-category-button"} href="/catalog" aria-current={activeId == null ? "page" : undefined}>
              <span className="shop-all-icon">
                <Icon name="grid" />
              </span>
              <span>ყველა პროდუქტი</span>
              <span className="shop-category-count">{allCount}</span>
            </Link>
            {categories.map((c) => (
              <span key={c.id} style={{ display: "contents" }}>
                <Link
                  className={c.id === activeId ? "shop-category-button is-active" : "shop-category-button"}
                  href={categoryUrl(c.slug)}
                  aria-current={c.id === activeId ? "page" : undefined}
                >
                  <span className="shop-category-thumb">{c.image && <Image src={c.image} alt="" width={43} height={46} />}</span>
                  <span>{c.name}</span>
                  <span className="shop-category-count">{c.count}</span>
                </Link>
                {c.id === activeRootId &&
                  subcategories.map((s) => (
                    <Link
                      key={s.id}
                      className={s.id === activeId ? "shop-category-button shop-subcategory is-active" : "shop-category-button shop-subcategory"}
                      href={categoryUrl(s.slug)}
                      aria-current={s.id === activeId ? "page" : undefined}
                    >
                      <span className="shop-category-thumb" />
                      <span>{s.name}</span>
                      <span className="shop-category-count">{s.count}</span>
                    </Link>
                  ))}
              </span>
            ))}
          </div>
        </section>
        <section className="shop-filter-card shop-filters">{filters}</section>
        <section className="shop-request-note" aria-labelledby="shop-request-title">
          <span className="shop-note-icon">
            <Icon name="cart" />
          </span>
          <h2 id="shop-request-title">შეკვეთა ონლაინ</h2>
          <p>დაამატეთ სასურველი პროდუქცია კალათაში და გააფორმეთ შეკვეთა რამდენიმე წუთში.</p>
          <Link className="text-link" href="/cart">
            კალათის ნახვა <Icon name="arrow" />
          </Link>
        </section>
      </aside>
    </>
  );
}
