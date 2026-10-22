import Link from "next/link";
import { Icon } from "@/components/Icon";
import { ProductCard } from "@/components/ProductCard";
import { PriceFilter } from "@/components/PriceFilter";
import { ShopSidebar, type SidebarCategory } from "@/components/ShopSidebar";
import { SortSelect } from "@/components/SortSelect";
import { getCategoryTree, getFilterOptions, getProducts, type CategoryNode, type ProductQuery, type SortKey } from "@/lib/data";
import { categoryUrl } from "@/lib/format";

export type ListingParams = {
  q?: string;
  sort?: string;
  page?: string;
  sale?: string;
  stock?: string;
  min?: string;
  max?: string;
  material?: string;
  color?: string;
};

const sorts: SortKey[] = ["default", "new", "price-asc", "price-desc", "name"];

export function parseListing(sp: ListingParams): ProductQuery {
  return {
    q: sp.q?.trim().slice(0, 100) || undefined,
    sort: sorts.includes(sp.sort as SortKey) ? (sp.sort as SortKey) : "default",
    page: Math.max(1, parseInt(sp.page ?? "1") || 1),
    sale: sp.sale === "1",
    inStock: sp.stock === "1",
    minPrice: Math.max(0, parseFloat(sp.min ?? "") || 0) || undefined,
    maxPrice: Math.max(0, parseFloat(sp.max ?? "") || 0) || undefined,
    material: sp.material?.trim().slice(0, 60) || undefined,
    color: sp.color?.trim().slice(0, 60) || undefined,
  };
}

/** Builds a URL for `base` with the current filters, overriding some of them. */
function href(base: string, sp: ListingParams, patch: Partial<ListingParams>) {
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries({ ...sp, ...patch })) if (v) params.set(k, v);
  if (params.get("page") === "1") params.delete("page");
  if (params.get("sort") === "default") params.delete("sort");
  const qs = params.toString();
  return qs ? `${base}?${qs}` : base;
}

