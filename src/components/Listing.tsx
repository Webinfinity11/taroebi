import Link from "next/link";
import { Icon } from "@/components/Icon";
import { ProductGrid } from "@/components/ProductCard";
import { PriceFilter } from "@/components/PriceFilter";
import { SidebarTree, type SideNode } from "@/components/SidebarTree";
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

  return (
    <div className="listing">
      <Sidebar tree={tree} activeId={category?.id} />
      <div>
        {subcategories && subcategories.length > 0 && (
          <div className="subcats">
            {subcategories
              .map((s) => (
                <Link key={s.id} className="chip" href={categoryUrl(s.slug)}>
                  {s.name} <small>{s.count}</small>
                </Link>
              ))}
          </div>
        )}
        <div className="toolbar">
          <div className="chips">
            <Link className={query.sale ? "chip selected" : "chip"} href={href(base, sp, { sale: query.sale ? "" : "1", page: "" })}>
              <Icon name="tag" /> ფასდაკლებული
            </Link>
            <Link className={query.inStock ? "chip selected" : "chip"} href={href(base, sp, { stock: query.inStock ? "" : "1", page: "" })}>
              მარაგშია
            </Link>
            {query.q && (
              <Link className="chip selected" href={href(base, sp, { q: "", page: "" })}>
                „{query.q}“ <Icon name="close" />
              </Link>
            )}
          </div>
          <AttrFilter name="material" label="მასალა" value={query.material} options={options.materials} base={base} sp={sp} />
          <AttrFilter name="color" label="ფერი" value={query.color} options={options.colors} base={base} sp={sp} />
          <PriceFilter key={`${query.minPrice}-${query.maxPrice}`} min={query.minPrice} max={query.maxPrice} />
          <span className="resultcount">{total} პროდუქტი</span>
          <SortSelect value={query.sort!} />
        </div>
        {items.length ? (
          <ProductGrid items={items} />
        ) : (
          <div className="products">
            <div className="empty">
              <Icon name="search" />
              <h3>პროდუქტი ვერ მოიძებნა</h3>
              <p>სცადეთ სხვა ძიება ან მოხსენით ფილტრები.</p>
              <Link className="primary" href={base}>
                ფილტრების გასუფთავება
              </Link>
            </div>
          </div>
        )}
        {pages > 1 && <Pagination page={page} pages={pages} link={(n) => href(base, sp, { page: String(n) })} />}
      </div>
    </div>
  );
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
    <div className="chips attrfilter">
      <span className="attrlabel">{label}:</span>
      {options.map((o) => (
        <Link key={o} className={value === o ? "chip selected" : "chip"} href={href(base, sp, { [name]: value === o ? "" : o, page: "" })}>
          {o}
        </Link>
      ))}
    </div>
  );
}

function Sidebar({ tree, activeId }: { tree: CategoryNode[]; activeId?: number }) {
  const strip = (n: CategoryNode): SideNode => ({
    id: n.id,
    name: n.name,
    slug: n.slug,
    image: n.image,
    count: n.count,
    children: n.children.map(strip),
  });
  return <SidebarTree tree={tree.map(strip)} activeId={activeId} />;
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

export function ListingSkeleton() {
  return (
    <div className="listing">
      <aside className="sidebar" />
      <div className="products">
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i} className="product" style={{ height: 380, background: "var(--bg)" }} />
        ))}
      </div>
    </div>
  );
}
