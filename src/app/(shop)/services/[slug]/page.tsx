import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ContactBox } from "@/components/ContactBox";
import { Icon } from "@/components/Icon";
import { getContent } from "@/lib/content";
import { getServices, serviceSlugs } from "@/lib/services";

export function generateStaticParams() {
  return serviceSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const { services } = await getContent();
  const s = getServices(services).find((x) => x.slug === slug);
  return s ? { title: s.title, description: (s.paragraphs[0] ?? "").slice(0, 160) } : {};
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { services: content } = await getContent();
  const s = getServices(content).find((x) => x.slug === slug);
  if (!s) notFound();
  return (
    <div className="page-wrap services-page">
      <nav className="breadcrumb" aria-label="breadcrumb">
        <Link href="/">მთავარი</Link>
        <Icon name="chevron" />
        <Link href="/services">{content.title}</Link>
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
          {s.image && <Image src={s.image} alt="" fill sizes="(max-width: 820px) 100vw, 45vw" priority />}
        </div>
      </div>
    </div>
  );
}
