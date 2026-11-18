import Link from "next/link";
import { Suspense } from "react";
import { HeaderCounters } from "@/components/cart/CartUI";
import { getContent } from "@/lib/content";
import { getCategoryTree } from "@/lib/data";
import { site } from "@/lib/site";
import { CategoryMenu } from "./CategoryMenu";
import { toMenu } from "./MegaList";
import { NavLinks } from "./NavLinks";
import { SearchBox } from "./SearchBox";

export async function Header() {
  "use cache";
  const [{ header }, tree] = await Promise.all([getContent(), getCategoryTree()]);
  const cats = toMenu(tree);
  return (
    <header className="site-header">
      <a className="skip-link" href="#main">
        შინაარსზე გადასვლა
      </a>
      <div className="header-main">
        <Link className="brand" href="/" aria-label={`${site.name} - მთავარი`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="brand-logo" src="/img/brand/logo.png" alt={site.name} width={600} height={140} />
        </Link>
        <CategoryMenu items={cats} />
        <nav className="main-nav" aria-label="მთავარი ნავიგაცია">
          <Suspense
            fallback={header.navLinks.map((l) => (
              <Link key={l.href + l.label} href={l.href}>
                {l.label}
              </Link>
            ))}
          >
            <NavLinks links={header.navLinks} categories={cats} />
          </Suspense>
        </nav>
        <SearchBox />
        <HeaderCounters />
      </div>
    </header>
  );
}
