import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ContactBox } from "@/components/ContactBox";
import { Icon } from "@/components/Icon";
import { serviceUrl, services } from "@/lib/services";

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const s = services.find((x) => x.slug === slug);
  return s ? { title: s.title, description: s.lead } : {};
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = services.find((x) => x.slug === slug);
  if (!s) notFound();
  const other = services.filter((x) => x.slug !== s.slug);
  return (
    <div className="page-wrap services-page">
      <nav className="breadcrumb" aria-label="breadcrumb">
        <Link href="/">მთავარი</Link>
        <Icon name="chevron" />
        <Link href="/services">სერვისები</Link>
        <Icon name="chevron" />
        <span aria-current="page">{s.title}</span>
      </nav>
      <h1 className="page-title">{s.title}</h1>
      <div className="service-detail">
        <div className="service-text">
          {s.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
          <ContactBox />
        </div>
        <div className="service-photo">
          <Image src={s.image} alt={s.alt} fill sizes="(max-width: 820px) 100vw, 45vw" priority />
        </div>
      </div>
      <h2 className="service-more-title">სხვა სერვისი</h2>
      <div className="service-grid">
        {other.map((o) => (
          <Link key={o.slug} href={serviceUrl(o.slug)} className="service-card">
            <span className="service-media">
              <Image src={o.image} alt={o.alt} fill sizes="(max-width: 820px) 100vw, 50vw" />
            </span>
            <span className="service-body">
              <h2>{o.title}</h2>
              <span className="text-link">
                დეტალურად <Icon name="arrow" />
              </span>
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
