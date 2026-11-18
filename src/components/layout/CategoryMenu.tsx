"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/Icon";
import { categoryUrl } from "@/lib/format";
import { serviceUrl } from "@/lib/services";
import { MegaList, type MenuCat } from "./MegaList";

type NavItem = { label: string; href: string };
type Svc = { slug: string; title: string };

export function CategoryMenu({ items, links, services }: { items: MenuCat[]; links: NavItem[]; services: Svc[] }) {
  const [open, setOpen] = useState(false);
  const [openCat, setOpenCat] = useState<number | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const close = () => setOpen(false);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      // Desktop dropdown closes on outside click; the mobile drawer has its own close button.
      if (window.matchMedia("(max-width: 820px)").matches) return;
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("click", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  // Lock page scroll while the mobile drawer is open.
  useEffect(() => {
    if (!open || !window.matchMedia("(max-width: 820px)").matches) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <div className="cat-menu" ref={ref}>
      <button type="button" className="cat-button" aria-expanded={open} aria-label="მენიუ" onClick={() => setOpen((o) => !o)}>
        <Icon name={open ? "close" : "menu"} />
        <span>კატეგორიები</span>
      </button>

      {open && (
        <div className="mega mega-desktop">
          <MegaList items={items} onPick={close} />
        </div>
      )}

      {open && (
        <div className="m-drawer" role="dialog" aria-modal="true" aria-label="მენიუ">
          <div className="m-drawer-top">
            <strong>მენიუ</strong>
            <button type="button" className="m-close" aria-label="დახურვა" onClick={close}>
              <Icon name="close" />
            </button>
          </div>

          <nav className="m-links" aria-label="მთავარი ნავიგაცია">
            {links.map((l) => (
              <div key={l.href + l.label}>
                <Link href={l.href} onClick={close}>
                  {l.label}
                </Link>
                {l.href === "/services" && services.length > 0 && (
                  <div className="m-sub">
                    {services.map((s) => (
                      <Link key={s.slug} href={serviceUrl(s.slug)} onClick={close}>
                        {s.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          <h3 className="m-title">კატეგორიები</h3>
          <div className="m-cats">
            {items.map((c) => {
              const expanded = openCat === c.id;
              return (
                <div key={c.id} className="m-cat">
                  <div className="m-cat-row">
                    <Link href={categoryUrl(c.slug)} onClick={close}>
                      <span className="mega-thumb">{c.image && <Image src={c.image} alt="" width={32} height={32} />}</span>
                      <span>{c.name}</span>
                    </Link>
                    {c.children.length > 0 && (
                      <button
                        type="button"
                        className={expanded ? "m-toggle is-open" : "m-toggle"}
                        aria-label={`${c.name}: ქვეკატეგორიები`}
                        aria-expanded={expanded}
                        onClick={() => setOpenCat(expanded ? null : c.id)}
                      >
                        <Icon name="chevron" />
                      </button>
                    )}
                  </div>
                  {expanded && (
                    <div className="m-sub">
                      {c.children.map((s) => (
                        <Link key={s.id} href={categoryUrl(s.slug)} onClick={close}>
                          {s.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
