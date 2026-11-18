import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ContactBox } from "@/components/ContactBox";
import { Icon } from "@/components/Icon";
import { services } from "@/lib/services";

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
    </div>
  );
}
