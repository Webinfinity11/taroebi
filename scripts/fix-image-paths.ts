// One-off: design images were converted to .webp; rewrite stored paths accordingly.
import "./env";
import { sql } from "drizzle-orm";
import { db } from "../src/db";

(async () => {
  await db.execute(sql`update categories set image = regexp_replace(image, '\\.(png|jpg)$', '.webp') where image like '/img/design/%'`);
  await db.execute(
    sql`update products set images = (select coalesce(jsonb_agg(regexp_replace(v, '\\.(png|jpg)$', '.webp')), '[]'::jsonb) from jsonb_array_elements_text(images) v) where images::text like '%/img/design/%'`,
  );
  console.log("image paths updated");
  process.exit(0);
})();