/** Shop page body (catalog + category pages): sidebar with categories and filters, product grid, pagination. */
export async function Listing({
  base,
  sp,
  category,
  subcategories,
}: {
  base: string;
  sp: ListingParams;
  category?: { id: number; descendantIds: number[] };
  subcategories?: CategoryNode[];
}) {
  const query = parseListing(sp);
  const [tree, result, options] = await Promise.all([
    getCategoryTree(),
    getProducts({ ...query, categoryIds: category?.descendantIds }),
    getFilterOptions(),
  ]);
  const { items, total, pages } = result;
  const page = Math.min(query.page!, pages);
  const allCount = tree.reduce((n, c) => n + c.count, 0);
  const activeFilters = [query.sale, query.inStock, query.minPrice, query.maxPrice, query.material, query.color, query.q].some(Boolean);

  const sidebarCats: SidebarCategory[] = tree.map((c) => ({ id: c.id, name: c.name, slug: c.slug, image: c.image, count: c.count }));
  // Inside a category, its children sit under the active root in the sidebar.
  const activeRoot = category ? findRoot(tree, category.id) : null;

  return (
    <>
      <div className="shop-layout">
        <ShopSidebar
          categories={sidebarCats}
          activeId={category?.id ?? null}
          activeRootId={activeRoot?.id ?? null}
          allCount={allCount}
          subcategories={
            activeRoot
              ? activeRoot.children.map((s) => ({ id: s.id, name: s.name, slug: s.slug, image: s.image, count: s.count }))
              : []
          }
          filters={
            <>
              <h2>ფილტრები</h2>
              <div className="shop-filter-body">
                <PriceFilter key={`${query.minPrice}-${query.maxPrice}`} min={query.minPrice} max={query.maxPrice} />
                <AttrFilter name="material" label="მასალა" value={query.material} options={options.materials} base={base} sp={sp} />
                <AttrFilter name="color" label="ფერი" value={query.color} options={options.colors} base={base} sp={sp} />
                <div className="chips">
                  <Link className={query.sale ? "chip selected" : "chip"} href={href(base, sp, { sale: query.sale ? "" : "1", page: "" })}>
                    <Icon name="tag" /> ფასდაკლებული
                  </Link>
                  <Link className={query.inStock ? "chip selected" : "chip"} href={href(base, sp, { stock: query.inStock ? "" : "1", page: "" })}>
                    მარაგშია
                  </Link>
                </div>
              </div>
              <div className="shop-filter-extra">
                {activeFilters ? (
                  <Link className="shop-reset-button" href={base}>
                    ფილტრების გასუფთავება
                  </Link>
                ) : (
                  <span className="shop-reset-button" aria-disabled="true">
                    ფილტრები არ არის არჩეული
                  </span>
                )}
              </div>
            </>
          }
        />

        <section className="shop-catalog" aria-label="პროდუქციის სია">
          {subcategories && subcategories.length > 0 && (
            <div className="subcats">
              {subcategories.map((s) => (
                <Link key={s.id} className="chip" href={categoryUrl(s.slug)}>
                  {s.name} <small>{s.count}</small>
                </Link>
              ))}
            </div>
          )}
          <div className="shop-toolbar">
            <p className="shop-results" aria-live="polite">
              ნაპოვნია {total} პროდუქტი
              {query.q && (
                <>
                  {" "}
                  · „{query.q}“{" "}
                  <Link href={href(base, sp, { q: "", page: "" })} aria-label="ძიების მოხსნა">
                    <Icon name="close" className="inline-icon" />
                  </Link>
                </>
              )}
            </p>
            <SortSelect value={query.sort!} />
          </div>
          {items.length ? (
            <div className="product-grid">
              {items.map((p, i) => (
                <ProductCard key={p.id} p={p} priority={i < 3} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <Icon name="search" />
              <h3>პროდუქტი ვერ მოიძებნა</h3>
              <p>შეცვალეთ საძიებო სიტყვა ან აირჩიეთ სხვა კატეგორია.</p>
              <Link className="button accent" href="/catalog">
                ყველა პროდუქტის ნახვა
              </Link>
            </div>
          )}
          {pages > 1 && <Pagination page={page} pages={pages} link={(n) => href(base, sp, { page: String(n) })} />}
        </section>
      </div>

      <section className="shop-consultation" aria-labelledby="shop-consultation-title">
        <div>
          <span className="shop-eyebrow">თქვენი სივრცისთვის</span>
          <h2 id="shop-consultation-title">გჭირდებათ დახმარება არჩევაში?</h2>
          <p>გვითხარით, რა აღჭურვილობას ეძებთ.</p>
        </div>
        <Link className="button accent" href="/contact">
          კონსულტაციის მოთხოვნა <Icon name="arrow" />
        </Link>
      </section>
    </>
  );
}

function findRoot(tree: CategoryNode[], id: number): CategoryNode | null {
  for (const root of tree) {
    const stack = [root];
    while (stack.length) {
      const n = stack.pop()!;
      if (n.id === id) return root;
      stack.push(...n.children);
    }
  }
  return null;
}

/** One row of chips for a product attribute (material, color); hidden when the catalog has no values yet. */
function AttrFilter({
  name,
  label,
  value,
  options,
  base,
  sp,
}: {
  name: "material" | "color";
  label: string;
  value?: string;
  options: string[];
  base: string;
  sp: ListingParams;
}) {
  if (!options.length) return null;
  return (
    <div className="attrfilter">
      <span className="attrlabel">{label}</span>
      <div className="chips">
        {options.map((o) => (
          <Link key={o} className={value === o ? "chip selected" : "chip"} href={href(base, sp, { [name]: value === o ? "" : o, page: "" })}>
            {o}
          </Link>
        ))}
      </div>
    </div>
  );
}

function Pagination({ page, pages, link }: { page: number; pages: number; link: (n: number) => string }) {
  const nums = [...new Set([1, page - 1, page, page + 1, pages])].filter((n) => n >= 1 && n <= pages).sort((a, b) => a - b);
  return (
    <nav className="pagination" aria-label="გვერდები">
      {page > 1 && (
        <Link href={link(page - 1)} aria-label="წინა გვერდი">
          <Icon name="left" />
        </Link>
      )}
      {nums.map((n, i) => (
        <span key={n} style={{ display: "contents" }}>
          {i > 0 && n - nums[i - 1] > 1 && <span className="gap">…</span>}
          {n === page ? (
            <span className="current" aria-current="page">
              {n}
            </span>
          ) : (
            <Link href={link(n)}>{n}</Link>
          )}
        </span>
      ))}
      {page < pages && (
        <Link href={link(page + 1)} aria-label="შემდეგი გვერდი">
          <Icon name="right" />
        </Link>
      )}
    </nav>
  );
}

/** Dark banner at the top of the shop pages. */
export function ShopBanner({ eyebrow, title, text, image }: { eyebrow: string; title: string; text?: string; image?: string | null }) {
  return (
    <section className="shop-banner" aria-label={title}>
      {image && <img className="shop-banner-image" src={image} alt="" width={1536} height={1024} fetchPriority="high" />}
      <div className="shop-banner-copy">
        <span className="shop-eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        {text && <p>{text}</p>}
      </div>
    </section>
  );
}

export function ListingSkeleton() {
  return (
    <div className="shop-layout">
      <aside className="shop-sidebar" />
      <div className="product-grid">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="product-card" style={{ height: 380, background: "var(--bg)" }} />
        ))}
      </div>
    </div>
  );
}
