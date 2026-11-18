import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/Icon";
import { serviceUrl, services } from "@/lib/services";

export const metadata: Metadata = {
  title: "სერვისები",
  description: "თაროების აწყობა და მონტაჟი, მაღაზიის დაგეგმარება.",
};

export default function ServicesPage() {
  return (
    <div className="page-wrap services-page">
      <nav className="breadcrumb" aria-label="breadcrumb">
        <Link href="/">მთავარი</Link>
        <Icon name="chevron" />
        <span aria-current="page">სერვისები</span>
      </nav>
      <h1 className="page-title">სერვისები</h1>
      <div className="service-grid">
        {services.map((s) => (
          <Link key={s.slug} href={serviceUrl(s.slug)} className="service-card">
            <span className="service-media">
              <Image src={s.image} alt={s.alt} fill sizes="(max-width: 820px) 100vw, 50vw" />
            </span>
            <span className="service-body">
              <h2>{s.title}</h2>
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
