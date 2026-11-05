"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { ColorOption, Product, Spec } from "@/db/schema";
import { deleteProduct, saveProduct, uploadImage } from "@/lib/actions/admin";
import { slugify } from "@/lib/admin-shared";
import { Button, Card, Field, inputCls } from "./ui";
import { ImageUploader } from "./ImageUploader";

type Cat = { id: number; name: string; parentId: number | null };
type ColorRow = Omit<ColorOption, "price"> & { price: string };
const MAX_IMAGES = 12;

/** A color set either from the picker or by typing its code; a half-typed code stays local until it is valid. */
function ColorCode({ value, onChange, label }: { value: string; onChange: (hex: string) => void; label: string }) {
  const [draft, setDraft] = useState<string | null>(null);
  return (
    <>
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={label}
        className="h-10 w-12 shrink-0 cursor-pointer rounded border border-slate-300 bg-white p-1"
      />
      <input
        value={draft ?? value}
        onChange={(e) => {
          setDraft(e.target.value);
          if (/^#[0-9a-fA-F]{6}$/.test(e.target.value)) onChange(e.target.value.toLowerCase());
        }}
        onBlur={() => setDraft(null)}
        placeholder="#ffffff"
        aria-label="ფერის კოდი"
        spellCheck={false}
        className={`${inputCls} w-28 shrink-0`}
      />
    </>
  );
}

// Inline, because the site-wide button reset overrides Tailwind's border utilities.
const thumbBorder = (selected: boolean) => ({ border: selected ? "2px solid #1850e8" : "1px solid #e2e8f0" });

export function ProductForm({ product, categories, selected }: { product: Product | null; categories: Cat[]; selected: number[] }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  const [name, setName] = useState(product?.name ?? "");
  const [slug, setSlug] = useState(product?.slug ?? "");
  const [sku, setSku] = useState(product?.sku ?? "");
  const [price, setPrice] = useState(product ? String(product.price) : "");
  const [salePrice, setSalePrice] = useState(product?.salePrice != null ? String(product.salePrice) : "");
  const [inStock, setInStock] = useState(product?.inStock ?? true);
  const [stockQty, setStockQty] = useState(product?.stockQty != null ? String(product.stockQty) : "");
  const tracked = stockQty.trim() !== "";
  const [published, setPublished] = useState(product?.published ?? true);
  const [featured, setFeatured] = useState(product?.featured ?? false);
  const [summary, setSummary] = useState(product?.summary ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const numStr = (n: number | null | undefined) => (n == null ? "" : String(n));
  const [material, setMaterial] = useState(product?.material ?? "");
  const [color, setColor] = useState(product?.color ?? "");
  const [colorHex, setColorHex] = useState(product?.colorHex ?? "#ffffff");
  const [colorOptions, setColorOptions] = useState<ColorRow[]>(
    (product?.colorOptions ?? []).map((c) => ({ ...c, price: c.price != null ? String(c.price) : "" })),
  );
  const [uploadingColor, setUploadingColor] = useState<number | null>(null);
  const patchColor = (i: number, patch: Partial<ColorRow>) => setColorOptions((rows) => rows.map((c, j) => (j === i ? { ...c, ...patch } : c)));

  // The photo joins the product's images and becomes this color's photo.
  const uploadColorPhoto = async (i: number, file: File | undefined) => {
    if (!file) return;
    if (images.length >= MAX_IMAGES) return setMessage({ ok: false, text: `მაქსიმუმ ${MAX_IMAGES} სურათია. ჯერ წაშალეთ რომელიმე.` });
    setMessage(null);
    setUploadingColor(i);
    const form = new FormData();
    form.set("file", file);
    const res = await uploadImage(form);
    setUploadingColor(null);
    if (!res.ok) return setMessage({ ok: false, text: res.error });
    setImages((list) => [...list, res.url]);
    patchColor(i, { image: res.url });
  };
  const [widthCm, setWidthCm] = useState(numStr(product?.widthCm));
  const [heightCm, setHeightCm] = useState(numStr(product?.heightCm));
  const [depthCm, setDepthCm] = useState(numStr(product?.depthCm));
  const [loadKg, setLoadKg] = useState(numStr(product?.loadKg));
  const [shelfCount, setShelfCount] = useState(numStr(product?.shelfCount));
  const [specs, setSpecs] = useState<Spec[]>(product?.specs ?? []);
  const [images, setImages] = useState<string[]>(product?.images ?? []);
  const [cats, setCats] = useState<number[]>(selected);
  const [catFilter, setCatFilter] = useState("");

  const toggleCat = (id: number) => {
    setCats((cs) => {
      if (cs.includes(id)) return cs.filter((c) => c !== id);
      // Selecting a subcategory also selects its parents.
      const add = [id];
      for (let p = categories.find((c) => c.id === id)?.parentId; p; p = categories.find((c) => c.id === p)?.parentId)
        add.push(p);
      return [...new Set([...cs, ...add])];
    });
  };

  const submit = () =>
    start(async () => {
      setMessage(null);
      const res = await saveProduct(product?.id ?? null, {
        name,
        slug,
        sku,
        price: price || 0,
        salePrice: salePrice || null,
        inStock,
        stockQty: tracked ? stockQty : null,
        published,
        featured,
        summary,
        description,
        material,
        color,
        colorHex,
        colorOptions,
        widthCm,
        heightCm,
        depthCm,
        loadKg,
        shelfCount,
        specs,
        images,
        categoryIds: cats,
      });
      if (!res.ok) return setMessage({ ok: false, text: res.error });
      setMessage({ ok: true, text: "შენახულია ✓" });
      if (!product) router.replace(`/admin/products/${res.id}`);
      else router.refresh();
    });

  const remove = () => {
    if (!product || !confirm(`წაიშალოს „${product.name}“? ამის დაბრუნება შეუძლებელია.`)) return;
    start(async () => {
      await deleteProduct(product.id);
      router.replace("/admin/products");
    });
  };

  const roots = categories.filter((c) => !c.parentId);
  const childrenOf = (id: number) => categories.filter((c) => c.parentId === id);
  const matches = (c: Cat) => !catFilter || c.name.toLowerCase().includes(catFilter.toLowerCase());

  const branchMatches = (c: Cat): boolean => matches(c) || childrenOf(c.id).some(branchMatches);

  const renderCat = (c: Cat, depth: number): React.ReactNode => {
    const kids = childrenOf(c.id);
    if (!branchMatches(c)) return null;
    return (
      <div key={c.id}>
        <label className="flex items-center gap-2 py-1 cursor-pointer" style={{ paddingLeft: depth * 18 }}>
          <input type="checkbox" checked={cats.includes(c.id)} onChange={() => toggleCat(c.id)} className="h-4 w-4 accent-[#1850e8]" />
          <span className={depth === 0 ? "font-semibold" : ""}>{c.name}</span>
        </label>
        {kids.map((k) => renderCat(k, depth + 1))}
      </div>
    );
  };

  return (
    <form
      className="grid lg:grid-cols-[1fr_320px] gap-5 items-start"
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
    >
      <div className="grid gap-5">
        <Card>
          <div className="grid gap-4">
            <Field label="დასახელება *">
              <input
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (!product) setSlug(slugify(e.target.value));
                }}
                required
                className={inputCls}
              />
            </Field>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="ბმული (slug)" hint="ავტომატურად იქმნება სახელიდან">
                <input value={slug} onChange={(e) => setSlug(e.target.value)} className={inputCls} />
              </Field>
              <Field label="კოდი (SKU)">
                <input value={sku} onChange={(e) => setSku(e.target.value)} className={inputCls} />
              </Field>
            </div>
          </div>
        </Card>

        <Card title="სურათები">
          <ImageUploader value={images} onChange={setImages} />
        </Card>

        <Card title="აღწერა">
          <div className="grid gap-4">
            <Field label="მოკლე აღწერა">
              <textarea value={summary} onChange={(e) => setSummary(e.target.value)} rows={3} className={inputCls} />
            </Field>
            <Field label="სრული აღწერა">
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={6} className={inputCls} />
            </Field>
          </div>
        </Card>

        <Card title="თაროს პარამეტრები">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="მასალა" hint="მაგ. ლითონი, ხე, ლამინატი">
              <input value={material} onChange={(e) => setMaterial(e.target.value)} list="materials" className={inputCls} />
              <datalist id="materials">
                {["ლითონი", "ხე", "ლამინატი", "პლასტმასი", "მინა", "კომბინირებული"].map((m) => (
                  <option key={m} value={m} />
                ))}
              </datalist>
            </Field>
            <Field label="ფერი" hint="არასავალდებულო. ცარიელი = საიტზე არ ჩანს">
              <div className="flex gap-2">
                <ColorCode value={colorHex} onChange={setColorHex} label="მთავარი ფერის არჩევა" />
                <input value={color} onChange={(e) => setColor(e.target.value)} placeholder="მაგ. თეთრი" className={inputCls} />
              </div>
            </Field>
          </div>
          <div className="grid grid-cols-3 gap-3 mt-4">
            <Field label="სიგანე (სმ)">
              <input type="number" step="0.1" min="0" value={widthCm} onChange={(e) => setWidthCm(e.target.value)} className={inputCls} />
            </Field>
            <Field label="სიმაღლე (სმ)">
              <input type="number" step="0.1" min="0" value={heightCm} onChange={(e) => setHeightCm(e.target.value)} className={inputCls} />
            </Field>
            <Field label="სიღრმე (სმ)">
              <input type="number" step="0.1" min="0" value={depthCm} onChange={(e) => setDepthCm(e.target.value)} className={inputCls} />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-4">
            <Field label="დატვირთვა თაროზე (კგ)">
              <input type="number" step="1" min="0" value={loadKg} onChange={(e) => setLoadKg(e.target.value)} className={inputCls} />
            </Field>
            <Field label="თაროების რაოდენობა">
              <input type="number" step="1" min="0" value={shelfCount} onChange={(e) => setShelfCount(e.target.value)} className={inputCls} />
            </Field>
          </div>
        </Card>

        <Card
          title="ფერის ვარიაციები"
          actions={
            <Button type="button" variant="secondary" onClick={() => setColorOptions([...colorOptions, { name: "", hex: "#000000", image: null, price: "" }])}>
              + ფერის დამატება
            </Button>
          }
        >
          <p className="text-slate-500 text-sm mb-3">
            არასავალდებულო. ზემოთ მითითებული „ფერი“ მყიდველს პირველ არჩევნად გამოუჩნდება მთავარი ფოტოთი და ფასით, აქ კი ამატებ დანარჩენ ფერებს.
          </p>
          <div className="grid gap-3">
            {colorOptions.map((c, i) => (
              <div key={i} className="grid gap-2 rounded-lg border border-slate-200 p-3">
                <div className="flex flex-wrap gap-2 sm:flex-nowrap">
                  <ColorCode value={c.hex} onChange={(hex) => patchColor(i, { hex })} label="ფერის არჩევა" />
                  <input placeholder="მაგ. შავი" aria-label="ფერის დასახელება" value={c.name} onChange={(e) => patchColor(i, { name: e.target.value })} className={`${inputCls} min-w-40 flex-1`} />
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="ფასი ₾"
                    aria-label="ამ ფერის ფასი"
                    title="ცარიელი = პროდუქტის ფასი"
                    value={c.price}
                    onChange={(e) => patchColor(i, { price: e.target.value })}
                    className={`${inputCls} w-28`}
                  />
                  <Button type="button" variant="danger" onClick={() => setColorOptions(colorOptions.filter((_, j) => j !== i))} aria-label="წაშლა">
                    ✕
                  </Button>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs text-slate-500">ამ ფერის ფოტო:</span>
                  <label className="inline-flex h-12 cursor-pointer items-center rounded border border-dashed border-slate-300 px-3 text-xs font-semibold text-[#1850e8]">
                    {uploadingColor === i ? "იტვირთება…" : "+ ფოტოს ატვირთვა"}
                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      disabled={uploadingColor !== null}
                      onChange={(e) => {
                        uploadColorPhoto(i, e.target.files?.[0]);
                        e.target.value = "";
                      }}
                    />
                  </label>
                  {images.length > 0 && (
                    <button
                      type="button"
                      onClick={() => patchColor(i, { image: null })}
                      aria-pressed={!c.image || !images.includes(c.image)}
                      className={`h-12 rounded px-2 text-xs ${!c.image || !images.includes(c.image) ? "text-[#1850e8]" : "text-slate-500"}`}
                      style={thumbBorder(!c.image || !images.includes(c.image))}
                    >
                      ფოტოს გარეშე
                    </button>
                  )}
                  {images.map((url, n) => (
                      <button
                        key={url}
                        type="button"
                        onClick={() => patchColor(i, { image: url })}
                        aria-pressed={c.image === url}
                        aria-label={`სურათი ${n + 1}`}
                        className="relative h-12 w-12 rounded bg-white"
                        style={thumbBorder(c.image === url)}
                      >
                        <Image src={url} alt="" fill sizes="48px" className="object-contain p-0.5" />
                      </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card
          title="დამატებითი მახასიათებლები"
          actions={
            <Button type="button" variant="secondary" onClick={() => setSpecs([...specs, { label: "", value: "" }])}>
              + დამატება
            </Button>
          }
        >
          {specs.length === 0 && <p className="text-slate-500 text-sm">მაგ. წონა, გარანტია, შეფუთვა - ყველაფერი, რაც ზემოთ არ არის.</p>}
          <div className="grid gap-2">
            {specs.map((s, i) => (
              <div key={i} className="flex gap-2">
                <input
                  placeholder="მაგ. წონა"
                  value={s.label}
                  onChange={(e) => setSpecs(specs.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)))}
                  className={`${inputCls} w-2/5`}
                />
                <input
                  placeholder="მაგ. 3.1 კგ"
                  value={s.value}
                  onChange={(e) => setSpecs(specs.map((x, j) => (j === i ? { ...x, value: e.target.value } : x)))}
                  className={inputCls}
                />
                <Button type="button" variant="danger" onClick={() => setSpecs(specs.filter((_, j) => j !== i))} aria-label="წაშლა">
                  ✕
                </Button>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid gap-5 lg:sticky lg:top-6">
        <Card>
          <div className="grid gap-3">
            <Button disabled={pending}>{pending ? "ინახება…" : "შენახვა"}</Button>
            {message && <p className={`text-sm ${message.ok ? "text-green-700" : "text-red-600"}`}>{message.text}</p>}
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} className="h-4 w-4 accent-[#1850e8]" />
              საიტზე გამოჩნდეს
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={tracked ? Number(stockQty) > 0 : inStock}
                disabled={tracked}
                onChange={(e) => setInStock(e.target.checked)}
                className="h-4 w-4 accent-[#1850e8]"
              />
              მარაგშია {tracked && <span className="text-xs text-slate-500">(რაოდენობით)</span>}
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} className="h-4 w-4 accent-[#1850e8]" />
              რეკომენდებული (სიაში პირველი)
            </label>
            {product && (
              <Button type="button" variant="danger" onClick={remove} disabled={pending}>
                პროდუქტის წაშლა
              </Button>
            )}
          </div>
        </Card>

        <Card title="ფასი">
          <div className="grid grid-cols-2 gap-3">
            <Field label="ფასი ₾" hint="მაგ. 12.50">
              <input type="number" step="0.01" min="0" value={price} onChange={(e) => setPrice(e.target.value)} className={inputCls} />
            </Field>
            <Field label="ფასდაკლებით ₾" hint="ცარიელი = არა">
              <input type="number" step="0.01" min="0" value={salePrice} onChange={(e) => setSalePrice(e.target.value)} className={inputCls} />
            </Field>
          </div>
        </Card>

        <Card title="მარაგი">
          <Field label="რაოდენობა მარაგში" hint="ცარიელი = არ ითვლება. შეკვეთისას ავტომატურად აკლდება.">
            <input type="number" min="0" step="1" value={stockQty} onChange={(e) => setStockQty(e.target.value)} placeholder="არ ითვლება" className={inputCls} />
          </Field>
          {tracked && Number(stockQty) <= 5 && (
            <p className={`text-sm mt-2 ${Number(stockQty) === 0 ? "text-red-600" : "text-amber-600"}`}>
              {Number(stockQty) === 0 ? "ამოწურულია - საიტზე „არ არის მარაგში“" : "მცირე მარაგი - საიტზე ჩანს „დარჩა N ც.“"}
            </p>
          )}
        </Card>

        <Card title={`კატეგორიები (${cats.length})`}>
          <input placeholder="ფილტრი…" value={catFilter} onChange={(e) => setCatFilter(e.target.value)} className={`${inputCls} mb-2`} />
          <div className="max-h-96 overflow-y-auto text-sm">{roots.map((r) => renderCat(r, 0))}</div>
        </Card>
      </div>
    </form>
  );
}
