"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Icon } from "@/components/Icon";

export type Slide = { title: string; text: string; button: string; href: string; image: string };

const DELAY = 6000;

export function HeroCarousel({ slides }: { slides: Slide[] }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const n = slides.length;

  useEffect(() => {
    if (paused || n < 2) return;
    const t = setTimeout(() => setI((x) => (x + 1) % n), DELAY);
    return () => clearTimeout(t);
  }, [i, paused, n]);

  return (
    <section
      className="home-hero"
      aria-roledescription="carousel"
      aria-label="მთავარი ბანერი"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {slides.map((s, k) => (
        <div key={k} className={k === i ? "hero-slide is-active" : "hero-slide"} aria-hidden={k !== i}>
          {s.image && <Image className="hero-photo" src={s.image} alt="" fill priority={k === 0} sizes="100vw" />}
          <div className="hero-copy">
            {k === 0 ? <h1>{s.title}</h1> : <h2 className="hero-h">{s.title}</h2>}
            <p>{s.text}</p>
            <Link className="button accent" href={s.href} tabIndex={k === i ? 0 : -1}>
              {s.button} <Icon name="arrow" />
            </Link>
          </div>
        </div>
      ))}
      {n > 1 && (
        <div className="hero-dots" role="tablist" aria-label="ბანერის არჩევა">
          {slides.map((_, k) => (
            <button
              key={k}
              type="button"
              role="tab"
              aria-selected={k === i}
              aria-label={`ბანერი ${k + 1}`}
              className={k === i ? "is-active" : ""}
              onClick={() => setI(k)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
