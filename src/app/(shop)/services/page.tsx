import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/Icon";
import { getContent } from "@/lib/content";
import { getServices, serviceUrl } from "@/lib/services";

export async function generateMetadata(): Promise<Metadata> {
  const { services } = await getContent();
  return { title: services.title, description: getServices(services).map((s) => s.title).join(", ") };
}

export default async function ServicesPage() {
  const { services: content } = await getContent();
  const services = getServices(content);
  return (
    <div className="page-wrap services-page">
      <nav className="breadcrumb" aria-label="breadcrumb">
        <Link href="/">მთავარი</Link>
        <Icon name="chevron" />
        <span aria-current="page">{content.title}</span>
      </nav>
      <h1 className="page-title">{content.title}</h1>
      <div className="service-grid">
        {services.map((s) => (
          <Link key={s.slug} href={serviceUrl(s.slug)} className="service-card">
            <span className="service-media">
              {s.image && <Image src={s.image} alt="" fill sizes="(max-width: 820px) 100vw, 50vw" />}
            </span>
            <span className="service-body">
              <h2>{s.title}</h2>
              <span className="text-link">
                {content.cardButton} <Icon name="arrow" />
              </span>
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
