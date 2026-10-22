import Link from "next/link";
import { Suspense } from "react";
import { BrandMark } from "@/components/BrandMark";
import { HeaderCounters } from "@/components/cart/CartUI";
import { getContent } from "@/lib/content";
import { site } from "@/lib/site";
import { NavLinks } from "./NavLinks";
import { SearchBox } from "./SearchBox";

export async function Header() {
  "use cache";
  const { header } = await getContent();
  return (
    <header className="site-header">
      <a className="skip-link" href="#main">
        შინაარსზე გადასვლა
      </a>
      <div className="header-main">
        <Link className="brand" href="/" aria-label={`${site.name} — მთავარი`}>
          <BrandMark />
          <span>{site.name}</span>
        </Link>
        <nav className="main-nav" aria-label="მთავარი ნავიგაცია">
          <Suspense
            fallback={header.navLinks.map((l) => (
              <Link key={l.href + l.label} href={l.href}>
                {l.label}
              </Link>
            ))}
          >
            <NavLinks links={header.navLinks} />
          </Suspense>
        </nav>
        <HeaderCounters />
      </div>
      <SearchBox />
    </header>
  );
}
