import Image from "next/image";
import Link from "next/link";
import type { CategoryNode } from "@/lib/data";
import { categoryUrl } from "@/lib/format";

export type MenuCat = { id: number; name: string; slug: string; image: string | null; children: MenuCat[] };

export function toMenu(nodes: CategoryNode[]): MenuCat[] {
  return nodes.map((c) => ({ id: c.id, name: c.name, slug: c.slug, image: c.image, children: toMenu(c.children) }));
}

/** Category list with small thumbs; hovering a root shows its subcategories on the right. */
export function MegaList({ items, onPick }: { items: MenuCat[]; onPick?: () => void }) {
  return (
    <div className="mega-inner">
      {items.map((c) => (
        <div key={c.id} className="mega-row">
          <Link className="mega-item" href={categoryUrl(c.slug)} onClick={onPick}>
            <span className="mega-thumb">{c.image && <Image src={c.image} alt="" width={32} height={32} />}</span>
            <span>{c.name}</span>
          </Link>
          {c.children.length > 0 && (
            <div className="mega-sub">
              {c.children.map((s) => (
                <Link key={s.id} href={categoryUrl(s.slug)} onClick={onPick}>
                  {s.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
