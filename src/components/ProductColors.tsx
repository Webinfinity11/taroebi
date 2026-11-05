"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import type { ColorOption } from "@/db/schema";
import { money } from "@/lib/format";

type ColorState = { colors: ColorOption[]; selected: ColorOption | null; select: (name: string) => void };

const ColorContext = createContext<ColorState | null>(null);

/** Holds the chosen color on the product page, shared by the picker, the gallery and the add-to-cart button. */
export function ProductColors({ colors, children }: { colors: ColorOption[]; children: ReactNode }) {
  const [name, setName] = useState(colors[0]?.name ?? null);
  const selected = colors.find((c) => c.name === name) ?? null;
  return <ColorContext.Provider value={{ colors, selected, select: setName }}>{children}</ColorContext.Provider>;
}

export function useSelectedColor() {
  return useContext(ColorContext)?.selected ?? null;
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
