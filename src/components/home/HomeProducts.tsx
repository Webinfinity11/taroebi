"use client";

import Link from "next/link";
import { useState } from "react";
import { Icon } from "@/components/Icon";
import { ProductCard } from "@/components/ProductCard";
import type { ProductCard as Card } from "@/lib/data";

type Tab = { id: number; name: string; slug: string };
type Item = Card & { rootId: number | null };

const PAGE = 8;

/** "პროდუქცია" block: tabs by root category, arrows page through the loaded products. */
export function HomeProducts({ title, tabs, items }: { title: string; tabs: Tab[]; items: Item[] }) {
  const [tab, setTab] = useState<number | null>(null);
  const [page, setPage] = useState(0);
  const list = tab == null ? items : items.filter((i) => i.rootId === tab);
  const pages = Math.max(1, Math.ceil(list.length / PAGE));
  const current = Math.min(page, pages - 1);
  const shown = list.slice(current * PAGE, current * PAGE + PAGE);
  const pick = (id: number | null) => {
    setTab(id);
    setPage(0);
  };

  return (
    <section className="products-section" id="products" aria-labelledby="products-title">
      <h2 id="products-title">{title}</h2>
      <div className="products-toolbar">
        <div className="filter-tabs" aria-label="პროდუქციის კატეგორიები">
          <button type="button" className={tab == null ? "is-active" : ""} aria-pressed={tab == null} onClick={() => pick(null)}>
            ყველა
          </button>
          {tabs.map((t) => (
            <button key={t.id} type="button" className={tab === t.id ? "is-active" : ""} aria-pressed={tab === t.id} onClick={() => pick(t.id)}>
              {t.name}
            </button>
          ))}
        </div>
        <div className="product-arrows">
          <button type="button" className="icon-button round" aria-label="წინა პროდუქტები" disabled={current === 0} onClick={() => setPage(current - 1)}>
            <Icon name="chevron" className="flip" />
          </button>
          <button
            type="button"
            className="icon-button round"
            aria-label="შემდეგი პროდუქტები"
            disabled={current >= pages - 1}
            onClick={() => setPage(current + 1)}
          >
            <Icon name="chevron" />
          </button>
        </div>
      </div>
      <p className="product-results" aria-live="polite">
        {list.length > 0 && pages > 1 ? `${current + 1} / ${pages}` : ""}
      </p>
      {shown.length > 0 ? (
        <div className="product-grid">
          {shown.map((p, i) => (
            <ProductCard key={p.id} p={p} priority={current === 0 && i < 4} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <Icon name="search" />
          <h3>პროდუქტი ვერ მოიძებნა</h3>
          <p>ამ კატეგორიაში პროდუქცია ჯერ არ არის.</p>
          <button type="button" className="button accent" onClick={() => pick(null)}>
            ყველა პროდუქტი
          </button>
        </div>
      )}
      <div className="products-more">
        <Link className="button secondary" href={tab == null ? "/catalog" : `/category/${encodeURIComponent(tabs.find((t) => t.id === tab)?.slug ?? "")}`}>
          სრული კატალოგი <Icon name="arrow" />
        </Link>
      </div>
    </section>
  );
}
