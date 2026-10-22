/** Two-tone isometric shelf logo from the design. `currentColor` is the dark half, lime is fixed. */
export function BrandMark({ className = "brand-mark" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 52" aria-hidden="true">
      <path fill="#d1e34f" d="M3 9 25 2l20 8-22 8Z" />
      <path fill="currentColor" d="m3 9 20 9v8L3 18Z" />
      <path fill="#d1e34f" d="m3 25 20 8v8L3 33Z" />
      <path fill="currentColor" d="m23 18 22-8v9l-22 8Z" />
      <path fill="currentColor" d="m3 41 20 9 22-9v-9l-22 9Z" />
      <path fill="#d1e34f" d="m23 26 22-7v9l-22 8Z" />
    </svg>
  );
}
