# Shelves Shop (თაროების ონლაინ მაღაზია)

Next.js 16 ონლაინ მაღაზია და ადმინ პანელი (`/admin`). ბაზა: Neon Postgres (Drizzle ORM), სურათები: Vercel Blob.
ბრენდის სახელი ჯერ placeholder-ია (`src/lib/site.ts` → `site.name`), დიზაინი მოგვიანებით ემატება.

## გაშვება ლოკალურად

```bash
npm install
cp .env.example .env.local        # შეავსეთ DATABASE_URL, AUTH_SECRET, BLOB_READ_WRITE_TOKEN
npx drizzle-kit push               # ცხრილების შექმნა ბაზაში
npx tsx scripts/create-admin.ts admin@example.ge პაროლი123
npx tsx scripts/seed.ts            # სატესტო კატეგორიები და თაროები (არასავალდებულო)
npm run dev                        # http://localhost:3000, ადმინი: /admin
```

## სტრუქტურა

```
src/app/(shop)/        საიტი: მთავარი, კატალოგი, კატეგორია, პროდუქტი, კალათა, შეკვეთა, გვერდები
src/app/admin/         ადმინი: შეკვეთები, პროდუქცია, კატეგორიები, კონტენტი, პარამეტრები
src/app/api/search     ძიების API (ჰედერის საძიებო)
src/components/        UI კომპონენტები (layout/, cart/, admin/)
src/db/schema.ts       ცხრილები: categories, products, product_categories, orders, admins, settings
src/lib/data.ts        კატალოგის წაკითხვა (კეშირებული)
src/lib/actions/       Server Actions: admin.ts (CRUD), order.ts (შეკვეთის გაფორმება)
src/lib/content-schema.ts  რედაქტირებადი ტექსტები + ადმინის რედაქტორის ველები
scripts/               create-admin.ts, seed.ts
```

## პროდუქტის ველები (თარო)

ფასი, ფასდაკლება, მარაგი, სურათები, კატეგორიები + თაროს პარამეტრები:
მასალა, ფერი, სიგანე/სიმაღლე/სიღრმე (სმ), დატვირთვა თაროზე (კგ), თაროების რაოდენობა, დამატებითი მახასიათებლები.
კატალოგში ფილტრი: კატეგორია, ფასი, მასალა, ფერი, ფასდაკლება, მარაგი; დალაგება.

## ბრძანებები

- `npx drizzle-kit push` — სქემის განახლება ბაზაში
- `npx tsx scripts/create-admin.ts <email> <password>` — ადმინის შექმნა / პაროლის აღდგენა
- `npx tsx scripts/seed.ts` — სატესტო მონაცემები (მხოლოდ ცარიელ ბაზაში)
