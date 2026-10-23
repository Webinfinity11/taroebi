"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { Icon } from "@/components/Icon";

/** Product photo with a counter caption and thumbnails when there is more than one image. */
export function Gallery({ images, name, badge }: { images: string[]; name: string; badge: string | null }) {
  const [active, setActive] = useState(0);
  const dialog = useRef<HTMLDialogElement>(null);
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    <figure className="product-gallery">
      <div className="product-gallery-image">
        {badge && <span className="badge sale-badge">{badge}</span>}
        {images[active] ? (
          <>
            <Image src={images[active]} alt={name} width={1000} height={1000} sizes="(max-width: 820px) 100vw, 50vw" priority />
            <button
              type="button"
              className="product-zoom-trigger"
              onClick={() => dialog.current?.showModal()}
              aria-label="პროდუქტის ფოტოს გადიდება"
              aria-haspopup="dialog"
            >
              <span className="product-zoom-icon"><Icon name="zoom" /></span>
            </button>
          </>
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
      {images[active] && (
        <dialog
          ref={dialog}
          className="product-lightbox"
          aria-label={`${name}: გადიდებული ფოტო`}
          onClick={(event) => {
            if (event.target === event.currentTarget) dialog.current?.close();
          }}
        >
          <button type="button" className="product-lightbox-close icon-button" onClick={() => dialog.current?.close()} aria-label="დახურვა" autoFocus>
            <Icon name="close" />
          </button>
          <Image src={images[active]} alt={name} width={1800} height={1800} sizes="95vw" className="product-lightbox-photo" />
        </dialog>
      )}
    </figure>
  );
}
