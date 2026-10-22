// Fills an empty database with sample categories and shelves so the storefront has something to show.
// Usage: npx tsx scripts/seed.ts   (refuses to run if products already exist)
import "./env";
import { sql } from "drizzle-orm";
import { categories, db, productCategories, products } from "../src/db";
import { slugify } from "../src/lib/admin-shared";

type Cat = { name: string; children?: string[] };
const tree: Cat[] = [
  { name: "საწყობის სტელაჟები", children: ["მსუბუქი დატვირთვა", "საშუალო დატვირთვა", "მძიმე დატვირთვა (პალეტური)"] },
  { name: "საოფისე და საარქივო თაროები", children: ["საარქივო", "საოფისე"] },
  { name: "სახლის თაროები", children: ["კედლის თაროები", "წიგნების თაროები", "ავტოფარეხის თაროები"] },
  { name: "მაღაზიის თაროები", children: ["კედლის სტელაჟი", "კუნძულის სტელაჟი"] },
  { name: "აქსესუარები", children: ["დამატებითი თარო", "დგარები და სამაგრები"] },
];

type Seed = {
  name: string;
  cat: string;
  price: number;
  salePrice?: number;
  material: string;
  color: string;
  w: number;
  h: number;
  d: number;
  load: number;
  shelves: number;
  stock?: number;
  featured?: boolean;
};

const items: Seed[] = [
  { name: "ლითონის სტელაჟი 200×100×40, 5 თარო", cat: "მსუბუქი დატვირთვა", price: 189, material: "ლითონი", color: "რუხი", w: 100, h: 200, d: 40, load: 150, shelves: 5, stock: 24, featured: true },
  { name: "ლითონის სტელაჟი 200×120×50, 5 თარო", cat: "საშუალო დატვირთვა", price: 249, salePrice: 219, material: "ლითონი", color: "რუხი", w: 120, h: 200, d: 50, load: 250, shelves: 5, stock: 12 },
  { name: "პალეტური სტელაჟი 300×270×110", cat: "მძიმე დატვირთვა (პალეტური)", price: 1290, material: "ლითონი", color: "ლურჯი/ნარინჯისფერი", w: 270, h: 300, d: 110, load: 1000, shelves: 3, stock: 4 },
  { name: "საარქივო თარო 220×100×30, 6 თარო", cat: "საარქივო", price: 210, material: "ლითონი", color: "თეთრი", w: 100, h: 220, d: 30, load: 80, shelves: 6, stock: 15 },
  { name: "საოფისე ღია თარო 180×80×35", cat: "საოფისე", price: 320, material: "ლამინატი", color: "მუხა", w: 80, h: 180, d: 35, load: 30, shelves: 5, stock: 8, featured: true },
  { name: "კედლის თარო 80×20, 2 ცალი", cat: "კედლის თაროები", price: 59, material: "ხე", color: "კაკალი", w: 80, h: 4, d: 20, load: 10, shelves: 2, stock: 40 },
  { name: "წიგნების თარო 190×60×28", cat: "წიგნების თაროები", price: 240, salePrice: 199, material: "ლამინატი", color: "თეთრი", w: 60, h: 190, d: 28, load: 25, shelves: 5, stock: 10 },
  { name: "ავტოფარეხის სტელაჟი 180×90×40, 4 თარო", cat: "ავტოფარეხის თაროები", price: 149, material: "ლითონი", color: "შავი", w: 90, h: 180, d: 40, load: 175, shelves: 4, stock: 30 },
  { name: "მაღაზიის კედლის სტელაჟი 220×100×45", cat: "კედლის სტელაჟი", price: 390, material: "ლითონი", color: "თეთრი", w: 100, h: 220, d: 45, load: 60, shelves: 5, stock: 6 },
  { name: "მაღაზიის კუნძულის სტელაჟი 150×100×70", cat: "კუნძულის სტელაჟი", price: 520, material: "ლითონი", color: "თეთრი", w: 100, h: 150, d: 70, load: 60, shelves: 8, stock: 3 },
  { name: "დამატებითი თარო 100×40 (ლითონი)", cat: "დამატებითი თარო", price: 29, material: "ლითონი", color: "რუხი", w: 100, h: 3, d: 40, load: 150, shelves: 1, stock: 100 },
  { name: "სამაგრების კომპლექტი 4 ცალი", cat: "დგარები და სამაგრები", price: 12, material: "ლითონი", color: "ვერცხლისფერი", w: 0, h: 0, d: 0, load: 0, shelves: 0 },
];

(async () => {
  const [{ n }] = await db.select({ n: sql<number>`count(*)::int` }).from(products);
  if (n > 0) {
    console.error(`database already has ${n} products — seed skipped`);
    process.exit(1);
  }

  const ids = new Map<string, number>();
  let order = 0;
  for (const root of tree) {
    const [r] = await db
      .insert(categories)
      .values({ name: root.name, slug: slugify(root.name), sortOrder: order++ })
      .returning({ id: categories.id });
    ids.set(root.name, r.id);
    for (const child of root.children ?? []) {
      const [c] = await db
        .insert(categories)
        .values({ name: child, slug: slugify(child), parentId: r.id, sortOrder: order++ })
        .returning({ id: categories.id });
      ids.set(child, c.id);
    }
  }

  for (const it of items) {
    const [p] = await db
      .insert(products)
      .values({
        name: it.name,
        slug: slugify(it.name),
        sku: `SH-${String(1000 + items.indexOf(it))}`,
        price: it.price,
        salePrice: it.salePrice ?? null,
        inStock: it.stock == null ? true : it.stock > 0,
        stockQty: it.stock ?? null,
        featured: it.featured ?? false,
        summary: `${it.material}, ${it.color}. დატვირთვა ერთ თაროზე ${it.load} კგ.`,
        description: "სატესტო პროდუქტი. აღწერა, სურათები და ზუსტი პარამეტრები ივსება ადმინ პანელიდან.",
        material: it.material,
        color: it.color,
        widthCm: it.w || null,
        heightCm: it.h || null,
        depthCm: it.d || null,
        loadKg: it.load || null,
        shelfCount: it.shelves || null,
      })
      .returning({ id: products.id });
    // Link to the leaf and its parent, as the admin form does.
    const leaf = ids.get(it.cat)!;
    const parent = tree.find((t) => t.children?.includes(it.cat))!;
    await db.insert(productCategories).values([
      { productId: p.id, categoryId: leaf },
      { productId: p.id, categoryId: ids.get(parent.name)! },
    ]);
  }
  console.log(`seeded ${ids.size} categories and ${items.length} products`);
})();
