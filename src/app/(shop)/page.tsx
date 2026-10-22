import Image from "next/image";
import Link from "next/link";
import { cacheLife } from "next/cache";
import { Icon } from "@/components/Icon";
import { CategoryPanel } from "@/components/home/CategoryPanel";
import { HomeProducts } from "@/components/home/HomeProducts";
import { flattenTree, getCategoryTree, getHomeProducts, type CategoryNode } from "@/lib/data";
import { getContent, getHomeCategoryIds } from "@/lib/content";

export default async function HomePage() {
  "use cache";
  cacheLife("hours");

  const [tree, products, { home }, picked] = await Promise.all([
    getCategoryTree(),
    getHomeProducts(),
    getContent(),
    getHomeCategoryIds(),
  ]);
  // Admin picks in their saved order; before any pick, the first 6 root categories.
  const all = flattenTree(tree);
  const panel = (picked ? picked.map((id) => all.find((c) => c.id === id)).filter((c): c is CategoryNode => !!c) : tree).slice(0, 6);
  const rootOf = (id: number) => {
    let c = all.find((x) => x.id === id);
    while (c?.parentId) c = all.find((x) => x.id === c!.parentId);
    return c?.id ?? null;
  };
  const tabs = tree.map((c) => ({ id: c.id, name: c.name, slug: c.slug }));
  const items = products.map((p) => ({ ...p, rootId: p.categoryId ? rootOf(p.categoryId) : null }));

  return (
    <>
      <div className="main-shell">
        <div className="showcase">
          <CategoryPanel
            title={home.categoriesTitle}
            items={panel.map((c) => ({ id: c.id, name: c.name, slug: c.slug, image: c.image }))}
          />
          <section className="home-hero" aria-labelledby="hero-title">
            {home.heroImage && (
              <Image className="hero-photo" src={home.heroImage} alt="" fill priority sizes="(max-width: 820px) 100vw, 76vw" />
            )}
            <div className="hero-copy">
              <h1 id="hero-title">{home.heroTitle}</h1>
              <p>{home.heroText}</p>
              <Link className="button accent" href="/catalog">
                {home.heroButton} <Icon name="arrow" />
              </Link>
            </div>
          </section>
        </div>

        <section className="feature-grid" aria-label="გამორჩეული კატეგორიები">
          {home.features.slice(0, 2).map((f, i) => (
            <article key={i} className={`feature ${i === 0 ? "feature-first" : "feature-second"}`}>
              <div className="feature-copy">
                <h2>{f.title}</h2>
                <p>{f.text}</p>
                <Link className="text-link" href={f.href || "/catalog"}>
                  {f.button} <Icon name="arrow" />
                </Link>
              </div>
              {f.image && <Image src={f.image} alt="" width={1200} height={737} sizes="(max-width: 820px) 100vw, 60vw" />}
            </article>
          ))}
        </section>
      </div>

      <HomeProducts title={home.productsTitle} tabs={tabs} items={items} />

      <section className="consultation" id="contact" aria-labelledby="contact-title">
        <div className="consultation-inner">
          <div className="consultation-copy">
            <h2 id="contact-title">{home.consultTitle}</h2>
            <p>{home.consultText}</p>
            <Link className="button accent" href="/contact">
              {home.consultButton} <Icon name="arrow" />
            </Link>
          </div>
          <ShelvingDrawing />
        </div>
      </section>
    </>
  );
}

function ShelvingDrawing() {
  return (
    <svg className="shelving-drawing" viewBox="0 0 620 260" fill="none" aria-hidden="true">
      <g stroke="currentColor" strokeWidth="1">
        <path d="M40 118 246 41 574 107 370 192Z M40 118v37l329 69 205-84v-33 M246 41v35l328 64 M370 192v32 M246 76 40 155" />
        <path
          d="M48 110V57l194-70 328 68v52 M242-13v54 M48 69l194-69 328 68 M48 82l194-69 328 68 M48 95l194-69 328 68 M48 108l194-69 328 68"
          transform="translate(0 40)"
        />
        <path d="M144 135 246 98 361 122 261 161Z M144 135v61l117 26 100-40v-60 M261 161v61 M144 150l117 26 100-40 M144 165l117 26 100-40 M144 180l117 26 100-40 M246 98v58 M144 196l102-40 115 26" />
        <path d="m338 165 103-40 115 25-102 41Z M338 165v62l116 25 102-41v-61 M454 191v61 M338 180l116 26 102-41 M338 195l116 26 102-41 M338 210l116 26 102-41 M441 125v60 M338 227l103-42 115 26" />
        <path d="M48 98v58 M96 80v86 M145 62v114 M194 45v141 M293 51v73 M344 62v72 M395 72v74 M447 82v74 M498 93v72 M550 104v72" />
      </g>
    </svg>
  );
}
