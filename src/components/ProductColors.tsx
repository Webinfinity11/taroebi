"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import type { ColorOption } from "@/db/schema";
import { money } from "@/lib/format";

type ColorState = { colors: ColorOption[]; selected: ColorOption | null; select: (name: string) => void };

const ColorContext = createContext<ColorState | null>(null);

/** Holds the chosen color on the product page, shared by the picker, the gallery and the add-to-cart button. */
export function ProductColors({ colors, children }: { colors: ColorOption[]; children: ReactNode }) {
  // Open on a choice that has a photo, so the page doesn't start without one.
  const [name, setName] = useState((colors.find((c) => c.image) ?? colors[0])?.name ?? null);
  const selected = colors.find((c) => c.name === name) ?? null;
  return <ColorContext.Provider value={{ colors, selected, select: setName }}>{children}</ColorContext.Provider>;
}

export function useSelectedColor() {
  return useContext(ColorContext)?.selected ?? null;
}

/**
 * The photos for the current choice: a variation shows only the photo chosen for it (none if none was chosen);
 * the product's own color shows the product's photos without those of the variations.
 */
export function useShownImages(images: string[]) {
  const state = useContext(ColorContext);
  const selected = state?.selected;
  if (!selected) return images;
  if (!selected.isMain) return selected.image ? [selected.image] : [];
  const taken = new Set(state.colors.filter((c) => !c.isMain).map((c) => c.image));
  return images.filter((url, i) => i === 0 || !taken.has(url));
}

/** The chosen variation's own name; the product's name (children) otherwise. */
export function ColorTitle({ children }: { children: ReactNode }) {
  return useSelectedColor()?.title || children;
}

/** The chosen color's own price; the product's price (children) otherwise. */
export function ColorPrice({ children }: { children: ReactNode }) {
  const price = useSelectedColor()?.price;
  return price != null ? <>{money(price)} ₾</> : children;
}

export function ColorPicker() {
  const state = useContext(ColorContext);
  if (!state?.colors.length) return null;
  return (
    <div className="product-colors">
      <span className="product-quantity-label">
        ფერი: <span className="product-color-name">{state.selected?.name}</span>
      </span>
      <div className="product-color-list">
        {state.colors.map((c) => (
          <button
            key={c.name}
            type="button"
            className="product-color"
            style={{ backgroundColor: c.hex }}
            aria-label={c.name}
            aria-pressed={c.name === state.selected?.name}
            title={c.name}
            onClick={() => state.select(c.name)}
          />
        ))}
      </div>
    </div>
  );
}
