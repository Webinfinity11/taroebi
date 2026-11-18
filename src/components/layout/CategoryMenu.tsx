"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/Icon";
import { MegaList, type MenuCat } from "./MegaList";

export function CategoryMenu({ items }: { items: MenuCat[] }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const onClick = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("click", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);
  return (
    <div className="cat-menu" ref={ref}>
      <button type="button" className="cat-button" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        <Icon name={open ? "close" : "menu"} />
        <span>კატეგორიები</span>
      </button>
      {open && (
        <div className="mega">
          <MegaList items={items} onPick={() => setOpen(false)} />
        </div>
      )}
    </div>
  );
}
