import Link from "next/link";
import { Suspense } from "react";
import { HeaderCounters } from "@/components/cart/CartUI";
import { getContent } from "@/lib/content";
import { getCategoryTree } from "@/lib/data";
import { getServices } from "@/lib/services";
import { site } from "@/lib/site";
import { CategoryMenu } from "./CategoryMenu";
import { toMenu } from "./MegaList";
import { NavLinks } from "./NavLinks";
import { SearchBox } from "./SearchBox";

export async function Header() {
  "use cache";
  const [content, tree] = await Promise.all([getContent(), getCategoryTree()]);
  const { header } = content;
  const services = getServices(content.services).map((s) => ({ slug: s.slug, title: s.title }));
  const cats = toMenu(tree);
  // Ensure the services link exists even if the saved menu predates it.
  // The logo is the home link and the categories button covers the catalog, so neither is a menu link.
  const baseLinks = header.navLinks.filter((l) => l.href !== "/" && l.href.split("?")[0] !== "/catalog");
  const navLinks = baseLinks.some((l) => l.href === "/services")
    ? baseLinks
    : (() => {
        const i = baseLinks.findIndex((l) => l.href === "/about");
        const at = i === -1 ? baseLinks.length : i;
        return [...baseLinks.slice(0, at), { label: "სერვისები", href: "/services" }, ...baseLinks.slice(at)];
      })();
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
        <CategoryMenu items={cats} links={navLinks} services={services} />
        <nav className="main-nav" aria-label="მთავარი ნავიგაცია">
          <Suspense
            fallback={navLinks.map((l) => (
              <Link key={l.href + l.label} href={l.href}>
                {l.label}
              </Link>
            ))}
          >
            <NavLinks links={navLinks} categories={cats} services={services} />
          </Suspense>
        </nav>
        <SearchBox />
        <HeaderCounters />
      </div>
    </header>
  );
}
