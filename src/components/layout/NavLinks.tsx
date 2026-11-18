"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Link as NavLink } from "@/lib/content-schema";
import { MegaList, type MenuCat } from "./MegaList";

export function NavLinks({ links, categories }: { links: NavLink[]; categories: MenuCat[] }) {
  const path = usePathname();
  const active = (href: string) => (href === "/" ? path === "/" : path.startsWith(href.split("?")[0]));
  return links.map((l) => {
    const link = (
      <Link className={active(l.href) ? "active" : undefined} href={l.href}>
        {l.label}
      </Link>
    );
    if (l.href.split("?")[0] !== "/catalog" || categories.length === 0) return <span key={l.href + l.label}>{link}</span>;
    return (
      <span key={l.href + l.label} className="nav-drop">
        {link}
        <div className="mega">
          <MegaList items={categories} />
        </div>
      </span>
    );
  });
}
