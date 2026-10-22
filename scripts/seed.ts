// Fills an empty database with sample categories and shelves so the storefront has something to show.
// Usage: npx tsx scripts/seed.ts   (refuses to run if products already exist)
import "./env";
import { sql } from "drizzle-orm";
import { categories, db, productCategories, products } from "../src/db";
import { slugify } from "../src/lib/admin-shared";

type Cat = { name: string; image?: string; children?: string[] };
const img = (f: string) => `/img/design/${f}`;
const tree: Cat[] = [
  { name: "საწყობის სტელაჟები", image: img("warehouse-rack.png"), children: ["მსუბუქი დატვირთვა", "საშუალო დატვირთვა", "მძიმე დატვირთვა (პალეტური)"] },
  { name: "სავაჭრო სტელაჟები", image: img("single-retail-shelf.png"), children: ["კედლის სტელაჟი", "კუნძულის სტელაჟი"] },
  { name: "მეტალის კარადები", image: img("single-metal-locker.png"), children: ["ტანსაცმლის კარადები", "საარქივო კარადები"] },
  { name: "სალაროს მაგიდები", image: img("checkout-counter.png"), children: ["სტანდარტული", "კუთხის"] },
  { name: "მარკეტის აქსესუარები", image: img("shopping-basket.png"), children: ["კალათები და ურიკები", "დგარები და სამაგრები"] },
  { name: "მაცივრები", image: img("commercial-fridge.png"), children: ["ვერტიკალური", "ჰორიზონტალური"] },
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
  image?: string;
};

const items: Seed[] = [
  { name: "საწყობის სტელაჟი 200×100×40, 5 თარო", cat: "მსუბუქი დატვირთვა", price: 189, material: "ლითონი", color: "რუხი", w: 100, h: 200, d: 40, load: 150, shelves: 5, stock: 24, featured: true, image: img("warehouse-rack.png") },
  { name: "საწყობის სტელაჟი 200×120×50, 5 თარო", cat: "საშუალო დატვირთვა", price: 249, salePrice: 219, material: "ლითონი", color: "რუხი", w: 120, h: 200, d: 50, load: 250, shelves: 5, stock: 12, image: img("warehouse-rack.png") },
  { name: "პალეტური სტელაჟი 300×270×110", cat: "მძიმე დატვირთვა (პალეტური)", price: 1290, material: "ლითონი", color: "ლურჯი/ნარინჯისფერი", w: 270, h: 300, d: 110, load: 1000, shelves: 3, stock: 4, image: img("warehouse-rack.png") },
  { name: "სავაჭრო სტელაჟი კედლის 220×100×45", cat: "კედლის სტელაჟი", price: 390, material: "ლითონი", color: "შავი", w: 100, h: 220, d: 45, load: 60, shelves: 5, stock: 6, featured: true, image: img("single-retail-shelf.png") },
  { name: "სავაჭრო სტელაჟი ორმხრივი 150×100×70", cat: "კუნძულის სტელაჟი", price: 520, material: "ლითონი", color: "შავი", w: 100, h: 150, d: 70, load: 60, shelves: 8, stock: 3, image: img("single-retail-shelf.png") },
  { name: "მეტალის კარადა ორკარიანი 180×80×50", cat: "ტანსაცმლის კარადები", price: 420, material: "ლითონი", color: "რუხი", w: 80, h: 180, d: 50, load: 40, shelves: 2, stock: 10, featured: true, image: img("single-metal-locker.png") },
  { name: "საარქივო კარადა 195×90×40", cat: "საარქივო კარადები", price: 560, salePrice: 499, material: "ლითონი", color: "თეთრი", w: 90, h: 195, d: 40, load: 50, shelves: 4, stock: 5, image: img("single-metal-locker.png") },
  { name: "სალაროს მაგიდა 180×90", cat: "სტანდარტული", price: 1150, material: "ლამინატი", color: "შავი", w: 180, h: 90, d: 90, load: 0, shelves: 0, stock: 3, image: img("checkout-counter.png") },
  { name: "სალაროს მაგიდა კუთხის 220×110", cat: "კუთხის", price: 1490, material: "ლამინატი", color: "შავი", w: 220, h: 90, d: 110, load: 0, shelves: 0, stock: 2, image: img("checkout-counter.png") },
  { name: "მარკეტის კალათა 22 ლ", cat: "კალათები და ურიკები", price: 19, material: "ლითონი", color: "შავი", w: 45, h: 25, d: 30, load: 15, shelves: 0, stock: 120, image: img("shopping-basket.png") },
  { name: "სკანერის დამცავი გამჭვირვალე", cat: "დგარები და სამაგრები", price: 45, material: "პლასტმასი", color: "გამჭვირვალე", w: 30, h: 20, d: 2, load: 0, shelves: 0, stock: 40, image: img("scanner-protector.jpg") },
  { name: "სავაჭრო მაცივარი მინისკარიანი 600 ლ", cat: "ვერტიკალური", price: 2890, material: "ლითონი", color: "შავი", w: 70, h: 200, d: 65, load: 0, shelves: 5, stock: 2, image: img("commercial-fridge.png") },
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
      .values({ name: root.name, slug: slugify(root.name), image: root.image ?? null, sortOrder: order++ })
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
        images: it.image ? [it.image] : [],
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
  process.exit(0);
})();
