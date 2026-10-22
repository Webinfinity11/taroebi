"use client";

import Image from "next/image";
import { useState } from "react";

/** Product photo with a counter caption and thumbnails when there is more than one image. */
export function Gallery({ images, name, badge }: { images: string[]; name: string; badge: string | null }) {
  const [active, setActive] = useState(0);
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    <figure className="product-gallery">
      <div className="product-gallery-image">
        {badge && <span className="badge sale-badge">{badge}</span>}
        {images[active] ? (
          <Image src={images[active]} alt={name} width={1000} height={1000} sizes="(max-width: 820px) 100vw, 50vw" priority />
        ) : (
          <span className="noimg">ფოტო არ არის</span>
        )}
      </div>
      {images.length > 1 && (
        <div className="product-thumbs">
          {images.map((src, i) => (
            <button key={src} type="button" className={i === active ? "active" : ""} onClick={() => setActive(i)} aria-label={`სურათი ${i + 1}`}>
              <Image src={src} alt="" width={76} height={76} />
            </button>
          ))}
        </div>
      )}
      <figcaption>
        <span>პროდუქტის ფოტო</span>
        <span>
          {pad(images.length ? active + 1 : 0)} / {pad(images.length)}
        </span>
      </figcaption>
    </figure>
  );
}
