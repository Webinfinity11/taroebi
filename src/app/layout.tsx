import type { Metadata, Viewport } from "next";
import "@fontsource-variable/noto-sans-georgian";
import { site } from "@/lib/site";
import "./globals.css";
import "./pages.css";
import "./design.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} - თაროების ონლაინ მაღაზია`, template: `%s | ${site.name}` },
  description: site.description,
  openGraph: { siteName: site.name, locale: "ka_GE", type: "website" },
};

export const viewport: Viewport = { themeColor: "#d1e34f", colorScheme: "only light" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ka">
      <body>{children}</body>
    </html>
  );
}
