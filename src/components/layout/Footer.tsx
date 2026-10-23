import Link from "next/link";
import { BrandMark } from "@/components/BrandMark";
import { Icon } from "@/components/Icon";
import { getContent } from "@/lib/content";
import { site as brand } from "@/lib/site";

export async function Footer() {
  "use cache";
  const { footer, site } = await getContent();
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <Link className="brand footer-brand" href="/">
          <BrandMark />
          <span>{brand.name}</span>
        </Link>
        <nav aria-label="ქვედა ნავიგაცია">
          {footer.menuLinks.map((l) => (
            <Link key={l.href + l.label} href={l.href}>
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="footer-icons">
          <a className="icon-button" href="#top" aria-label="გვერდის დასაწყისში დაბრუნება">
            <Icon name="arrow" className="up" />
          </a>
        </div>
      </div>
      <div className="footer-meta">
        <a href={`tel:${site.phone}`}>{site.phoneLabel}</a>
        <a href={`mailto:${site.email}`}>{site.email}</a>
        <span>{site.address}</span>
        <span>© {new Date().getFullYear()} {site.company}</span>
      </div>
    </footer>
  );
}
