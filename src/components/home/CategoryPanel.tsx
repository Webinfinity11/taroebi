"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Icon } from "@/components/Icon";
import { categoryUrl } from "@/lib/format";

type Item = { id: number; name: string; slug: string; image: string | null };

/** Left column of the showcase: category list, collapsible on phones. */
export function CategoryPanel({ title, items }: { title: string; items: Item[] }) {
  const [open, setOpen] = useState(false);
  return (
    <aside className={open ? "category-panel is-open" : "category-panel"} aria-labelledby="categories-title">
      <div className="category-heading" id="categories">
        <h2 id="categories-title">{title}</h2>
        <button
          type="button"
          className="icon-button"
          aria-label={open ? "კატეგორიების დახურვა" : "კატეგორიების გახსნა"}
          aria-expanded={open}
          aria-controls="category-list"
          onClick={() => setOpen((o) => !o)}
        >
          <Icon name={open ? "close" : "menu"} />
        </button>
      </div>
      <div className="category-list" id="category-list">
        {items.map((c) => (
          <Link key={c.id} className="category-item" href={categoryUrl(c.slug)}>
            <span className="category-thumb">{c.image && <Image src={c.image} alt="" width={75} height={68} />}</span>
            <span>{c.name}</span>
            <Icon name="chevron" />
          </Link>
        ))}
        {items.length === 0 && <p className="muted small" style={{ padding: 12 }}>კატეგორიები ჯერ არ არის.</p>}
      </div>
    </aside>
  );
}
